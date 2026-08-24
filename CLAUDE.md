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
- Single terminal box: `guest@notso:~$ ask_uncle_Dev [question]`.
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
- [x] Placeholder landing (`index.html`): static orange `not` hero. It used to
      breathe on a loop; on a real screen that read as flicker at every
      amplitude and speed tried, so the loop was **cut** (2026-08-24) in favour
      of a one-shot `notin` fade to a resting `opacity:0.66`. Do not reintroduce
      a pulse on the hero. The `prefers-reduced-motion` fallback is now pixel-
      identical to the animated end state — only the fade is dropped.
      Prompt label is `ask_uncle_Dev`. The Turnstile badge sits fixed in the
      bottom-left corner at `opacity:0.5`, full strength on hover/focus — it is
      a control, not content, and under the input the eye kept snagging on it.
- [x] `uncle-dev.system.md` — Uncle Dev persona / behaviour spec.
- [ ] Terminal-nav (`DIR /ABOUT` -> SYSTEM_SPECS.LOG etc.) + punchline bank. Static, buildable now.
- [x] Uncle Dev bot — **LIVE** on `main` (bot code settled at `4d63ecd`). Pages Function at
      `functions/api/ask.js`, not a standalone Worker: same origin, same git push,
      secrets in the Pages project. Mistral (`mistral-small-latest`) behind
      server-side Turnstile — the model is never called before the challenge
      passes. Plus a best-effort in-isolate per-IP throttle (no KV, no D1).
      `MISTRAL_API_KEY` + `TURNSTILE_SECRET_KEY` set on **Production only** —
      Preview is still empty, see Gotchas. Verified end to end in-browser on
      2026-08-24: widget solves, answer returns in voice with the `//`
      punchline, follow-up questions work (token reset confirmed). Greek in →
      Greek out, with a Greek `//` punchline. **Known gap:** the Greek reply
      does not use "ανιψιέ" as the spec requires — the English reply does use
      "kid". Prompt-only fix if it matters; behaviour is otherwise on-spec.
      Turnstile secret rotated 2026-08-24 (deployment 44c2b8e8) after the old
      one was exposed in chat. **Rotation VERIFIED 2026-08-24**, past the ~2h
      grace window, by a live Greek question that returned a normal answer. No
      separate test was needed: the handler never calls Mistral before
      siteverify passes, so any answer at all is proof the stored secret works.
      Pages secrets are write-only and cannot be read back — a real answer
      after the grace window is the only available proof, and that is now on
      the record.
- [ ] Cmd+Z ambient funnel -> unacceptable.dev.
- [ ] Feed (static, git-based).

### unacceptable.dev — other repo
- [ ] Confession terminal: input box, two CTAs (void / blog-with-handle).
- [ ] Submission -> email to owner -> approve -> paste into notso repo -> push -> live.
- Not started. Bot comes first. (Do NOT copy `uncle-dev.system.md` here — the bot lives in notso.dev only.)

---

## Gotchas / notes

**Pages binds secrets at BUILD time, and Production / Preview are SEPARATE
stores.** A secret added in the dashboard after a deployment reads as
`undefined` in that deployment until a *new build* runs — adding it does not
retro-apply. This is what made `/api/ask` return the in-character 500
(`// My wiring's loose on this end`) while both keys were visibly set in the
dashboard.

The trap: a missing **Preview** secret fails *identically* to a wrong key. Do
not re-enter the Production values chasing it — the value was never the
problem, the environment was. **The first preview branch will 500 until
`MISTRAL_API_KEY` and `TURNSTILE_SECRET_KEY` are added to Preview separately.**
After adding or rotating any Pages secret, always redeploy before testing.

**Never give an element `id="turnstile"`.** An element id becomes a property of
`window`, so `<div id="turnstile">` makes `window.turnstile` the div itself.
Turnstile's `api.js` checks `window.turnstile`, finds it already set, logs
*"Turnstile already has been loaded. Was Turnstile imported multiple times?"*
and aborts without rendering. The warning names the wrong cause — there is no
second import — and every downstream symptom (`render is not a function`,
`typeof turnstile === "object"`, implicit rendering never scanning) follows
from the div being mistaken for the API. The container on notso.dev is
`#ts-widget` for this reason. This cost an entire debugging session.

The lesson generalises: when a page fails and a near-identical test page works,
**diff the two pages first**. The answer was one attribute the whole time.

**Load Turnstile with `defer`, never `async`.** With `async defer`, `async`
wins and `api.js` executes the moment it downloads — mid-parse. On a page with
a large inline `<style>` block the container is not parsed yet, so Turnstile
scans for `.cf-turnstile`, finds nothing, and never scans again. Symptom: the
container has the right class and width but zero children, forever.

**Turnstile renders into a shadow root.** `container.querySelector("iframe")`
never finds the widget and will report a working one as broken. Test
`container.childElementCount > 0` instead.

**A diagnostic must never mutate what it measures.** The on-page error helper
originally wrote its message by emptying the widget container. Every wrong
guess therefore *deleted a working widget* and replaced it with an error,
manufacturing the symptom being chased and corrupting several rounds of
evidence. It writes to its own `#gatemsg` element now. Keep it that way.

**Reading siteverify — the codes name the fault precisely:**

| response | meaning |
|---|---|
| `200` + `success:true` | all good |
| `200` + `invalid-input-response` | **secret is CORRECT**, the token is bad/expired/reused |
| `400` + `invalid-input-secret` | the stored SECRET is wrong (e.g. a sitekey pasted into it) |
| `400` + `missing-input-secret` | the secret is empty or whitespace |

A bad token never yields a 400. Parse the body even when `res.ok` is false —
Cloudflare returns 400 *with* a useful `error-codes` array, and bailing on
status alone hides the real cause. To verify a secret without exposing it:

    read -s "S?secret: "; echo; curl -s -X POST \
      https://challenges.cloudflare.com/turnstile/v0/siteverify \
      -F "secret=$S" -F "response=dummy"; unset S

`functions/api/ask.js` logs these codes but deliberately does not return them.
If a Turnstile failure ever needs diagnosing from the browser again, add
`code: verdict.codes.join(",")` to the 403 JSON for one deploy, then remove it.

**`position:fixed` is not fixed to the viewport if any ancestor is
transformed.** Any ancestor with a `transform` other than `none` becomes the
containing block for its `position:fixed` descendants. The reveal animations
here (`rise`) use `animation-fill-mode: forwards`, which parks the element on
`transform:translateY(0)` **permanently** — a non-`none` value. So `.hero`,
`.terminal`, `.meta` and `.site-foot` are all containing blocks forever, not
just during the 900ms. The Turnstile badge, styled `fixed; left:1rem;
bottom:1rem` while still nested in `.terminal`, pinned itself to the terminal's
bottom-left corner and landed on top of the answer text. The fix is markup, not
CSS: `#ts-widget` is a **direct child of `<body>`**. Do not move it back inside
`main`, and do not try to fix it by removing the transform — four elements need
`rise`.

**Turnstile `code 110200` = unknown domain, and it is the expected result of a
local preview.** The sitekey is scoped to `notso.dev`, so VS Code Go Live
(`127.0.0.1:5500`) can never build the widget — the container renders a stub
with a "Troubleshoot" link. This is not a regression and not a key problem.
**Decision (2026-08-24): leave it.** `localhost`/`127.0.0.1` were deliberately
NOT added to the production sitekey's Hostname Management — a permanent
loosening of the live key for a temporary preview is a bad trade. Go Live is
for checking layout only; the bot flow is verified against production.

**Local dev.** `.dev.vars` is gitignored and untracked — it holds the Turnstile
*test* keys (sitekey `1x00000000000000000000AA` 24 chars / secret
`1x0000000000000000000000000000000AA` 35 chars, both always-pass). Those two
lengths are also how you tell a real sitekey from a real secret: **sitekey 24,
secret 35**, and both start `0x4AAAAAA`. Only the 24-char one is safe in
`index.html`.

Note `wrangler pages dev` cannot run on this MacBook Air — workerd needs
macOS 13.5+ and it is on 12.6. The bot was tested by driving the real handler
under Node with live Turnstile/Mistral calls, then re-verified against
production.

---

## Next session

**Open actions first — carried over, both small:**

- ~~Mistral spend cap~~ — **DONE 2026-08-24: EUR 15 cap set on the Mistral
  account.** This is the hard ceiling; Turnstile and the per-IP throttle are
  probabilistic and cannot bound cost on their own. At roughly EUR 0.0002 per
  question (~1000 input + 256 output tokens on Mistral Small) that is on the
  order of tens of thousands of questions — far above fun-project volume, so it
  caps an abuse scenario without throttling real use. If the bot ever goes
  quiet with no Turnstile error, check whether the cap was reached before
  debugging anything else.
- ~~Verify the secret rotation~~ — **DONE 2026-08-24**, see the status entry.
- ~~Decide on "ανιψιέ."~~ — **DONE 2026-08-24: it is now explicitly OPTIONAL**
  in `uncle-dev.system.md`, and the bot omitting it entirely is an accepted
  outcome, not a defect. Nick's original instinct held: a forced vocative makes
  Greek read stiff, and stiff is the opposite of the voice. Do not "fix" future
  Greek replies that lack it. The same pass also tightened two real voice
  drifts caught in a live answer — **exactly one** metaphor (it had stacked a
  sticker-on-a-box on top of a folder-in-an-office), and the `//` line must
  speak *to the person* rather than recap the answer (it had restated its own
  metaphor). Plus: stay general when unsure of a flag's exact behaviour —
  vague-and-true over specific-and-wrong.

**Then, each independent and none requiring the bot to change:**

1. **Terminal-nav** — `DIR /ABOUT` -> `SYSTEM_SPECS.LOG` etc. + punchline bank.
   Static, buildable immediately, no blockers.
2. **Cmd+Z ambient funnel** -> unacceptable.dev. ~30 lines of JS. Canned
   pre-fill via URL param; the user's typed confession goes as a **POST body,
   never a URL param**.
3. **Feed** — static, git-based moderation. No KV, no D1, no CMS.

If a browser voice-check came back off (too long / no `//` punchline / Greek
answered in English), that jumps the queue: it is a `uncle-dev.system.md` edit
plus re-embedding the prompt into `functions/api/ask.js`. Prompt only — no
architecture change.
