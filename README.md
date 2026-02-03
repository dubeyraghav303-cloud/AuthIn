# AuthKit

<div align="center">
  <img src="https://via.placeholder.com/150" alt="AuthKit Logo" width="120" />
  <h1>AuthKit</h1>
  <p><strong>The Open Source Authentication Platform for SaaS</strong></p>
  
  [![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
  [![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
  [![E2E Tests](https://img.shields.io/badge/tests-passing-brightgreen.svg)]()
</div>

---

**AuthKit** is a production-ready, open-source authentication platform designed to compete with Clerk. It provides a drop-in authentication solution with SaaS-native features like multi-tenancy, passkeys, and audit logs, but with full data ownership.

## 🚀 Why AuthKit?

| Feature | AuthKit | Traditional Auth | Clerk |
| :--- | :---: | :---: | :---: |
| **Passkeys-First** | ✅ | ❌ | ✅ |
| **Multi-Tenancy (RBAC)** | ✅ | ❌ | ✅ |
| **Self-Hosted / Data Residency** | ✅ | ✅ | ❌ |
| **Audit Logs** | ✅ | ❌ | 💰 Enterprise |
| **Refresh Token Rotation** | ✅ | ❌ | ✅ |
| **Pricing** | **Free (MIT)** | Free | $35+/mo |

## ✨ Key Features

- **🔐 Enterprise Security**: HTTP-Only cookies, refresh token rotation & hashing, reuse detection, and session management.
- **🏢 SaaS-Native Multi-Tenancy**: Built-in Organization/Tenant support with Role-Based Access Control (Owner, Admin, Member).
- **🔑 Passkeys & Biometrics**: Modern passwordless authentication using WebAuthn.
- **🛡️ Audit Trails**: Comprehensive security logging for compliance (SOC2 readiness).
- **⚡ Performance**: Built on NestJS, Prisma, and Redis for high-scale environments.

## 🛠️ Architecture

```mermaid
graph TD
    Client[Client (Next.js/React)] -->|HTTPS + HttpOnly Cookies| API[AuthKit API (NestJS)]
    API -->|Read/Write| DB[(Postgres)]
    API -->|Cache/Rate Limit| Redis[(Redis)]
    API -->|Audit Logs| DB
```

## ⚡ Quick Start

Get up and running in 5 minutes with Docker.

### Prerequisites
- Docker & Docker Compose
- Node.js v18+ & pnpm

### 1. Clone & Setup
```bash
git clone https://github.com/your-org/authkit.git
cd authkit
cp .env.example .env
```

### 2. Start Infrastructure
```bash
docker-compose up -d
```

### 3. Initialize & Run
```bash
pnpm install
pnpm db:push
pnpm dev
# API running at http://localhost:3000
```

## 📖 Documentation

- [**Security Model**](docs/security.md): Deep dive into our cookie-based session architecture.
- [**Deployment**](docs/deploy.md): How to deploy to production via VPS or Cloud.
- [**Local Development**](docs/local-dev.md): Contributing guide.

## 🗺️ Roadmap

- [x] Email/Password & Google OAuth
- [x] Multi-tenancy & RBAC
- [x] Security Hardening (Cookies, Hashing)
- [ ] **Phase 2**: Marketing Landing Page
- [ ] **Phase 3**: "Auth-as-Code" CLI
- [ ] **Phase 4**: React & Node.js SDKs

## 🤝 Community

- [GitHub Issues](https://github.com/your-org/authkit/issues) - Report bugs & feature requests.
- [Discussions](https://github.com/your-org/authkit/discussions) - Ask questions & share ideas.
- [Contributing](CONTRIBUTING.md) - Become a contributor.

---
<div align="center">
  <sub>Built with ❤️ by the AuthKit Team. Licensed MIT.</sub>
</div>
