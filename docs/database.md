# Database Setup Guide (PostgreSQL & Redis)

AuthKit requires two data stores:
1.  **PostgreSQL**: For storing user accounts, tenants, and invitations.
2.  **Redis**: For rate limiting and session management (optional but recommended).

## 1. Managed Databases on Render (Recommended)

Render is the easiest way to provision both databases alongside your API.

### PostgreSQL (The Main Database)
1.  Go to your [Render Dashboard](https://dashboard.render.com).
2.  Click **New +** -> **PostgreSQL**.
3.  **Basic Settings**:
    *   **Name**: `authkit-db`
    *   **Database**: `authkit`
    *   **User**: `authkit_user`
    *   **Region**: Same as your **Web Service** (e.g., Ohio / Frankfurt).
    *   **Instance Type**: Free (for dev) or Starter ($7/mo).
4.  Click **Create Database**.
5.  Wait for it to be "Available".
6.  **Get Configuration**:
    *   Find the **Internal Database URL** (e.g., `postgres://user:password@hostname:5432/authkit`).
    *   Copy this value.
    *   Go to your **API Web Service** -> **Environment**.
    *   Add/Update `DATABASE_URL` with this value.

### Redis (The Cache)
1.  Go to [Render Dashboard](https://dashboard.render.com).
2.  Click **New +** -> **Redis**.
3.  **Basic Settings**:
    *   **Name**: `authkit-redis`
    *   **Region**: Same as your **API**.
    *   **Instance Type**: Free (for dev) or Starter.
4.  Click **Create Redis**.
5.  **Get Configuration**:
    *   Find the **Internal Connection URL** (e.g., `redis://hostname:6379`).
    *   Copy this value.
    *   Go to your **API Web Service** -> **Environment**.
    *   Add/Update `REDIS_URL` with this value.

## 2. Using Other Providers (Neon, Upstash, Supabase)

You can use any cloud provider. Here are popular alternatives:

### PostgreSQL (Neon / Supabase)
1.  Create a project on [Neon.tech](https://neon.tech) or [Supabase.com](https://supabase.com).
2.  Get the **Combined Connection String** (it looks like `postgres://...`).
3.  **Important**: If you use transaction pooling (like Supabase Port 6543), append `?pgbouncer=true`.
    *   *Direct Connection*: port 5432.
    *   *Pooled Connection*: port 6543 (Recommended for serverless).

### Redis (Upstash)
1.  Create a Redis database on [Upstash](https://upstash.com).
2.  Copy the `REDIS_URL` (starts with `redis://...`).

## 3. Important Notes for Production

*   **Internal URLs**: On Render, always use the **Internal** URL for communication between your API and DB. It is faster and secure (traffic stays within the private network).
*   **Backups**: Enable daily backups for PostgreSQL.
*   **Migrations**: When you first deploy, you might need to run database migrations. Since `pnpm db:push` is not recommended for production, you should run migrations as part of your build or manually.
    *   *Render Build Command*: `pnpm install && pnpm db:push && pnpm build` (Easiest for MVP).
