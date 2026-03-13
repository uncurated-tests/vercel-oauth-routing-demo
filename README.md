# Vercel OAuth Routing Demo

A demo app showing how to use [Sign in with Vercel](https://vercel.com/docs/sign-in-with-vercel) to create [project-level routing rules](https://vercel.com/docs/routing/project-routing-rules) on behalf of a user.

## How it works

1. User clicks "Sign in with Vercel" and authenticates via OAuth (PKCE flow)
2. The app receives an access token scoped to the user's account
3. User selects a project and configures a rewrite rule (source path + destination URL)
4. The app creates the routing rule via the [Vercel REST API](https://vercel.com/docs/rest-api/project-routes/add-a-routing-rule) and auto-publishes it

## Setup

### 1. Create an OAuth app

Go to [vercel.com/account/apps](https://vercel.com/account/apps) and create a new app:

- Set the **Authorization Callback URL** to `http://localhost:3000/api/auth/callback`
- Note the **Client ID** and generate a **Client Secret**

### 2. Configure environment variables

```bash
cp .env.local.example .env.local
```

Fill in `NEXT_PUBLIC_VERCEL_APP_CLIENT_ID` and `VERCEL_APP_CLIENT_SECRET` from the previous step.

### 3. Run

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploying

When deploying to Vercel, update the Authorization Callback URL in your app settings to `https://your-domain.vercel.app/api/auth/callback` and add the environment variables to your project.
