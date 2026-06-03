const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const DEFAULT_GROQ_MODEL = 'llama-3.1-8b-instant';
const DEFAULT_OPENAI_MODEL = 'gpt-4o-mini';
const GROQ_MODELS = new Set([
  'llama-3.1-8b-instant',
  'llama-3.3-70b-versatile'
]);
const OPENAI_MODELS = new Set([
  'gpt-4o-mini',
  'gpt-4.1-mini',
  'gpt-4.1-nano'
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

function selectProviderAndModel(body) {
  const requestedProvider = String(body.provider || process.env.AI_PROVIDER || '').toLowerCase();
  const requestedModel = String(body.model || '');
  const hasGroq = Boolean(process.env.GROQ_API_KEY);
  const hasOpenAI = Boolean(process.env.OPENAI_API_KEY);

  if (requestedProvider === 'openai' || (!hasGroq && hasOpenAI)) {
    return {
      apiUrl: OPENAI_API_URL,
      apiKey: process.env.OPENAI_API_KEY,
      providerName: 'OpenAI',
      model: OPENAI_MODELS.has(requestedModel) ? requestedModel : DEFAULT_OPENAI_MODEL
    };
  }

  if (requestedProvider === 'groq' || hasGroq) {
    return {
      apiUrl: GROQ_API_URL,
      apiKey: process.env.GROQ_API_KEY,
      providerName: 'Groq',
      model: GROQ_MODELS.has(requestedModel) ? requestedModel : DEFAULT_GROQ_MODEL
    };
  }

  return null;
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

  const body = req.body || {};
  const messages = normalizeMessages(body.messages);
  if (!messages?.length) {
    return sendJson(res, 400, { error: { message: 'A non-empty messages array is required.' } });
  }

  const provider = selectProviderAndModel(body);
  if (!provider?.apiKey) {
    return sendJson(res, 500, {
      error: {
        message: 'AI backend key is not configured. Set GROQ_API_KEY or OPENAI_API_KEY on the server.'
      }
    });
  }

  const maxTokens = Math.min(Math.max(Number(body.max_tokens) || 420, 80), 1200);
  const payload = {
    model: provider.model,
    messages,
    max_tokens: maxTokens,
    temperature: typeof body.temperature === 'number' ? body.temperature : 0.7
  };
  if (typeof body.top_p === 'number') payload.top_p = body.top_p;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);

  try {
    const aiResponse = await fetch(provider.apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${provider.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    const data = await aiResponse.json().catch(() => ({}));
    if (!aiResponse.ok) {
      return sendJson(res, aiResponse.status, {
        error: {
          message: data.error?.message || `${provider.providerName} request failed with status ${aiResponse.status}.`
        }
      });
    }

    return sendJson(res, 200, data);
  } catch (error) {
    const message = error.name === 'AbortError'
      ? 'AI request timed out.'
      : `${provider.providerName} request failed.`;
    return sendJson(res, 502, { error: { message } });
  } finally {
    clearTimeout(timeout);
  }
}
