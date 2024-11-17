#!/bin/bash
cd /home/justin/Developer/justin-dot-how || exit 1

# Log file
LOGFILE="/home/justin/Developer/justin-dot-how/update.log"

echo "Starting update: $(date)" >> "$LOGFILE"

# Kill any running eleventy
pkill -f "npm run eleventy"

# Pull the latest changes
git pull origin main >> "$LOGFILE" 2>&1

# Install dependencies
/usr/bin/npm ci >> "$LOGFILE" 2>&1

# Rebuild the site
sudo systemctl restart eleventy.service >> "$LOGFILE" 2>&1

echo "Update completed: $(date)" >> "$LOGFILE"
