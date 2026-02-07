# Setup & Installation

## Prerequisites
- Node.js (v24.10.11 or compatible)
- pnpm (v10.12.4 or compatible)

## Installation
> [!WARNING]
> This project uses **pnpm** exclusively. Do NOT use `npm` or `yarn`.

```bash
pnpm install
```

## Environment Configuration
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Configure the following variables in `.env`:
   - `SHELLY_OUTLET_URL`: URL for the Shelly device.
   - `CLIMATE_CONTROL_SECRET`: Secret key for climate control operations.
   - `ADMIN_PASSWORD`: Password for administrative access.
   - `DB_NAME`: Database file name (default: `kyti.db`).
