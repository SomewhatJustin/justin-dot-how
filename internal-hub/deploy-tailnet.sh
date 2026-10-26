#!/usr/bin/env bash
set -euo pipefail

SOURCE_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
DESTINATION="justin@openclaw-thinko"

ssh "${DESTINATION}" 'mkdir -p ~/.local/share/internal-hub/site ~/.config/systemd/user'
scp "${SOURCE_DIR}/index.html" "${SOURCE_DIR}/styles.css" \
  "${DESTINATION}:.local/share/internal-hub/site/"
scp "${SOURCE_DIR}/internal-hub.service" "${DESTINATION}:.config/systemd/user/"
ssh "${DESTINATION}" 'systemctl --user daemon-reload && systemctl --user enable --now internal-hub.service && systemctl --user restart internal-hub.service && sudo -n tailscale serve --bg --set-path /internal http://127.0.0.1:8791'

curl --fail --silent --show-error --retry 3 --retry-delay 1 \
  https://openclaw-thinko.tail6900fe.ts.net/internal/ >/dev/null
echo "Deployed tailnet-only internal hub"
