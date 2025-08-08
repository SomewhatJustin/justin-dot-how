const fs = require("fs");
const path = require("path");

/**
 * Returns photography data:
 *  - all: full list of image URLs
 *  - filmstrip: a randomized selection for homepage filmstrip
 */
module.exports = () => {
  const directoryPath = path.join(process.cwd(), "photography");
  let files = [];
  try {
    files = fs.readdirSync(directoryPath, { withFileTypes: true });
  } catch (err) {
    return { all: [], filmstrip: [] };
  }

  const validExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif"]);

  const all = files
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => name.toLowerCase() !== "index.html")
    .filter((name) => validExtensions.has(path.extname(name).toLowerCase()))
    .map((name) => `/photography/${name}`);
  
  // Fisher–Yates shuffle (non-mutating)
  const shuffled = (() => {
    const arr = all.slice();
    for (let i = arr.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  })();

  const filmstrip = shuffled.slice(0, 8);

  return { all, filmstrip };
};


