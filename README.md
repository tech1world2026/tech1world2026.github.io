# tech1world2026.github.io

## Live AI backend

Arya uses the serverless endpoint at `/api/chat`, which proxies requests to Groq without exposing the Groq key in `index.html`.

Deploy on Vercel (or another host that supports `/api` serverless functions) and set this environment variable:

```bash
GROQ_API_KEY=your_groq_key_here
```

Do not put the Groq key in frontend JavaScript.