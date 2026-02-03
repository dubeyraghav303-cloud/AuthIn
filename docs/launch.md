# Launch Kit

Everything you need to verify and show off AuthKit.

## 🎥 30-Second Demo Script

**Scene 1: The Problem (5s)**
*Show a generic login form.*
"Building authentication is a trap. You start with email/password, then you need OAuth, then Passkeys, then Multi-tenancy..."

**Scene 2: AuthKit Init (10s)**
*Terminal view.*
"Enter AuthKit. One command gives you a fully self-hosted, SaaS-native auth platform."
`npx authkit init` (or `docker-compose up`)
"It spins up everything: API, Admin Dashboard, and Database."

**Scene 3: The Dashboard (10s)**
*Show AuthKit Dashboard.*
"Create organizations, invite members with roles, and view SOC2-ready audit logs right out of the box."

**Scene 4: The Code (5s)**
*Show VS Code.*
"And with our SDK, protecting a route is just one line of code."
`const { user } = useUser();`

## 📣 Social Post Templates

### Twitter / X
🚀 Just launched AuthKit: The open-source alternative to Clerk.

We got tired of expensive per-user pricing, so we built a self-hosted auth platform that includes:
✅ Passkeys-first
✅ SaaS Multi-tenancy (RBAC)
✅ Audit Logs
✅ 100% Data Ownership

Star us on GitHub: [link]
#opensource #webdev #auth

### HackerNews
**Title**: Show HN: AuthKit – Open Source Clerk Alternative for SaaS

**Body**:
Hi HN, we built AuthKit because we wanted the DX of Clerk but with full data ownership and no per-user fees.

Features:
- Node.js/NestJS backend + Next.js frontend
- HttpOnly cookies (no localStorage tokens)
- Built-in Tenant/Organization support with RBAC
- Passkeys logic pre-configured

Repo: [link]
Docs: [link]

Would love your feedback on our security architecture!
