# GameListr

GameListr is a Next.js app for building video game tier lists. Users can search games through IGDB, drag titles into S-F tiers, check extra game info including HowLongToBeat data, and save lists to Firebase.

## Features

- Search for games by title through the `/api/search` route backed by IGDB
- Add games to a staging area, then drag them into tier rows
- View release date, rating, genres, platforms, and HowLongToBeat estimates
- Create private saved lists tied to a Firebase-authenticated user
- Browse saved lists and open a dedicated detail page for each one
- Delete saved lists from the dashboard

## Stack

- Next.js 13 (Pages Router)
- React 18
- styled-components
- Firebase Authentication
- Cloud Firestore
- IGDB API
- HowLongToBeat lookup via the local `/api/hltb` route

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local` with the required values:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=

IGDB_CLIENT_ID=
IGDB_CLIENT_SECRET=
```

3. Start the dev server:

```bash
npm run dev
```

4. Open `http://localhost:3000`

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Main Routes

- `/` landing page
- `/newlist` tier-list editor
- `/mylists` authenticated user dashboard for saved lists
- `/mylists/[listId]` saved list detail page
- `/auth/login` email/password login
- `/auth/signup` email/password signup

## API Routes

- `/api/search` gets a Twitch app token and queries IGDB for game metadata and cover art
- `/api/hltb` looks up playtime estimates from HowLongToBeat and caches results in memory

## Data Model

Saved lists are stored in Firestore under:

```text
users/{uid}/lists/{listId}
```

Each list document contains:

- `name`
- `tierGames`
- `stagedGames`
- `createdAt`
- `updatedAt`

## Notes

- Auth state is shared through `context/StateContext.js`
- Firebase setup lives in `backend/Firebase.js`
- Firestore list helpers live in `backend/Database.js`
- There is no automated test suite in the repo right now
- `npm run lint` currently opens Next.js ESLint setup because an ESLint config has not been committed yet
