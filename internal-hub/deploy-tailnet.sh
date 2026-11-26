#!/usr/bin/env bash
set -euo pipefail

SOURCE_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
DESTINATION="justin@elitedesk-1"

ssh "${DESTINATION}" 'mkdir -p ~/.local/share/internal-hub/site ~/.config/systemd/user'
scp "${SOURCE_DIR}/index.html" "${SOURCE_DIR}/styles.css" \
  "${DESTINATION}:.local/share/internal-hub/site/"
scp "${SOURCE_DIR}/internal-hub.service" "${DESTINATION}:.config/systemd/user/"
ssh "${DESTINATION}" 'systemctl --user daemon-reload && systemctl --user enable --now internal-hub.service && systemctl --user restart internal-hub.service && sudo -n tailscale serve --bg --https=10004 --set-path /internal http://127.0.0.1:8791'

curl --fail --silent --show-error --retry 3 --retry-delay 1 \
  https://elitedesk-1.tail6900fe.ts.net:10004/internal/ >/dev/null
echo "Deployed tailnet-only internal hub"
