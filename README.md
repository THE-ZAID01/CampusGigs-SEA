# CampusGigs

CampusGigs is a campus gig marketplace where students post tasks, bid on work,
and get paid safely through escrow using GigCoins.

This project was built for the SEA Lab micro project. Its differentiating
feature is an escrow-backed gig lifecycle: accepting a bid locks the exact bid
amount, and the freelancer is paid only after the owner approves delivery.

## Features

- Student registration and login with JWT authentication and bcrypt password hashing
- Configurable email-domain allowlist (defaults to `ves.ac.in`)
- Gig discovery with search, category filters, and sorting
- Gig creation, editing, cancellation, bidding, bid updates, and withdrawals
- Escrow state machine with delivery, revision requests, approval, refunds, and
  double-release protection
- Profiles with public trust IDs, skills, XP, levels, and gig statistics
- GigCoins wallet with mocked top-ups, UPI withdrawals, escrow balances,
  transaction history, and analytics
- History views for posted and completed work
- Responsive React interface with a dashboard, side menu, charts, and status
  stepper

## Technology

| Layer | Technology |
| --- | --- |
| Client | React 18, React Router, Vite, Axios |
| API | Node.js, Express, Helmet, CORS |
| Database | PostgreSQL 14+ |
| Authentication | JWT and bcryptjs |
| Local database | Docker Compose with PostgreSQL 16 |

## Requirements

- Node.js 18 or newer
- npm
- PostgreSQL 14 or newer, or Docker Desktop

## Quick start

### 1. Install dependencies

From the project root:

```bash
npm run install:all
```

### 2. Start PostgreSQL

The easiest local option is Docker:

```bash
docker compose up -d
```

This creates a local database named `campusgigs` with the user `postgres` and
password `postgres`.

### 3. Configure the API

Copy the example environment file:

```bash
# macOS/Linux
cp server/.env.example server/.env

# Windows PowerShell
Copy-Item server/.env.example server/.env
```

The example values work with the included Docker Compose database. Change
`DATABASE_URL`, `JWT_SECRET`, and `CLIENT_ORIGIN` when using another database or
host.

The client environment file is optional for local development. Copy it if the
API is hosted separately:

```bash
Copy-Item client/.env.example client/.env
```

### 4. Create the schema and demo data

```bash
npm run db:setup
```

The setup command creates the schema and seeds demo users and gigs when the
database is empty. To reset the local database and seed it again:

```bash
npm run db:reset
```

### 5. Run the application

```bash
npm run dev
```

Open:

- Client: <http://localhost:5173>
- API health: <http://localhost:5000/api/health>

If port 5173 is already in use, Vite selects the next available port and prints
the actual URL in the terminal.

## Demo accounts

All seeded demo accounts use the password `demo1234`.

| Email | Use |
| --- | --- |
| `aarav@ves.ac.in` | Completed gigs, active work, delivered work, and a posted gig |
| `meera@ves.ac.in` | Open gig with competing bids |
| `rohan@ves.ac.in` | Freelancer side of demo gigs |
| `sana@ves.ac.in` | Additional demo participant |

These are local demonstration accounts only. Do not use the seeded password in
production.

## Escrow demo flow

1. Sign in as Meera and open **Posted by me**.
2. Open **Landing page in React for a club** and accept the lowest bid.
3. Sign in as Rohan and open **My work & bids**.
4. Mark the gig as delivered and provide a delivery link.
5. Sign in as Meera and release the payment.
6. Sign in as Rohan and review the released GigCoins in the wallet.

The accepted bid amount is locked from the owner's wallet. The budget is only a
maximum; the owner is charged the accepted bid amount.

## Configuration

Server settings are read from `server/.env`:

| Variable | Default | Description |
| --- | --- | --- |
| `PORT` | `5000` | API and production server port |
| `DATABASE_URL` | local Docker URL | PostgreSQL connection string |
| `JWT_SECRET` | development fallback | Secret used to sign access tokens |
| `ALLOWED_DOMAINS` | `ves.ac.in` | Comma-separated signup email domains |
| `SERVICE_FEE_PERCENT` | `0` | Platform fee on escrow release, capped at 50 |
| `SIGNUP_BONUS_COINS` | `500` | New-user wallet balance |
| `MIN_WITHDRAW_COINS` | `50` | Minimum mocked withdrawal |
| `APP_TIMEZONE` | `Asia/Kolkata` | Wallet analytics timezone |
| `CLIENT_ORIGIN` | `http://localhost:5173` | Allowed hosted client origin |
| `DB_SSL` | `false` | Enable SSL for hosted PostgreSQL |

For a separately hosted client, set `client/.env`:

```text
VITE_API_URL=https://your-api.example.com/api
```

Never commit `.env` files. They are excluded by `.gitignore`.

## Testing and production build

The API flow test creates throw-away users and validates the main business
rules, including bidding, escrow, revisions, release, refunds, withdrawals,
analytics, and history:

```bash
npm run test:flow
```

Build the client:

```bash
npm run build
```

Run the production-style server after building:

```bash
npm start
```

The Express server serves the built client and API from
<http://localhost:5000>.

## Project structure

```text
campusgigs/
├── client/
│   └── src/
│       ├── api/             Axios API client
│       ├── components/     Shared UI components
│       ├── context/        Authentication and toast state
│       ├── pages/          Login, dashboard, wallet, profile, and history
│       └── styles/         Application styles
├── server/
│   ├── db/                 Schema, setup, seed, and flow test
│   └── src/
│       ├── config/         Environment and PostgreSQL pool
│       ├── controllers/    Request handlers
│       ├── middleware/     Authentication and error handling
│       ├── routes/         API route definitions
│       └── services/       Escrow, wallet, and user domain logic
├── docs/
│   ├── API.md              Endpoint reference
│   ├── ARCHITECTURE.md     Request flow and domain design
│   ├── CONTRIBUTING.md     Local contribution workflow
│   └── DEPLOYMENT.md       Hosted deployment checklist
└── docker-compose.yml      Local PostgreSQL service
```

## Escrow state machine

```text
open --accept bid--> in_progress --deliver--> delivered --approve--> completed
                         ^                         |
                         |------ ask changes ------|

in_progress or delivered --freelancer leaves--> open (owner refunded)
open --owner cancels--> cancelled
```

Escrow operations run inside PostgreSQL transactions and use row locks so that
coins cannot be created, lost, or released twice.

## Documentation

- [API reference](docs/API.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Deployment guide](docs/DEPLOYMENT.md)
- [Contributing guide](docs/CONTRIBUTING.md)

## Scope and limitations

GigCoins top-ups and withdrawals are mocked. The project does not process real
payments or store card, bank, or UPI payment credentials. Chat, ratings,
notifications, email delivery, OTP verification, and an admin panel are outside
the current scope.

## Troubleshooting

### PostgreSQL connection errors

Confirm that PostgreSQL is running and that `DATABASE_URL` matches its host,
port, user, password, and database name. With Docker:

```bash
docker compose ps
docker compose up -d
```

Then run `npm run db:setup`.

### API calls fail from the client

Run the API on port 5000 and the client through Vite. In development, Vite
proxies `/api` requests to `http://localhost:5000`.

### Signup rejects an email

Add the domain to `ALLOWED_DOMAINS` in `server/.env`, then restart the API.

### Forgot-password links

No email provider is configured. In development, the reset link is displayed
by the application and logged by the server.

## License

This repository does not currently declare an open-source license. Contact the
repository owner before redistributing or reusing the code.
