#!/bin/bash
cd /home/justin/Developer/justin-dot-how
git pull origin main  # Replace 'main' with your default branch if different
/usr/bin/npm ci  # Install any new dependencies
/usr/bin/npm run eleventy  # Rebuild the site