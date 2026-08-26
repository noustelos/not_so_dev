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

**Greek is a best-effort second surface, and that is a settled decision
(2026-08-24).** It exists because Nick is Greek and because a European project
on a European model should answer in the owner's language — not because Greek
speakers are the target audience. They are not. **English is the audience.**

Consequence: Greek replies from `mistral-small-latest` carry occasional
grammar slips — wrong case or pronoun, e.g. "**Σε** στέλνει στον πάροχο"
(sends *you*) where it meant "**Τον** στέλνει" (sends *the code*). **This is
accepted.** Nick reviewed exactly such an answer and called it good enough.

Do NOT, in a future pass:
- move to a larger model to fix Greek grammar — it multiplies per-question cost
  against the EUR 15 cap for a non-target audience;
- add "write correct Greek" instructions to the prompt — small models do not
  reliably obey them, and the prompt is already at three format passes;
- keep re-rolling answers hunting for a cleaner metaphor. `temperature` is 0.7,
  so every reply differs; judging the prompt off a single sample is chasing
  variance, not quality.

Perfect Greek is explicitly **not** a goal. The bar is "understandable and in
voice", and it is met.

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

## Terminal-nav (BUILT 2026-08-25)

Site navigation disguised as an MS-DOS directory listing. Concern that the
reference would be lost on vibe coders was **raised and dismissed by Nick**:
`DIR`, `.EXE` and `.LOG` read as "list of files" from pop culture alone, with
no MS-DOS experience needed. Do not re-litigate it.

**DECORATIVE, NOT INTERACTIVE.** The listing is links styled as a directory —
you click, you never type. Rejected: a real command parser (`CD`, `TYPE`).
Two reasons, both binding. It needs a help text, which trips the anti-goal
*"no feature that needs a manual to get the joke"*. And the page already has
one real command line — `guest@notso:~$ ask_uncle_Dev`. A second input beside
it splits attention away from the one box that actually matters. **Do not add
a typed command line to this page.**

**ONE PAGE.** Content expands inside `index.html`; no routes, no extra HTML
files. Three sections of two paragraphs each would be thin pages that hurt
indexing rather than help it, and the Search Console task is still open. Nick:
*"λιγότερο friction σε κάθε επίπεδο."*

The four entries, agreed:

| File | Holds | State |
|---|---|---|
| `SYSTEM_SPECS.LOG` | what notso.dev is — the two-domain joke | live |
| `UNCLE_DEV.EXE` | who the uncle is, why there is no sign-up | live |
| `README.TXT` | no app, no sign-up, just ask — how the box works | live |
| `CONFESSIONS.LOG` | the feed | **locked** |

`CONFESSIONS.LOG` is locked on purpose and is the best joke in the set:
**`0 bytes — nobody has confessed yet`** (Nick's pick). It is a punchline and
an honest placeholder at once — it promises no content that does not exist, and
it unlocks by itself once the feed lands, with no rewrite of the nav.

No `CONTACT.BAT`: `oops@notso.dev` is already in the footer, and a second copy
is duplication without a joke.

### As built

**Native `<details>`/`<summary>`, zero JavaScript.** Keyboard focus,
Enter/Space toggling and the expanded/collapsed announcement come free from the
element. A buttons-plus-JS toggle would have been more code for worse
accessibility. Marker is `+` / `−`; hiding the browser default needs BOTH
`list-style:none` and `::-webkit-details-marker{display:none}` — the first is
ignored by older Safari, the second by Firefox. Keep both.

**Punchline bank: fixed per section, not shuffled.** This was the open
question. Random was rejected — the page would never render twice the same, so
nothing could be verified, and it would pull in JavaScript for a joke.
Rotation can be layered on later. The lines live in the `.file__body` markup
and are a **second home for Uncle Dev's voice** beside `uncle-dev.system.md`;
read that file before writing a new one, they drift otherwise.

**`CONFESSIONS.LOG` is a plain `<p>`, not a `<details>`.** A control that opens
onto nothing is worse than an honest dead row, so it does not open at all. When
the feed ships it becomes a real `<details>` and nothing around it changes.

Body copy was written by Claude and **read and approved by Nick on 2026-08-25**
— it is the site's first non-bot voice, so treat it as reviewed content, not
placeholder. `.dirnav` is in the `prefers-reduced-motion` reset alongside the
other faded blocks.

## Current status

### notso.dev — this repo
- [x] Placeholder landing (`index.html`): static orange `not` hero. It used to
      breathe on a loop; on a real screen that read as flicker at every
      amplitude and speed tried, so the loop was **cut** (2026-08-24) in favour
      of a one-shot `notin` fade to a resting `opacity:0.66`. Do not reintroduce
      a pulse on the hero. The `prefers-reduced-motion` fallback is now pixel-
      identical to the animated end state — only the fade is dropped.
      The wordmark is **one word**: `notso.dev`, no space between `not` and
      `so` (2026-08-26). The two-domain joke is carried by the COLOUR — orange
      `not`, bone `so.dev` — not by a gap. A gap made it read as two separate
      things instead of one domain. Do not put the space back; if the letters
      ever look too tight, adjust `letter-spacing` on `.not`.
      Prompt label is `ask_uncle_Dev`. The Turnstile badge sits fixed in the
      bottom-left corner at `opacity:0.5`, full strength on hover/focus — it is
      a control, not content, and under the input the eye kept snagging on it.
      Footer carries `ANSWERS BY MISTRAL_AI/> EU` — see "Vendor attribution"
      below before editing that line. The blinking `_` lives on the `.ps1`
      prompt label — see "The blinking cursor" below.
- [x] `uncle-dev.system.md` — Uncle Dev persona / behaviour spec.
- [x] Terminal-nav + punchline bank — **BUILT 2026-08-25**, verified in-browser. See "Terminal-nav" below.
- [x] Uncle Dev bot — **LIVE** on `main` (bot code settled at `4d63ecd`). Pages Function at
      `functions/api/ask.js`, not a standalone Worker: same origin, same git push,
      secrets in the Pages project. Mistral (`mistral-small-latest`) behind
      server-side Turnstile — the model is never called before the challenge
      passes. Plus a best-effort in-isolate per-IP throttle (no KV, no D1).
      `MISTRAL_API_KEY` + `TURNSTILE_SECRET_KEY` set on **Production only** —
      Preview is still empty, see Gotchas. Verified end to end in-browser on
      2026-08-24: widget solves, answer returns in voice with the `//`
      punchline, follow-up questions work (token reset confirmed). Greek in →
      Greek out, with a Greek `//` punchline. **Voice signed off 2026-08-24**
      after three prompt passes (one metaphor / decompressing punchline /
      optional "ανιψιέ") and the `MAX_TOKENS` fix. Nick accepted the resulting
      Greek answer as good enough — see "Greek is a best-effort second
      surface" above before touching the prompt for Greek again.
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
- Not started, but the **domain is owned** and Nick has committed to building
  the confession box there (2026-08-24) — this is no longer hypothetical, and
  it is the thing that unlocks `CONFESSIONS.LOG` in the terminal-nav. To be
  built together in a later session; do not start it unprompted.
- Bot comes first. (Do NOT copy `uncle-dev.system.md` here — the bot lives in
  notso.dev only.)

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

**`max_tokens` sized against English silently truncates Greek.** Greek
tokenises at roughly 2-3 tokens per word against English's ~1.3, so a ceiling
that comfortably fits an English answer cuts a Greek one in half — the reply
arrived severed mid-word (`...κοίτα ξανά τον κώδικά σου σ`). `MAX_TOKENS` went
256 -> 512 on 2026-08-24. This is headroom, not licence to ramble: the prompt
still caps answers at 3 sentences in every language. `ask.js` also reads
Mistral's `finish_reason` and, on `"length"`, trims back to the last complete
sentence — a dangling character reads as a broken site. That trim sacrifices
the `//` punchline when it fires, so it logs a warning: **if that warning shows
up regularly, tighten the prompt, do not raise the ceiling again.**

**The blinking cursor belongs to the input line, and only to it.** It used to
sit at the end of the `// no app, no sign-up, just ask` tagline. Nick reported
it read as a text field there — a blinking caret is an affordance, and pointing
it at a line of prose pulls clicks away from the one box that matters. Moved to
the end of the `guest@notso:~$ ask_uncle_Dev` label on 2026-08-26. Three things
came with the move and all three are load-bearing:

- it **hides on `:focus-within`** — once the box is focused the browser draws a
  real caret, and two cursors on one line is worse than none;
- its animation delay is **1900ms**, after `.terminal`'s 1700ms reveal, so it
  does not blink inside a still-invisible element;
- the span is `aria-hidden="true"` so the `_` stays out of the label's
  accessible name.

Do not add a second decorative cursor anywhere else on the page. One caret,
on the one real input — that is the whole point of having moved it.

**Vendor attribution names the model's ORIGIN, never the data's path.**
The footer line is `ANSWERS BY MISTRAL_AI/> EU` (added 2026-08-24, Nick's
wording). "EU" says the model is European. It must never be widened into
anything a reader could take as a privacy guarantee — "your data stays in the
EU", "GDPR-safe", "EU-hosted". That is a legally loaded claim, it sits right
under a box where people type questions, and this site has no terms, no privacy
policy, and no verified answer on where Mistral processes or how long it
retains prompts. Attribution is safe; a promise is not.

**No link and no logo on it, both deliberate.** Mistral is a supplier, not a
collaborator — a hyperlink reads as endorsement and sends traffic off a
one-page site for nothing in return. Contrast the `NOUSTELOS_STUDIO` credit,
which IS linked precisely because the outbound traffic is the point of it. The
logo is skipped to avoid pulling in brand guidelines over a footer line.

**Cloudflare security hardening, applied 2026-08-25** (by a Chrome extension
driving the dashboard, not by anything in this repo — so it is invisible in git
and will surprise you later): Always Use HTTPS, SSL/TLS **Full (strict)**, min
TLS **1.2**, HSTS 180 days (no subdomains, no preload), nosniff, Certificate
Transparency alerts, **Bot Fight Mode**, Browser Integrity Check. Untouched:
Advanced Certificate Manager, Under Attack mode, and AI/Search bot policies
(all still **Allow**).

**Verified after the change**, both paths: a raw `curl` POST to `/api/ask`
returns *our* JSON 403, not a Cloudflare challenge page — so the request still
reaches the Pages Function despite Bot Fight Mode, and a bare curl is the
profile most likely to be challenged. A real browser question then returned a
full in-voice answer. Turnstile -> token -> Mistral is intact.

**Bot Fight Mode is now a suspect whenever `/api/ask` misbehaves**, and it
cannot be scoped per-path on the free plan. It is fine for browser traffic
today; the exposure is future non-browser callers — an uptime monitor, a
webhook, a CI smoke test — which it may challenge. Check it before debugging
the handler.

**HSTS is the one change that is NOT reversible.** Turning it off in the
dashboard only stops *sending* the header; every browser that already received
it enforces HTTPS for up to 180 days regardless. Harmless here (the site is
HTTPS-only anyway), but the change log that shipped with this work described
everything as one-click reversible, and that part was wrong.

For the open Search Console task: Cloudflare does not challenge verified
crawlers, and the bot policies were left on Allow, so indexing is not blocked
by any of the above — confirm inside Search Console once it is set up.

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
  question (~1000 input + up to 512 output tokens on Mistral Small — the
  ceiling was raised from 256 on 2026-08-24, see Gotchas) that is on the
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

**notso.dev is feature-complete for now.** Landing, bot and terminal-nav are
all live. ~~Terminal-nav~~ done 2026-08-25; the only follow-up left on it is
rotating punchlines instead of fixed ones, which costs the ability to check the
same page twice and needs JS — not obviously worth it.

**The remaining two notso.dev items are NO LONGER independent. Both are blocked
on `unacceptable.dev` existing, so the confession box comes first:**

1. **Confession terminal on `unacceptable.dev`** — the actual next build. The
   domain is owned; Nick asked to build it together, so **do not start it
   unprompted.** Remember the hard siloing rule: separate repo, separate Pages
   project, separate secrets, shared elements copied by hand and never
   imported. The riskiest moment is creating the Pages project — it is easy to
   deploy over the existing one instead of making a new one.
2. **Cmd+Z ambient funnel** -> unacceptable.dev. ~30 lines of JS. Canned
   pre-fill via URL param; the user's typed confession goes as a **POST body,
   never a URL param**. Pointless before there is a page to land on.
3. **Feed** — static, git-based moderation. No KV, no D1, no CMS. Nothing to
   feed it until confessions are being submitted and moderated, and it is what
   unlocks `CONFESSIONS.LOG` in the terminal-nav.

If a browser voice-check came back off (too long / no `//` punchline / Greek
answered in English), that jumps the queue: it is a `uncle-dev.system.md` edit
plus re-embedding the prompt into `functions/api/ask.js`. Prompt only — no
architecture change.
