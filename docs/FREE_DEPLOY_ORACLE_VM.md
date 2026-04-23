# Free Deployment Guide (Socket.IO + Multer + EJS)

This guide is for deploying this backend for free with full WebSocket support.

## Why this path

Serverless hosts are usually a bad fit for a long-running Socket.IO server and local file uploads.
A free VM keeps a real Node process alive, supports WebSocket upgrades, and works with EJS rendering.

## Target architecture

- App host: Oracle Cloud Always Free VM (Ubuntu)
- Database: Neon free PostgreSQL
- Upload storage: Cloudinary free (for chat attachments and other uploads)
- Process manager: PM2
- Reverse proxy + TLS: Nginx + Let's Encrypt

## 1) Provision VM

1. Create an Oracle Cloud free account.
2. Create an Always Free ARM VM (Ubuntu 22.04 or newer).
3. Open inbound ports in Oracle security list:
- 22 (SSH)
- 80 (HTTP)
- 443 (HTTPS)

## 2) Install runtime on VM

```bash
sudo apt update
sudo apt install -y curl git nginx certbot python3-certbot-nginx
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs build-essential
sudo npm i -g pm2
```

## 3) Clone app and install deps

```bash
git clone <your-repo-url> consultedge-backend
cd consultedge-backend
npm ci
```

## 4) Create environment file

Create `.env` in project root and set production values.

Required highlights:
- `NODE_ENV=production`
- `PORT=5000`
- `DATABASE_URL=<neon direct connection string>`
- `FRONTEND_URL=<your frontend domain>`
- `BETTER_AUTH_URL=<your backend public domain>`
- `CLOUDINARY_*` keys
- `STRIPE_*` keys

## 5) Start backend as service (one command)

```bash
npm run service:up
```

That command does:
- build app
- run `prisma migrate deploy`
- start app with PM2
- persist PM2 process list

Useful commands:

```bash
npm run service:logs
npm run service:restart
pm2 status
```

## 6) Auto-start PM2 after reboot

```bash
pm2 startup
# run the command printed by pm2
pm2 save
```

## 7) Configure Nginx reverse proxy

Create `/etc/nginx/sites-available/consultedge`:

```nginx
server {
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Required for Socket.IO/WebSocket
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

Enable config:

```bash
sudo ln -s /etc/nginx/sites-available/consultedge /etc/nginx/sites-enabled/consultedge
sudo nginx -t
sudo systemctl reload nginx
```

## 8) Enable HTTPS

```bash
sudo certbot --nginx -d api.yourdomain.com
```

## 9) Post-deploy checks

- Health route responds: `GET /`
- Socket.IO connects from frontend
- Chat attachment upload returns Cloudinary URL
- Google auth callback domain matches deployed backend
- Stripe webhook points to `https://api.yourdomain.com/webhook`

## Troubleshooting

- Socket disconnects immediately:
  - confirm Nginx `Upgrade` and `Connection` headers
  - confirm frontend uses `wss://` URL in production
- File uploads fail:
  - verify Cloudinary keys
  - check allowed MIME type in chat uploader
- OAuth fails after deploy:
  - update provider callback URLs and `BETTER_AUTH_URL`
