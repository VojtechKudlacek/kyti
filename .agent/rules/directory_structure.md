# Directory Structure

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
