# Deployment Guide

AuthKit is designed to be self-hosted. You can deploy it using Docker on any VPS (AWS, DigitalOcean, Hetzner) or easy-deploy platforms like Railway/Render.

## 1. Single Server (Docker Compose) - Recommended

The easiest way to deploy AuthKit is using Docker Compose on a Linux server.

### Prerequisites
- A domain name (e.g., `auth.yourdomain.com`).
- A VPS with Docker & Docker Compose installed.

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-org/start.git authkit
   cd authkit
   ```

2. **Configure Environment**:
   ```bash
   cp .env.example .env
   nano .env
   ```
   
   **Critical Settings**:
   - `NODE_ENV=production`
   - `ORIGIN=https://auth.yourdomain.com`
   - `COOKIE_DOMAIN=.yourdomain.com`
   - `JWT_SECRET`: Generate a strong random string (`openssl rand -hex 32`)
   - `DATABASE_URL`: Point to your production DB (or use the docker container)

3. **Start the Stack**:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

4. **Reverse Proxy (Nginx/Caddy)**:
   You need a reverse proxy to handle SSL.
   
   **Caddy Example (easiest)**:
   ```caddyfile
   auth.yourdomain.com {
     reverse_proxy localhost:3000
   }
   console.yourdomain.com {
     reverse_proxy localhost:3001
   }
   ```

## 2. Environment Variables Reference

| Variable | Description |
|Data | Definition|
|---|---|
| `JWT_SECRET` | 32+ char random string for signing tokens. |
| `COOKIE_SECRET` | Secret for signing cookies. |
| `RP_ID` | Passkey Relying Party ID (your domain, e.g., `yourdomain.com`). |
| `RP_NAME` | Passkey Relying Party Name (e.g., `AuthKit`). |
| `ORIGIN` | The full URL of your API (e.g., `https://api.yourdomain.com`). |

## 3. Production Checklist

- [ ] `NODE_ENV` set to `production`.
- [ ] `secure: true` for cookies (automatic in prod).
- [ ] Database backups configured.
- [ ] Redis persistence enabled (AOF/RDB).
- [ ] Rate limits tuned in `APP_THROTTLER_*` vars.
