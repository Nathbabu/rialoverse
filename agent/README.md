# Verse Agent — Setup Guide

Auto-syncs the **Weekly Quiz Top 10** and **Community Spotlight** from Discord
into the RialoVerse site. Runs on GitHub's free cloud runners twice a day. Your
PC is never involved.

## How it works (and why it's safe)

You can't add a bot to the Rialo server, and using your personal account token
in a script ("self-botting") violates Discord's rules and risks a **permanent
ban**. So we never touch the Rialo server directly. Instead:

```
Rialo #quiz / #spotlight
        │
        │  ← YOU relay it into your own space:
        │     • Announcement (📣) channels: press "Follow" once → auto-mirrored forever
        │     • Plain (#) channels like #quiz: tap "Forward" on the weekly post (~5s)
        ▼
YOUR OWN Discord server  (you're the admin, so YOUR bot is allowed here)
        │
        ▼
GitHub Actions (2×/day)  →  agent/sync.js reads your server with your bot
        │                    parses names deterministically (no guessing)
        ▼
data/quiz.json + data/spotlight.json committed  →  site updates itself
```

**The only recurring effort:** forwarding the quiz post once a week (seconds, from
your phone). Everything else is automatic. There is no fully hands-off option for
a plain text channel you don't control — this is the closest that stays safe.

---

## One-time setup (~15 minutes)

### 1. Make your own Discord server
Discord → **+** (Add a Server) → **Create My Own** → name it e.g. "Rialoverse Ingest".
Create two text channels in it: **#quiz-inbox** and **#spotlight-inbox**.

### 2. Create your bot
1. Go to <https://discord.com/developers/applications> → **New Application**.
2. Left sidebar → **Bot** → **Reset Token** → **Copy** the token. Keep it secret.
3. On that same Bot page, turn ON **Message Content Intent** (required, or the bot
   sees blank messages). Save.

### 3. Add your bot to your server
1. Left sidebar → **OAuth2** → **URL Generator**.
2. Scopes: check **bot**. Bot Permissions: check **View Channels** + **Read Message
   History** (nothing else — it never needs to post).
3. Copy the generated URL, open it, and add the bot to **your** server.

### 4. Get the two channel IDs
Discord → **User Settings → Advanced → Developer Mode: ON**. Then right-click
(or long-press) **#quiz-inbox** → **Copy Channel ID**, and the same for
**#spotlight-inbox**.

### 5. Add the secrets to GitHub
Repo → **Settings → Secrets and variables → Actions → New repository secret**, add:

| Name | Value |
|------|-------|
| `DISCORD_BOT_TOKEN` | the bot token from step 2 |
| `INGEST_QUIZ_CHANNEL_ID` | #quiz-inbox ID |
| `INGEST_SPOTLIGHT_CHANNEL_ID` | #spotlight-inbox ID |

### 6. Turn things on
- Repo → **Actions** tab → enable workflows if prompted.
- Repo → **Settings → Pages** → make sure the site is published (so `data/*.json`
  is served on the same origin as the site).

---

## Weekly routine
- **Quiz:** when the Top 10 is posted in Rialo #quiz, tap **⋯ → Forward** → send to
  your **#quiz-inbox**. Done.
- **Spotlight:** if Rialo #spotlight has a **📣 megaphone** icon, press **Follow**
  once and point it at **#spotlight-inbox** — it mirrors automatically after that.
  If it's a plain **#** channel, forward it like the quiz.

The agent runs at 06:15 and 18:15 UTC, so a forwarded post appears on the site
within ~12 hours. To see it immediately: **Actions → Verse Agent → Run workflow**.

---

## Safety rails built in
- **No guessing.** A quiz post is only saved if all 10 ranks are read cleanly;
  otherwise it's skipped and flagged in the run report (Actions → the run →
  Summary). A wrong entry never gets written.
- **Exact names.** `<@id>` mentions are resolved to the exact Discord display name
  from the message payload — never approximated.
- **Images won't rot.** Spotlight graphics are downloaded into `assets/spotlight/`
  because Discord's CDN links expire in ~24h.
- **Provenance.** Every synced entry stores `sourceMessageId` and `syncedAt`.
- **Zero dependencies.** The agent uses only built-in Node — nothing in an npm tree
  can read your token.

## Test locally without writing anything
```bash
DISCORD_BOT_TOKEN=xxx INGEST_QUIZ_CHANNEL_ID=yyy node agent/sync.js --dry-run
```
