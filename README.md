# tech1world2026.github.io

## Live AI backend

Arya uses the serverless endpoint at `/api/chat`, which proxies requests to Groq or OpenAI/GPT without exposing API keys in `index.html`.

Deploy on Vercel (or another host that supports `/api` serverless functions) and set one of these environment variables:

```bash
# Option 1: Groq
GROQ_API_KEY=your_groq_key_here

# Option 2: OpenAI / GPT
OPENAI_API_KEY=your_openai_key_here
```

Do not put Groq or OpenAI keys in frontend JavaScript.