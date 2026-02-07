# Useful Commands

## Server
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

## Website
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

## Database
- **Purge Database**: Deletes the `kyti.db` file.
  ```bash
  pnpm db:purge
  ```

## Deploying Everything
To deploy both the server and the website:
```bash
pnpm all:deploy
```
