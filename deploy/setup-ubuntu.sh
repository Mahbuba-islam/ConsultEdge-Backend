#!/usr/bin/env bash
# One-shot provisioning script for Ubuntu 22.04+ VM.
# Installs Node 20, PM2, Nginx, Certbot.
# Run as a sudo-enabled user:  bash deploy/setup-ubuntu.sh

set -euo pipefail

echo "==> Updating apt"
sudo apt update
sudo apt upgrade -y

echo "==> Installing base packages"
sudo apt install -y curl git build-essential ca-certificates ufw nginx certbot python3-certbot-nginx

echo "==> Installing Node.js 20 LTS"
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt install -y nodejs
fi

echo "==> Installing PM2 globally"
sudo npm i -g pm2

echo "==> Configuring firewall"
sudo ufw allow OpenSSH || true
sudo ufw allow 'Nginx Full' || true
yes | sudo ufw enable || true

echo "==> Versions"
node -v
npm -v
pm2 -v
nginx -v

cat <<'DONE'

Next steps:
  1. cd into your project directory
  2. cp .env.example .env   and fill in production values
  3. npm ci
  4. npm run service:up
  5. Copy deploy/nginx.conf.example to /etc/nginx/sites-available/consultedge
     sudo ln -s /etc/nginx/sites-available/consultedge /etc/nginx/sites-enabled/consultedge
     sudo nginx -t && sudo systemctl reload nginx
  6. sudo certbot --nginx -d api.yourdomain.com
  7. pm2 startup   (run printed command)  && pm2 save
DONE
