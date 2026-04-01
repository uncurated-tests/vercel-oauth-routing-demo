# Vercel OAuth Routing Demo

A demo app showing how to use [Sign in with Vercel](https://vercel.com/docs/sign-in-with-vercel) OAuth and the [Vercel SDK](https://vercel.com/docs/rest-api/sdk/project-routes/add-a-routing-rule) to create [project-level routing rules](https://vercel.com/docs/routing/project-routing-rules) on behalf of a user.

## How it works

1. User clicks "Sign in with Vercel" and authenticates via OAuth
2. The app receives an access token scoped to the user's account
3. User selects a team and project, then configures a rewrite rule (source path + destination URL)
4. The app creates the routing rule via the [Vercel SDK](https://vercel.com/docs/rest-api/sdk/project-routes/add-a-routing-rule) and auto-publishes it to production

## Setup

### 1. Create an OAuth app

Go to [vercel.com/account/apps](https://vercel.com/account/apps) and create a new app.

#### App settings

- **Name**: Choose a name for your app
- **Authorization Callback URL**: Set to your deployed URL + `/api/auth/callback` (e.g., `https://your-app.vercel.app/api/auth/callback`). For local development, also add `http://localhost:3000/api/auth/callback`.

#### Grant types

- **Authorization Code**: Enabled

#### Client authentication methods

- **client_secret_post**: Enabled

#### Scopes

- **openid**: Enabled

#### Permissions

The following permissions are required for the app to list teams/projects and create routing rules:

| Permission | Why |
|---|---|
| **read:team** | List the user's teams |
| **read:project** | List projects within a team |
| **read-write:project** | Create and publish routing rules |

After creating the app, generate a **Client Secret** from the Client Secrets section.

### 2. Configure environment variables

For local development, copy the example env file and fill in the values:

```bash
cp .env.local.example .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_VERCEL_APP_CLIENT_ID` | The Client ID from your OAuth app settings |
| `VERCEL_APP_CLIENT_SECRET` | The Client Secret you generated |

When deploying to Vercel, add these same variables in your project's **Settings > Environment Variables** page. See [Environment Variables](https://vercel.com/docs/environment-variables) for more details.

### 3. Run locally

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploying to Vercel

1. Import the repository on [vercel.com/new](https://vercel.com/new)
2. Add `NEXT_PUBLIC_VERCEL_APP_CLIENT_ID` and `VERCEL_APP_CLIENT_SECRET` as environment variables
3. Deploy
4. Update your OAuth app's **Authorization Callback URL** to `https://your-domain.vercel.app/api/auth/callback`

## Learn more

- [Sign in with Vercel](https://vercel.com/docs/sign-in-with-vercel) — OAuth documentation
- [Vercel SDK](https://vercel.com/docs/rest-api/sdk/project-routes/add-a-routing-rule) — SDK reference for project routes
- [Project-level routing rules](https://vercel.com/docs/routing/project-routing-rules) — Routing rules documentation
