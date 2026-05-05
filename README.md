# Xplora Project

## Local Setup

This project has two parts:
- `client` for the React frontend
- `server` for the Node.js and MySQL backend

Each teammate should run their own local MySQL instance and import the project schema into MySQL Workbench.

## 1. Install Prerequisites

Make sure you have these installed:
- Node.js
- npm
- MySQL Server
- MySQL Workbench

## 2. Create the Database in MySQL Workbench

1. Open MySQL Workbench.
2. Connect to your local MySQL server.
3. Open [server/sql/xplora_schema.sql](server/sql/xplora_schema.sql).
4. Run the script.

This creates:
- the `xplora_db` database
- all required tables
- starter categories used by the app

## 3. Configure Backend Environment Variables

1. In the `server` folder, copy `.env.example` to `.env`.
2. Update the values for your machine.

Example:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=xplora_db
DB_PORT=3306
JWT_SECRET=replace_with_a_random_32_plus_character_secret
JWT_EXPIRES_IN=24h
FRONTEND_URL=http://localhost:5173
PORT=5000
NODE_ENV=development
```

If Vite starts on a different port, update `FRONTEND_URL` to match it.

## 4. Install Dependencies

Run these commands:

```bash
cd server
npm install
cd ../client
npm install
```

## 5. Start the App

Open two terminals.

Terminal 1:

```bash
cd server
node index.js
```

Terminal 2:

```bash
cd client
npm run dev
```

Then open the frontend URL shown by Vite in the browser.

## Notes

- Backend defaults to port `5000`.
- Frontend usually starts on `5173`, but Vite may choose another port if that one is busy.
- The backend schema file is the source of truth for local database setup.
- Do not commit your local `.env` file.

## Important Files

- [server/sql/xplora_schema.sql](server/sql/xplora_schema.sql)
- [server/.env.example](server/.env.example)
- [client/.env.example](client/.env.example)
- [server/index.js](server/index.js)
- [server/SECURITY.md](server/SECURITY.md)
- [DEPLOYMENT.md](DEPLOYMENT.md) - Production deployment guide

## Deployment

For production deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md) which includes:
- Environment configuration
- Backend deployment options (PM2, Docker)
- Frontend build and deployment
- Database setup for production
- SSL/HTTPS setup
- Security best practices
