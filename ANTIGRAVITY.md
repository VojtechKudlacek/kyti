# kyti Project Instructions

## Project Overview
**kyti** is a home automation project consisting of:
- **Server**: A Fastify-based Node.js backend with WebSocket support and SQLite integration.
- **Website**: A React frontend built with Vite.

## Contribution Rules
> [!IMPORTANT]
> **All changes must be verified locally before pushing.**
>
> always run the following checks:
> - **Server**: `pnpm server:build && pnpm server:check`
> - **Website**: `pnpm website:build && pnpm website:check`

## Directory Structure
- **`/server`**: Backend source code.
  - `app.ts`: Main entry point.
  - `api/`: API route handlers.
  - `classes/`: Core logic classes (e.g., `Outlet`, `EnvManager`).
  - `db/`: Database configuration and setup (`better-sqlite3`).
  - `tasks/`: Scheduled tasks.
- **`/website`**: Frontend source code.
  - `App.tsx`: Main React component.
  - `store/`: State management (Jotai).
  - `ui/`: UI components (Ant Design).
- **`dist/`**: Compiled frontend assets served by the backend.
- **`kyti.db`**: SQLite database file.

## Setup & Installation

### Prerequisites
- Node.js (v24.10.11 or compatible)
- pnpm (v10.12.4 or compatible)

### Installation
```bash
pnpm install
```

### Environment Configuration
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Configure the following variables in `.env`:
   - `SHELLY_OUTLET_URL`: URL for the Shelly device.
   - `CLIMATE_CONTROL_SECRET`: Secret key for climate control operations.
   - `ADMIN_PASSWORD`: Password for administrative access.
   - `DB_NAME`: Database file name (default: `kyti.db`).

## Useful Commands

### Server
- **Start Server**: Builds and runs the server.
  ```bash
  pnpm server:start
  ```
- **Build Server**: Compiles TypeScript to JavaScript.
  ```bash
  pnpm server:build
  ```
- **Deploy Server**: Reinstalls dependencies, builds, and restarts via PM2.
  ```bash
  pnpm server:deploy
  ```
- **Lint/Format**:
  ```bash
  pnpm server:lint
  pnpm server:format
  pnpm server:check
  ```

### Website
- **Start Dev Server**: Runs the frontend in development mode.
  ```bash
  pnpm website:dev
  ```
- **Build Website**: Compiles the frontend for production.
  ```bash
  pnpm website:build
  ```
- **Preview Build**: Preview the production build locally.
  ```bash
  pnpm website:preview
  ```

### Database
- **Purge Database**: Deletes the `kyti.db` file.
  ```bash
  pnpm db:purge
  ```

## Deploying Everything
To deploy both the server and the website:
```bash
pnpm all:deploy
```
