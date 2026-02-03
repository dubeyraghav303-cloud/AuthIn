# Local Development

The fastest way to contribute to AuthKit or build your SaaS is using our local dev CLI.

## `authkit` CLI

We provide a CLI to orchestrate the entire stack.

### Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Link functionality (if developing the CLI itself):
   ```bash
   pnpm --filter @authkit/cli build
   ```

### Commands

#### `authkit dev`

Starts the entire development environment:
- Checks if Docker is running
- Starts PostgreSQL & Redis containers
- Runs API, Web Dashboard, and Landing Page concurrently

```bash
pnpm --filter @authkit/cli dev
```

Output:
```
🚀 Starting AuthKit Local Dev Environment...

✔ Docker is running
✔ Infrastructure ready

Starting services...
  ➜ API:     http://localhost:3000
  ➜ Web:     http://localhost:3001
  ➜ Landing: http://localhost:3002
```

#### `authkit seed`

Seeds the database with demo data (Tenants, Users, Roles).

```bash
pnpm --filter @authkit/cli seed
```
