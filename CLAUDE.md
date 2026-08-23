# CLAUDE.md — The Unacceptable Universe

> **Repo:** `notso.dev` &nbsp;·&nbsp; _(flip this line to `unacceptable.dev` in the other repo — everything else here is shared)_

Shared source of truth for the concept. Two **separate** repos on purpose (data siloing) — this file keeps the idea coherent; the code stays isolated per repo.

---

## What this is

A two-domain satirical portal for **vibe coders**. Dev-culture humour, dry irony, minimal aesthetic. Not a spectacle — a mechanism.

The whole brand is one symmetric visual joke, no documentation needed:

```
so.dev   →   not so.dev
acceptable   →   unacceptable
```

The reader gets it in 3 seconds or it failed.

## The two domains = one loop

| Domain | Role | What happens |
|---|---|---|
| **unacceptable.dev** | INPUT — the confession terminal | you write your `NOT SO ___` story / bug / confession |
| **notso.dev** | OUTPUT — the feed | approved stories live here, endless scroll |

Atomic unit of content: a **`NOT SO [X]`** tag (NOT SO SENIOR, NOT SO SOBER, NOT SO PROMPT ENGINEER…) + free-text body. The tag is the meme; the body is the story.

- **No accounts, no sign-up.** Optional handle + link to their work.
- **Nothing auto-publishes.** Submission → queue → owner reviews (admin/email) → approve → live.
- **No AI content-scanner in v1.** Volume is small; the owner reads them over coffee. Add a pre-filter only if volume ever justifies it — not before.

## Aesthetic direction

- Minimal, brutalist-adjacent, monospace. `Space Mono` display.
- Palette: cool near-black ink `#0b0c0e`, warm bone `#ede8df` for the stable text, Claude orange `#d97757` for the *correction* (the `not`).
- Signature motion = the **breathing `not`**: `so.dev` sits solid, `not` ghosts in and out in front of it, slow, cinematic, forever. Space is reserved so nothing reflows.
- One-time entrance beat: `so.dev` settles first, then `not` starts breathing. Skippable / respects `prefers-reduced-motion`.
- Hard rule: **one motion carries the page.** No VHS, no glitch storm, no animated iceberg. If a second effect competes with the breathing `not`, cut it.

## Stack & constraints

- Static-first. **Cloudflare Pages** hosting. Plain `index.html`, no framework unless a real need forces it.
- Local-first. Avoid third-party extensions and heavy dependencies. Worker-based flows if backend is ever needed.
- Optimise for a **MacBook Air 2017** — keep builds light, avoid lag-heavy tooling.
- Google Workspace / Maps API only where a project actually calls for it (not here).

## Anti-goals (protect against overengineering)

- Don't build both sites at once. **`notso.dev` landing ships first.** Prove the loop, then wire the satellite.
- No AI moderation, no auth system, no CMS in v1.
- No mascot on-site until the Dave Notso sketch is finalised.
- No feature that needs a manual to understand the joke.

## Workflow

`Brainstorm → Architecture → Strategy → Preview → Commit & Push.`

Review output categorised as: **Urgent Fixes / Quality / Nice-to-have / Monetization.**

---

## Current status

### notso.dev — this repo
- [x] Placeholder landing (`index.html`): breathing `not` hero, `// in development`, tagline.
- [ ] Deploy to Cloudflare Pages + point custom domain.
- [ ] Feed / endless scroll (later).
- [ ] Reactive Dave Notso mascot (later, pending sketch).

### unacceptable.dev — other repo
- [ ] Confession terminal (input box, `EXECUTE / DEPLOY TO VOID`).
- [ ] Submission → moderation queue → email/admin → publish to notso.dev feed.
- Not started. notso landing goes live first.
