# ♥ Impacket Generator Deployment Guide ♥

Deploy Panko's Impacket Command Generator! 💜

---

## 🚀 Quick Local Testing

```bash
cd /home/kali/impacket-generator
python3 -m http.server 8000

# Open: http://localhost:8000
```

---

## 🐳 Docker Deployment

### Option 1: Simple Nginx Container

**Create Dockerfile:**
```dockerfile
FROM nginx:alpine

# Copy files
COPY . /usr/share/nginx/html

# Expose port
EXPOSE 80

# Nginx runs automatically
```

**Build and run:**
```bash
docker build -t impacket-generator .
docker run -d -p 80:80 --name impacket-gen impacket-generator
```

---

### Option 2: Docker Compose (No SSL)

**Create docker-compose.yml:**
```yaml
version: '3.8'

services:
  web:
    image: nginx:alpine
    container_name: impacket-generator
    restart: unless-stopped
    ports:
      - "80:80"
    volumes:
      - ./:/usr/share/nginx/html:ro
```

**Deploy:**
```bash
docker-compose up -d
```

---

## 🌐 Production with Caddy (Automatic HTTPS)

### Prerequisites
- Domain name pointing to your server
- Ports 80 and 443 open

### Files Needed

**1. Caddyfile:**
```caddy
impacket.panekopanko.se {
    # Automatic HTTPS
    tls panko@panekopanko.se

    # Gzip compression
    encode gzip zstd

    # Security headers
    header {
        X-Frame-Options "SAMEORIGIN"
        X-Content-Type-Options "nosniff"
        X-XSS-Protection "1; mode=block"
        Referrer-Policy "strict-origin-when-cross-origin"
        -Server
    }

    # Serve files
    root * /usr/share/caddy
    file_server

    # Logging
    log {
        output file /var/log/caddy/access.log {
            roll_size 100mb
            roll_keep 5
        }
        format json
    }
}

# Redirect www to non-www
www.impacket.panekopanko.se {
    redir https://impacket.panekopanko.se{uri} permanent
}
```

**2. docker-compose.yml:**
```yaml
version: '3.8'

services:
  caddy:
    image: caddy:latest
    container_name: impacket-caddy
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
      - "443:443/udp"  # HTTP/3
    volumes:
      # Website files
      - ./:/usr/share/caddy:ro
      # Caddy config
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      # Persistent data (certificates)
      - caddy-data:/data
      - caddy-config:/config
      # Logs
      - ./logs:/var/log/caddy:rw
    environment:
      - ACME_AGREE=true
    labels:
      - "com.panko.app=impacket-generator"

volumes:
  caddy-data:
    driver: local
  caddy-config:
    driver: local
```

**3. Create logs directory:**
```bash
mkdir -p logs
chmod 755 logs
```

**4. Deploy:**
```bash
docker-compose up -d
```

**That's it!** Caddy handles SSL automatically. 🎉

Visit: `https://impacket.panekopanko.se`

---

## 🔧 Nginx with Certbot (Alternative)

If you prefer nginx:

**nginx.conf:**
```nginx
server {
    listen 80;
    server_name impacket.panekopanko.se;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name impacket.panekopanko.se;

    # SSL certificates
    ssl_certificate /etc/letsencrypt/live/impacket.panekopanko.se/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/impacket.panekopanko.se/privkey.pem;

    # SSL settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Root directory
    root /usr/share/nginx/html;
    index index.html;

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**docker-compose.yml:**
```yaml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    container_name: impacket-nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./:/usr/share/nginx/html:ro
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
      - certbot-certs:/etc/letsencrypt:ro
      - certbot-www:/var/www/certbot:ro

  certbot:
    image: certbot/certbot
    container_name: impacket-certbot
    volumes:
      - certbot-certs:/etc/letsencrypt
      - certbot-www:/var/www/certbot
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"

volumes:
  certbot-certs:
  certbot-www:
```

**Get SSL certificate:**
```bash
docker-compose run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email panko@panekopanko.se \
    --agree-tos \
    -d impacket.panekopanko.se

docker-compose restart nginx
```

---

## 📊 Monitoring

### View Logs

```bash
# Caddy access logs
tail -f logs/access.log

# Docker logs
docker-compose logs -f
```

### Check Status

```bash
# Container status
docker-compose ps

# Resource usage
docker stats
```

---

## 🔄 Updates

```bash
# Pull latest images
docker-compose pull

# Restart with new images
docker-compose up -d
```

---

## 🛡️ Security

### Firewall

```bash
# UFW
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 443/udp  # HTTP/3
sudo ufw enable
```

### Fail2ban

```bash
sudo apt install fail2ban -y
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

---

## 💾 Backup

```bash
# Backup files
tar czf impacket-generator-backup-$(date +%Y%m%d).tar.gz \
    /path/to/impacket-generator/

# Backup Caddy certificates
docker run --rm -v impacket-generator_caddy-data:/data \
    -v $(pwd):/backup \
    alpine tar czf /backup/caddy-certs-$(date +%Y%m%d).tar.gz -C /data .
```

---

## 🎯 Production Checklist

Before going live:

- [ ] Domain DNS configured
- [ ] Ports 80, 443 open
- [ ] Docker and Docker Compose installed
- [ ] Caddyfile configured with correct domain
- [ ] Logs directory created
- [ ] Firewall configured
- [ ] Deployment tested
- [ ] SSL certificate obtained (automatic with Caddy)
- [ ] Monitoring set up

---

**made with love by panko** ♥

**happy deploying!** 💜✨
