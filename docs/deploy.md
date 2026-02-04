# Deployment Guide

AuthKit is designed to be self-hosted. You can use our recommended Docker setup for a single VPS or deploy components individually to PaaS providers like Vercel and Render.

## 1. Single Server (Docker Compose) - Recommended

Verified for: DigitalOcean Droplets, AWS EC2, Hetzner Cloud.

### Prerequisites
- A domain name (e.g., `auth.yourdomain.com`).
- A VPS with Docker & Docker Compose installed.

### Steps
1. **Clone the repository**:
   ```bash
   git clone https://github.com/dubeyraghav303-cloud/AuthIn.git authkit
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
   - `JWT_SECRET`: `openssl rand -hex 32`

3. **Start**:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

## 2. Platform Deployment (Vercel & Render)

For scaling, you may want to host the frontend on a CDN and the backend on a managed service.

### Step A: Push to GitHub
1. Create a new repository on GitHub.
2. Push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

### Step B: Deploy Frontend (Vercel)
You will create **two separate projects** on Vercel: one for the Landing page and one for the Web Dashboard.

1. **Import via Vercel Dashboard**.
2. Select your `AuthIn` repository.
3. **Project 1 (Landing)**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/landing`
   - **Env Vars**: `NEXT_PUBLIC_API_URL` = `https://api.yourdomain.com`
4. **Project 2 (Dashboard)**:
   - **Framework Preset**: Next.js
   - **Root Directory**: `apps/web`
   - **Env Vars**: `NEXT_PUBLIC_API_URL` = `https://api.yourdomain.com`

### Step C: Deploy Backend (Render)
Deploy the API service.

1. Create a **New Web Service** on Render.
2. Connect your `AuthIn` repository.
3. **Settings**:
   - **Root Directory**: `.` (Leave empty to use repo root)
   - **Build Command**: `pnpm install && pnpm --filter api build`
   - **Start Command**: `node apps/api/dist/main`
   - **Watch Paths**: `apps/api/**` (Optional)

4. **Environment Variables**:
   - Copy everything from `.env.example`.
   - Update `DATABASE_URL` (Use Render's Managed PostgreSQL).
   - Update `REDIS_URL` (Use Render's Managed Redis).

## 3. Environment Variables Reference

| Variable | Description |
|---|---|
| `JWT_SECRET` | 32+ char random string for signing tokens. |
| `COOKIE_SECRET` | Secret for signing cookies. |
| `RP_ID` | Passkey Relying Party ID (your domain, e.g., `yourdomain.com`). |
| `RP_NAME` | Passkey Relying Party Name (e.g., `AuthKit`). |
| `ORIGIN` | The full URL of your API (e.g., `https://api.yourdomain.com`). |

