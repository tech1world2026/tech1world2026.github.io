const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const DEFAULT_MODEL = 'llama-3.1-8b-instant';
const ALLOWED_MODELS = new Set([
  'llama-3.1-8b-instant',
  'llama-3.3-70b-versatile'
]);

function setCors(req, res) {
  const origin = process.env.ALLOWED_ORIGIN || req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

function normalizeMessages(messages) {
  if (!Array.isArray(messages)) return null;
  return messages
    .slice(-16)
    .map(message => ({
      role: ['system', 'user', 'assistant'].includes(message?.role) ? message.role : 'user',
      content: String(message?.content || '').slice(0, 4000)
    }))
    .filter(message => message.content.trim());
}

export default async function handler(req, res) {
  setCors(req, res);

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  if (req.method !== 'POST') {
    return sendJson(res, 405, { error: { message: 'Method not allowed.' } });
  }

  if (!process.env.GROQ_API_KEY) {
    return sendJson(res, 500, { error: { message: 'GROQ_API_KEY is not configured on the server.' } });
  }

  const body = req.body || {};
  const messages = normalizeMessages(body.messages);
  if (!messages?.length) {
    return sendJson(res, 400, { error: { message: 'A non-empty messages array is required.' } });
  }

  const requestedModel = String(body.model || DEFAULT_MODEL);
  const model = ALLOWED_MODELS.has(requestedModel) ? requestedModel : DEFAULT_MODEL;
  const maxTokens = Math.min(Math.max(Number(body.max_tokens) || 420, 80), 1200);
  const payload = {
    model,
    messages,
    max_tokens: maxTokens,
    temperature: typeof body.temperature === 'number' ? body.temperature : 0.7
  };
  if (typeof body.top_p === 'number') payload.top_p = body.top_p;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  try {
    const groqResponse = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    const data = await groqResponse.json().catch(() => ({}));
    if (!groqResponse.ok) {
      return sendJson(res, groqResponse.status, {
        error: {
          message: data.error?.message || `Groq request failed with status ${groqResponse.status}.`
        }
      });
    }

    return sendJson(res, 200, data);
  } catch (error) {
    const message = error.name === 'AbortError'
      ? 'Groq request timed out.'
      : 'Groq request failed.';
    return sendJson(res, 502, { error: { message } });
  } finally {
    clearTimeout(timeout);
  }
}
