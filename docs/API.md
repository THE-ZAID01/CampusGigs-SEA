# CampusGigs API

The API is served under `/api`. The development server listens on port 5000.
The production server also serves the built client when `client/dist` exists.

## Authentication

Public endpoints are `GET /health`, `GET /meta`, and the four password/account
endpoints under `/auth`. All other endpoints require:

```http
Authorization: Bearer <jwt>
```

Login and registration responses include a JWT. The client stores it in local
storage when **Remember me** is selected and in session storage otherwise.

## Health and metadata

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/health` | No | Returns `{ "ok": true }` |
| GET | `/meta` | No | Categories, domain settings, fees, withdrawal minimum, and XP rules |

## Account and users

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/auth/register` | No | Create an account |
| POST | `/auth/login` | No | Authenticate an account |
| GET | `/auth/me` | Yes | Return the authenticated user |
| POST | `/auth/forgot` | No | Create a development reset link |
| POST | `/auth/reset` | No | Reset a password using a reset token |
| GET | `/users/me` | Yes | Return the current profile and statistics |
| PUT | `/users/me` | Yes | Update the current profile |
| GET | `/users/:id` | Yes | Return a public profile |

## Gigs and bids

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/gigs` | Yes | List gigs using `scope`, `q`, `category`, and `sort` |
| POST | `/gigs` | Yes | Create a gig |
| GET | `/gigs/:id` | Yes | Return gig details and bids available to the user |
| PUT | `/gigs/:id` | Yes | Edit an open gig owned by the user |
| DELETE | `/gigs/:id` | Yes | Cancel an open gig owned by the user |
| POST | `/gigs/:id/bids` | Yes | Place or update a bid |
| GET | `/bids/mine` | Yes | List the current user's bids |
| DELETE | `/bids/:id` | Yes | Withdraw a pending bid |
| POST | `/bids/:id/accept` | Yes | Accept a bid and hold its amount |

Supported gig scopes are `explore`, `posted`, and `working`. Supported sort
values are `newest`, `budget_high`, `budget_low`, and `deadline`.

## Escrow actions

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/gigs/:id/deliver` | Yes | Freelancer submits delivery |
| POST | `/gigs/:id/revision` | Yes | Owner requests changes |
| POST | `/gigs/:id/confirm` | Yes | Owner approves and releases escrow |
| POST | `/gigs/:id/leave` | Yes | Freelancer leaves and receives an owner refund |

These operations validate the current gig status and actor permissions. The
database transaction is rolled back when a validation or balance check fails.

## Wallet and history

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| GET | `/wallet` | Yes | Balance and escrow summary |
| GET | `/wallet/analytics` | Yes | Daily, weekly, and monthly wallet buckets |
| GET | `/wallet/transactions` | Yes | Wallet activity |
| POST | `/wallet/topup` | Yes | Add mocked GigCoins |
| POST | `/wallet/withdraw` | Yes | Create a mocked UPI withdrawal |
| GET | `/history` | Yes | Completed and active work with role/status filters |

## Error handling

Errors use JSON responses with a message, for example:

```json
{
  "error": "Insufficient GigCoins"
}
```

Clients should treat non-2xx responses as failed operations and display the
server-provided message when it is safe to show to the user.
