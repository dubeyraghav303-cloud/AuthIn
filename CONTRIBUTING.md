# Contributing to AuthKit

First off, thanks for taking the time to contribute! ❤️

## Development Setup

AuthKit is a monorepo managed by `pnpm`.

1.  **Prerequisites**:
    *   Node.js v18+
    *   pnpm (`npm i -g pnpm`)
    *   Docker & Docker Compose

2.  **Install Dependencies**:
    ```bash
    pnpm install
    ```

3.  **Environment Setup**:
    ```bash
    cp .env.example .env
    ```

4.  **Start Infrastructure**:
    ```bash
    docker-compose up -d
    ```

5.  **Initialize Database**:
    ```bash
    pnpm db:push
    ```

6.  **Run Dev Server**:
    ```bash
    pnpm dev
    ```

## Submitting Pull Requests

1.  Fork the repo and create your branch from `main`.
2.  If you've added code that should be tested, add tests.
3.  Ensure the test suite passes (`pnpm test:e2e`).
4.  Make sure your code lints (`pnpm lint`).
5.  Issue that pull request!
