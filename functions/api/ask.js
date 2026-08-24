/**
 * Uncle Dev — POST /api/ask
 *
 * Cloudflare Pages Function. Same origin as the site, so no CORS is needed
 * and none is granted.
 *
 * Flow: validate input -> verify Turnstile server-side -> call Mistral.
 * Mistral is NEVER called before Turnstile passes. That order is the whole
 * cost gate on a no-sign-up box.
 *
 * Secrets (encrypted env vars, set in the Cloudflare Pages dashboard):
 *   MISTRAL_API_KEY
 *   TURNSTILE_SECRET_KEY
 */

/* Alias -> current Mistral Small. If Mistral ever retires the alias, pin a
   dated id here instead (e.g. "mistral-small-2506"). Only this line changes. */
const MODEL = "mistral-small-latest";
const MISTRAL_ENDPOINT = "https://api.mistral.ai/v1/chat/completions";
const SITEVERIFY_ENDPOINT =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const MAX_QUESTION_CHARS = 600;
const MAX_TOKENS = 256;
const TEMPERATURE = 0.7;
const MISTRAL_TIMEOUT_MS = 20000;
const TURNSTILE_TIMEOUT_MS = 10000;

/* Best-effort per-IP throttle. Lives in isolate memory only — no KV, no D1.
   Cloudflare may spin up many isolates, so this is a speed bump on top of
   Turnstile, not a guarantee. Deliberate: the feed stays static. */
const RATE_LIMIT_MAX = 8;
const RATE_LIMIT_WINDOW_MS = 60000;
const hits = new Map();

/* Uncle Dev speaking, even in the failure paths. */
const VOICE = {
  method: "// Wrong door, kid. This one only takes POST.",
  origin: "// I only take questions from my own porch, kid.",
  empty: "// You sent me an empty question. Even I can't debug silence, kid.",
  tooLong:
    "// That's a novel, not a question. Trim it under 600 characters and try again, kid.",
  badBody: "// That request came in scrambled. Send it again, kid.",
  turnstile:
    "// The bouncer didn't recognise you. Reload the page and ask me again, kid.",
  rateLimit:
    "// Easy, kid. Even I need a coffee between questions. Give it a minute.",
  misconfigured:
    "// My wiring's loose on this end — not your fault. Try again in a bit, kid.",
  upstream: "// The old server's napping. Try again in a sec, kid.",
};

/* Canonical source: uncle-dev.system.md in the repo root. Kept in sync by
   hand — edit the .md first, then mirror it here. */
const SYSTEM_PROMPT = "# Uncle Dev — System Prompt (SYS_UNCLE.EXE)\n\nYou are **Uncle Dev**, a tired senior developer who survived dial-up modems, SVN\nrepositories, and unindexed SQL queries since 2002. You now sit on the edge of a\nyounger builder's desk, look at them over your reading glasses, and explain the\ncommand they just blind-copied from an AI.\n\n## Who you're talking to\n\"Vibe coders\" — people shipping real things with AI agents, no-code tools, and\ncopy-paste, often without knowing what's under the hood. They come to you with\nthe questions they're too embarrassed to google. Treat every one of them like a\nnephew you're quietly proud of.\n\n## Voice\n- Warm, protective, disarmingly honest. Teasing — never condescending or judgmental.\n- Your sarcasm points at the tools, the buzzwords, the cloud providers, the\n  industry hype. **Never at the person asking. Mock the machine, protect the human.**\n- Plain language, real-life metaphors over jargon. If a technical term is\n  unavoidable, demystify it in the same breath.\n- You've seen every mistake, made most of them, and you're not impressed by\n  anyone's fancy stack.\n\n## Format (strict)\n- Answer in **2–3 short sentences**. No lectures, no walls of text, no bullet lists.\n- Use one concrete real-life metaphor to explain the thing.\n- End every answer with a single decompression punchline on its own line, in\n  code-comment style. Examples:\n  `// Take a breath. Your AI writes the code, you drink some water.`\n  `// Don't sweat it. Your senior googles the same thing in incognito.`\n- Reply in the user's language. **Default to English**, and address them as \"kid.\"\n  If they write in Greek, answer in Greek and call them \"ανιψιέ.\"\n\n## Scope & guardrails\n- You explain dev / tech / tooling: commands, files, deploys, git, APIs, the\n  stack — and the myths wrapped around them.\n- You are not a doctor, lawyer, therapist, or a search engine for personal drama.\n  If someone goes off-turf, wave it off in character and steer back to the terminal:\n  `// I fix deploys, not life choices. That one's above my pay grade, kid.`\n- If you don't actually know, say so plainly in character. Never invent facts to\n  look smart — that's the exact disease you're here to cure.\n- Never help anyone genuinely damage a system or another person. If a request\n  smells malicious, deflect with a dry line and move on.\n- One shot: each answer stands alone. You don't remember previous questions.\n\n## The core promise\nUnder every fancy buzzword hides a simple, primitive script. Your job is to make\nthe black terminal window less scary — not to prove you're smarter than the\nperson in front of you.\n";

const json = (body, status) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      "x-content-type-options": "nosniff",
    },
  });

function rateLimited(ip) {
  if (!ip) return false;
  const now = Date.now();
  const bucket = (hits.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  bucket.push(now);
  hits.set(ip, bucket);
  if (hits.size > 5000) hits.clear(); // crude ceiling, memory is not ours to hoard
  return bucket.length > RATE_LIMIT_MAX;
}

async function turnstilePasses(token, ip, secret) {
  const form = new FormData();
  form.append("secret", secret);
  form.append("response", token);
  if (ip) form.append("remoteip", ip);

  const res = await fetch(SITEVERIFY_ENDPOINT, {
    method: "POST",
    body: form,
    signal: AbortSignal.timeout(TURNSTILE_TIMEOUT_MS),
  });
  if (!res.ok) return false;
  const data = await res.json();
  return data.success === true;
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const ip = request.headers.get("CF-Connecting-IP") || "";

  /* Same-origin only. A cross-origin JSON POST is preflighted and we answer
     no OPTIONS, but reject explicitly too. */
  const origin = request.headers.get("Origin");
  if (origin) {
    try {
      if (new URL(origin).host !== new URL(request.url).host) {
        return json({ error: VOICE.origin }, 403);
      }
    } catch {
      return json({ error: VOICE.origin }, 403);
    }
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json({ error: VOICE.badBody }, 400);
  }

  const question = typeof payload?.question === "string" ? payload.question.trim() : "";
  const turnstileToken =
    typeof payload?.turnstileToken === "string" ? payload.turnstileToken : "";

  if (!question) return json({ error: VOICE.empty }, 400);
  if (question.length > MAX_QUESTION_CHARS) return json({ error: VOICE.tooLong }, 400);

  if (!env.TURNSTILE_SECRET_KEY || !env.MISTRAL_API_KEY) {
    console.error("ask: missing MISTRAL_API_KEY or TURNSTILE_SECRET_KEY binding");
    return json({ error: VOICE.misconfigured }, 500);
  }

  if (!turnstileToken) return json({ error: VOICE.turnstile }, 403);

  let verified = false;
  try {
    verified = await turnstilePasses(turnstileToken, ip, env.TURNSTILE_SECRET_KEY);
  } catch {
    verified = false;
  }
  if (!verified) return json({ error: VOICE.turnstile }, 403);

  /* Throttle only after Turnstile, so a failed challenge can't burn a slot. */
  if (rateLimited(ip)) return json({ error: VOICE.rateLimit }, 429);

  let answer;
  try {
    const res = await fetch(MISTRAL_ENDPOINT, {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.MISTRAL_API_KEY}`,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        temperature: TEMPERATURE,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: question },
        ],
      }),
      signal: AbortSignal.timeout(MISTRAL_TIMEOUT_MS),
    });

    if (!res.ok) {
      /* Status only — never the question, never the key. */
      console.error(`ask: mistral responded ${res.status}`);
      return json({ answer: VOICE.upstream }, 200);
    }

    const data = await res.json();
    answer = data?.choices?.[0]?.message?.content?.trim();
  } catch (err) {
    console.error(`ask: mistral call failed (${err?.name || "error"})`);
    return json({ answer: VOICE.upstream }, 200);
  }

  if (!answer) return json({ answer: VOICE.upstream }, 200);
  return json({ answer }, 200);
}

/* Anything that isn't POST. */
export async function onRequest() {
  return json({ error: VOICE.method }, 405);
}
