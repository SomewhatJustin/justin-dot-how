#!/usr/bin/env node
const fs = require('fs/promises');
const path = require('path');

const PIXELFED_TOKEN = process.env.PIXELFED_TOKEN;
const PIXELFED_INSTANCE = process.env.PIXELFED_INSTANCE || process.env.PIXELFED_BASE_URL || '';
const STATUS_LIMIT = parseInt(process.env.PIXELFED_STATUS_LIMIT || '40', 10);

if (typeof fetch !== 'function') {
  console.error('Global fetch is not available. Use Node.js 18 or newer.');
  process.exit(1);
}

if (!PIXELFED_TOKEN) {
  console.error('Missing PIXELFED_TOKEN environment variable');
  process.exit(1);
}

if (!PIXELFED_INSTANCE) {
  console.error('Missing PIXELFED_INSTANCE environment variable');
  process.exit(1);
}

const OUTPUT_DIR = path.join(__dirname, '..', 'photography');
const LEDGER_PATH = path.join(__dirname, '..', '_data', 'pixelfed.json');

async function main() {
  const ledger = await readLedger();
  const account = await api('/api/v1/accounts/verify_credentials');
  console.log(`Authenticated as ${account.username} (${account.id})`);

  const statuses = await api(
    `/api/v1/accounts/${account.id}/statuses?limit=${STATUS_LIMIT}&only_media=true&exclude_reblogs=true`
  );

  let newDownloads = 0;
  for (const status of statuses) {
    if (ledger.processedIds.has(status.id)) continue;

    const attachments = Array.isArray(status.media_attachments) ? status.media_attachments : [];
    if (attachments.length === 0) {
      ledger.processedIds.add(status.id);
      continue;
    }

    for (const media of attachments) {
      const sourceUrl = media.url || media.preview_url;
      if (!sourceUrl) continue;

      const ext = extnameFromUrl(sourceUrl) || '.jpg';
      const filename = `pixelfed-${status.id}-${media.id}${ext}`;
      const destinationPath = path.join(OUTPUT_DIR, filename);

      if (await fileExists(destinationPath)) {
        console.log(`Skipping existing file ${filename}`);
        continue;
      }

      await downloadFile(sourceUrl, destinationPath);
      newDownloads += 1;
      console.log(`Saved ${filename}`);
    }

    ledger.processedIds.add(status.id);
  }

  await writeLedger(ledger);
  console.log(`Done. Downloaded ${newDownloads} new file(s).`);
}

async function api(endpoint) {
  const url = `${PIXELFED_INSTANCE.replace(/\/$/, '')}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${PIXELFED_TOKEN}`,
      'User-Agent': 'pixelfed-sync/1.0 (github.com/justin-howard/justin-dot-how)'
    }
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`API ${url} failed: ${response.status} ${response.statusText} => ${body}`);
  }

  return response.json();
}

async function downloadFile(url, destinationPath) {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${PIXELFED_TOKEN}`,
      'User-Agent': 'pixelfed-sync/1.0 (github.com/justin-howard/justin-dot-how)'
    }
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Download failed ${url}: ${response.status} ${response.statusText} => ${body}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await fs.mkdir(path.dirname(destinationPath), { recursive: true });
  await fs.writeFile(destinationPath, buffer);
}

function extnameFromUrl(url) {
  try {
    const pathname = new URL(url).pathname;
    return path.extname(pathname);
  } catch (_err) {
    return '';
  }
}

async function readLedger() {
  try {
    const raw = await fs.readFile(LEDGER_PATH, 'utf8');
    const data = JSON.parse(raw);
    const processedIds = new Set(Array.isArray(data.processedIds) ? data.processedIds : data);
    return { processedIds };
  } catch (_err) {
    return { processedIds: new Set() };
  }
}

async function writeLedger(ledger) {
  const data = { processedIds: Array.from(ledger.processedIds) };
  await fs.mkdir(path.dirname(LEDGER_PATH), { recursive: true });
  await fs.writeFile(LEDGER_PATH, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch (_err) {
    return false;
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
