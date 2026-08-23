# CLAUDE.md — The Unacceptable Universe

> **Repo:** `notso.dev` — flip this line to `unacceptable.dev` in the other repo. Everything else is shared.

Shared source of truth. Two **separate** repos on purpose (data siloing). This file keeps the idea coherent; code stays isolated per repo. The only bridge between the two sites is a URL redirect and the owner's hands — **no shared backend.**

## What this is
A two-domain satirical portal for **vibe coders**. Dev-culture humour, dry sarcasm, minimal aesthetic. A mechanism, not a spectacle.

One symmetric visual joke, no docs needed:
```
so.dev → not so.dev      acceptable → unacceptable
```
Read in 3 seconds or it failed.

## Tone spine (non-negotiable)
**Mock the machine, protect the human.** Sarcasm targets tools, buzzwords, cloud providers, industry hype — never the user. Teasing, never condescending or judgmental. Cynical on the outside, kind underneath. That warmth is the differentiator; do not trade it for a cheap put-down.

## The two domains = one loop
| Domain | Role |
|---|---|
| **unacceptable.dev** | INPUT — the confession terminal |
| **notso.dev** | OUTPUT — the feed + the Uncle Dev bot |

Confession box (unacceptable.dev) has **two CTAs**:
- **Send to void** — zero record anywhere. Catharsis is the product; no retention needed.
- **Send to blog** — becomes a feed entry on notso.dev. Asks for a handle (Discord / socials / whatever they already use), not an account. Display-only, unverified. **Owner reviews every submission before it publishes.**

Feed content unit: a `NOT SO [X]` tag + the story. Owner assigns/curates the tag at moderation time.

## notso.dev — the Uncle Dev bot
The core product. The askXXX model with a soul: **no app, no sign-up, just ask.**
- Single terminal box: `guest@notso:~$ ask_uncle [question]`.
- Persona + full behaviour spec lives in **`uncle-dev.system.md`** (notso.dev repo only). English-first, Greek if the user writes Greek. 2-3 sentences, one real-life metaphor, one `//` decompression punchline. Stays strictly in the dev lane.
- Backend: **Mistral API**, called from a **Cloudflare Worker**. API key is a Worker **secret** (`wrangler secret`) — never in code, never client-side.
- Abuse/cost control on the no-sign-up box: **Turnstile** (bot filter) **+ per-IP rate limiting**. Both, always. "Just ask" is open UX and an open cost door at the same time.
- Stateless: each answer stands alone, no memory. Cheaper and fits no-sign-up.

## Funnels (notso -> unacceptable)
Panic gags redirect to the confession box **in Uncle Dev's warm voice** — the uncle walks you there, the system doesn't mock you.
- **Cmd+Z / Ctrl+Z ambient listener** is the ONE funnel to ship first: it catches the reflex, the user doesn't opt in. ~30 lines of JS.
- Rollback / Nuke&Pave bait buttons = the same one-note payload with a button. Ship at most one, later, or cut. Don't build three funnels for one joke.
- The redirect carries only a **canned** pre-fill via URL. The user's typed confession goes as a **POST body — never** a URL param.

## Accessibility (hard rule)
Honour the real OS `prefers-reduced-motion` silently and correctly, everywhere. A user who set it sees a calm site from the first frame — no CRT flicker, no assault. The in-page "Reduce Motion" trap toggle is a separate cosmetic gag and must **never** override a real accessibility preference. The joke never sits on top of a real need.

## Stack & constraints
- Static-first, **Cloudflare Pages**, Git-connected (push -> auto-deploy). Custom domain via Pages.
- The bot adds one Worker to notso.dev. **That is the only dynamic piece. Keep the feed static (git-based moderation). Do NOT add KV / D1 / a database just because a Worker now exists.**
- Local-first, avoid third-party bloat, worker-based flows. Optimise for a **MacBook Air 2017** — light tooling, no lag.

## Anti-goals (protect against overengineering)
- notso.dev landing shipped first; bot next, feed after. Don't build everything at once.
- No AI content-scanner, no auth, no CMS in v1. Owner moderates by hand at fun-project volume.
- No mascot on-site until the Dave Notso sketch is final.
- No feature that needs a manual to get the joke.

## Workflow
`Brainstorm -> Architecture -> Strategy -> Preview -> Commit & Push.`
Review output as: **Urgent Fixes / Quality / Nice-to-have / Monetization.**

---

## Current status

### notso.dev — this repo
- [x] Placeholder landing (`index.html`): breathing `not` hero.
- [x] `uncle-dev.system.md` — Uncle Dev persona / behaviour spec.
- [ ] Terminal-nav (`DIR /ABOUT` -> SYSTEM_SPECS.LOG etc.) + punchline bank. Static, buildable now.
- [ ] Uncle Dev Worker (Mistral + Turnstile + rate limit). **Blocked: waiting on Mistral API key.**
- [ ] Cmd+Z ambient funnel -> unacceptable.dev.
- [ ] Feed (static, git-based).

### unacceptable.dev — other repo
- [ ] Confession terminal: input box, two CTAs (void / blog-with-handle).
- [ ] Submission -> email to owner -> approve -> paste into notso repo -> push -> live.
- Not started. Bot comes first. (Do NOT copy `uncle-dev.system.md` here — the bot lives in notso.dev only.)
