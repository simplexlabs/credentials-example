# Simplex Credentials Manager

A simple Next.js app for storing encrypted credentials using the [Simplex TypeScript SDK](https://www.npmjs.com/package/simplex-ts).

Credentials stored here are encrypted server-side and can be used by the Simplex browser agent via `type_secret(credential_name="...")` to securely type passwords and API keys into web forms.

## Setup

```bash
npm install
cp .env.example .env
```

Add your API key to `.env`:

```
SIMPLEX_API_KEY=your_api_key_here
```

You can find your API key at [simplex.sh/api-keys](https://simplex.sh/api-keys).

## Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
