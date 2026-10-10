#!/usr/bin/env node
/*
 * ══════════════════════════════════════════════════════════════════════════
 *  VERSE AGENT — RialoVerse autonomous data sync  (Option B: Direct mode)
 * ══════════════════════════════════════════════════════════════════════════
 *  Reads DIRECTLY from the Rialo Discord server using a user auth token
 *  (the nath.babu alt account). No relay server, no forwarding needed.
 *  Fully hands-free, 100% automatic, runs twice a day via GitHub Actions.
 *
 *  Risk note: Using a user token in automation violates Discord ToS.
 *  To reduce detection risk this script:
 *    * Uses a realistic browser User-Agent (not "bot")
 *    * Runs infrequently (twice a day, not continuously)
 *    * Adds random jitter delays between requests (2-6 s)
 *    * Fetches only the two channels it needs, nothing else
 *    * Does NOT use a WebSocket gateway (no "online presence" emitted)
 *
 *  Channels read (Rialo server 1393211102577557544):
 *    quiz      1446510433287536680   - weekly Top 10 results
 *    spotlight 1445429099135762493   - weekly community spotlight
 *
 *  CORE RULE (zero hallucination):
 *    Never guess. A value not explicitly in the source is left blank and
 *    the entry is skipped + reported. A wrong entry is worse than none.
 *
 *  Env vars (set as GitHub Actions secrets):
 *    DISCORD_USER_TOKEN   required - nath.babu user auth token
 *
 *  Flags:  --dry-run   parse & report, write nothing (safe for local test)
 * ══════════════════════════════════════════════════════════════════════════
 */

"use strict";
const fs   = require("fs");
const path = require("path");

const ROOT              = path.resolve(__dirname, "..");
const DATA_DIR          = path.join(ROOT, "data");
const SPOTLIGHT_IMG_DIR = path.join(ROOT, "assets", "spotlight");
const REPORT_PATH       = path.join(__dirname, "last-report.md");

const DRY_RUN = process.argv.includes("--dry-run");
const API     = "https://discord.com/api/v9";
const TOKEN   = process.env.DISCORD_USER_TOKEN || "";

// Rialo server - direct channel IDs
const SERVER_ID         = process.env.RIALO_GUILD_ID       || "1393211102577557544";
const QUIZ_CHANNEL      = process.env.QUIZ_CHANNEL_ID      || "1446510433287536680";
const SPOTLIGHT_CHANNEL = process.env.SPOTLIGHT_CHANNEL_ID || "1445429099135762493";
const AGP_CHANNEL       = process.env.AGP_CHANNEL_ID       || "1524939872110907474";

// Realistic browser User-Agent to reduce detection surface
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

const MEDALS  = { 1: "\u{1F947}", 2: "\u{1F948}", 3: "\u{1F949}" };
const report  = [];
let   changed = false;

function log(msg)  { report.push(msg);         console.log(msg); }
function warn(msg) { report.push("!!  " + msg); console.warn("!!  " + msg); }

// Random jitter to appear more human-like
function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }
function jitter()  { return sleep(2000 + Math.random() * 4000); } // 2-6 s

// Discord REST (user token - no "Bot " prefix)
async function discord(endpoint) {
  await jitter();
  const res = await fetch(API + endpoint, {
    headers: {
      "Authorization":     TOKEN,
      "User-Agent":        USER_AGENT,
      "Accept":            "*/*",
      "Accept-Language":   "en-US,en;q=0.9",
      "X-Discord-Locale":  "en-US",
    },
  });

  if (res.status === 401) {
    warn("DISCORD_USER_TOKEN is invalid or expired. Re-generate it from Discord DevTools and update the GitHub secret.");
    fs.writeFileSync(REPORT_PATH, report.join("\n"));
    process.exit(1);
  }

  if (res.status === 403) {
    warn("403 on " + endpoint + " - token cannot see this channel (may need to join a required role/gate).");
    return [];
  }

  if (res.status === 429) {
    const body = await res.json().catch(() => ({}));
    const wait = Math.ceil((body.retry_after || 5) * 1000);
    warn("Rate limited; waiting " + wait + "ms");
    await sleep(wait);
    return discord(endpoint);
  }

  if (!res.ok) throw new Error("Discord " + res.status + " on " + endpoint + ": " + await res.text());
  return res.json();
}

// Newest -> oldest. limit=50 is plenty (we only need the latest few each run).

// Quiz channel has ~40 bot messages from Quizcord for each weekly game.
// We paginate back to cover multiple rounds (up to 400 messages or until known IDs are hit).
async function fetchQuizMessages(channelId, knownIds) {
  const all = [];
  let before = null;
  for (let page = 0; page < 4; page++) {
    const endpoint = "/channels/" + channelId + "/messages?limit=100" + (before ? "&before=" + before : "");
    const batch = await discord(endpoint);
    if (!Array.isArray(batch) || !batch.length) break;
    all.push(...batch);
    before = batch[batch.length - 1].id;
    if (knownIds && batch.some((m) => knownIds.has(m.id))) break;
    if (batch.length < 100) break;
  }
  return all;
}

async function fetchMessages(channelId) {
  return discord("/channels/" + channelId + "/messages?limit=50");
}

// Flatten both normal posts AND forwarded messages (message_snapshots)
function flatten(msg) {
  const snap = msg.message_snapshots && msg.message_snapshots[0] && msg.message_snapshots[0].message;
  const src  = snap || msg;
  return {
    id:          msg.id,
    timestamp:   msg.timestamp,
    author:      msg.author      || {},
    text:        (src.content    || "").trim(),
    mentions:    src.mentions    || msg.mentions    || [],
    attachments: src.attachments || msg.attachments || [],
    embeds:      src.embeds      || msg.embeds      || [],
  };
}


const memberCache = {};

async function getMemberNick(userId) {
  if (memberCache[userId]) return memberCache[userId];
  try {
    const res = await discord("/guilds/" + SERVER_ID + "/members/" + userId);
    const name = res?.nick || res?.user?.global_name || res?.user?.username || null;
    if (name) memberCache[userId] = name;
    return name;
  } catch {
    return null;
  }
}

async function resolveMentionsWithNicks(text, mentions) {
  const matches = [...text.matchAll(/<@!?(\d+)>/g)];
  let result = text;
  for (const m of matches) {
    const full = m[0];
    const id = m[1];
    const u = (mentions || []).find((x) => x.id === id);
    const nick = await getMemberNick(id);
    const displayName = nick || u?.global_name || u?.username || id;
    result = result.split(full).join("@" + displayName);
  }
  return result;
}

function resolveMentions(text, mentions) {
  return text.replace(/<@!?(\d+)>/g, (_, id) => {
    const u = (mentions || []).find((m) => m.id === id);
    return u ? "@" + (u.global_name || u.username) : "@" + id;
  });
}

function fmtDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
}

function readJSON(file, fallback) {
  try { return JSON.parse(fs.readFileSync(file, "utf8")); }
  catch { return fallback; }
}

function writeJSON(file, data) {
  if (DRY_RUN) { log("[dry-run] would write " + file); return; }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
}

// QUIZ
// Supports formats:  1. @user   1) <@id>   Rank 1: @user
// Requires ranks 1..10 all present — else whole post is REJECTED (no partial guesses)
async function parseQuiz(view) {
  const text     = await resolveMentionsWithNicks(view.text, view.mentions);
  const lines    = text.split(/\r?\n/);
  const rankLine = /^\s*(?:#+\s*)?(?:rank\s*)?(\d{1,2})\s*[.):\-]\s*(.+?)\s*$/i;
  const found    = {};

  for (const line of lines) {
    const m = line.match(rankLine);
    if (!m) continue;
    const rank = parseInt(m[1], 10);
    if (rank < 1 || rank > 10 || found[rank]) continue;
    let name = m[2]
      .replace(/^[\u{1F947}\u{1F948}\u{1F949}\u{1F3C5}\u{1F396}\uFE0F\u2728\s]+/u, "")
      .replace(/[*_`~]/g, "")
      .trim();
    if (name) found[rank] = name;
  }

  const missing = [];
  for (let r = 1; r <= 10; r++) if (!found[r]) missing.push(r);
  if (missing.length) {
    return { ok: false, reason: "could not read ranks [" + missing.join(", ") + "] - needs manual review" };
  }

  const champions = [];
  for (let r = 1; r <= 10; r++) {
    champions.push({
      rank:  r,
      medal: MEDALS[r] || "\u{1F3C5}",
      name:  found[r].startsWith("@") ? found[r] : "@" + found[r],
      tag:   "Rank " + r,
      isTop: r <= 3,
    });
  }

  const partsMatch = text.match(/([\d,]+)\s*\+?\s*(?:active\s*)?participants/i);
  const author     = view.author.global_name || view.author.username || "moderator";

  return {
    ok: true,
    entry: {
      date:            fmtDate(view.timestamp),
      attestedBy:      "@" + author + " in #quiz",
      participants:    partsMatch ? partsMatch[1].replace(/,/g, "") + "+ Active Participants" : "",
      isLatest:        false,
      champions,
      source:          "verse-agent",
      sourceMessageId: view.id,
      syncedAt:        new Date().toISOString(),
    },
  };
}

// SPOTLIGHT
// Downloads the official spotlight graphic to assets/spotlight/ to survive Discord CDN expiry.
// We do NOT OCR or guess member names from the image.
async function downloadImage(url, destFile) {
  if (DRY_RUN) { log("[dry-run] would download " + destFile); return; }
  const res = await fetch(url, {
    headers: { "Authorization": TOKEN, "User-Agent": USER_AGENT },
  });
  if (!res.ok) throw new Error("image download " + res.status + " for " + url);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(destFile), { recursive: true });
  fs.writeFileSync(destFile, buf);
}

async function parseSpotlight(view) {
  const image = (view.attachments || []).find(
    (a) => (a.content_type || "").startsWith("image/") ||
            /\.(png|jpe?g|webp|gif)$/i.test(a.filename || a.url || "")
  );
  if (!image) return { ok: false, reason: "no image attachment - needs manual review" };

  const ext      = (image.filename && path.extname(image.filename)) || ".png";
  const localRel = "assets/spotlight/" + view.id + ext;
  const destFile = path.join(ROOT, "assets", "spotlight", view.id + ext);

  await downloadImage(image.url, destFile);

  const resolvedText = resolveMentions(view.text, view.mentions);
  const members      = (view.mentions || []).map((m) => ({
    name:   m.global_name || m.username,
    region: "",
    avatar: "",
  }));

  return {
    ok: true,
    entry: {
      date:            fmtDate(view.timestamp),
      isLatest:        false,
      image:           localRel,
      text:            resolvedText.slice(0, 600),
      members,
      source:          "verse-agent",
      sourceMessageId: view.id,
      syncedAt:        new Date().toISOString(),
    },
  };
}

// Merge helpers
function mergeNewest(existing, newEntry) {
  if (existing.some((e) => e.sourceMessageId && e.sourceMessageId === newEntry.sourceMessageId)) {
    return { list: existing, added: false };
  }
  existing.forEach((e) => { e.isLatest = false; });
  newEntry.isLatest = true;
  return { list: [newEntry, ...existing], added: true };
}

// Runners
async function runQuiz() {
  log("Fetching #quiz directly from Rialo server...");
  const file  = path.join(DATA_DIR, "quiz.json");
  let   list  = readJSON(file, []);
  const known = new Set(list.map((e) => e.sourceMessageId).filter(Boolean));
  const messages = await fetchQuizMessages(QUIZ_CHANNEL, known);
  if (!Array.isArray(messages) || !messages.length) {
    warn("Quiz: no messages returned (channel may be gated or token expired).");
    return;
  }

  for (const msg of messages.slice().reverse()) {
    const view = flatten(msg);
    if (known.has(view.id)) continue;
    if (!/rank|top\s*10|congrats|winners?/i.test(view.text)) continue;
    const res = await parseQuiz(view);
    if (!res.ok) { warn("Quiz message " + view.id + ": " + res.reason); continue; }
    const merged = mergeNewest(list, res.entry);
    if (merged.added) {
      list = merged.list;
      known.add(view.id);
      changed = true;
      log("Quiz synced: " + res.entry.date + " - " + res.entry.champions[0].name);
    }
  }
  writeJSON(file, list);
}

async function runSpotlight() {
  log("Fetching #spotlight directly from Rialo server...");
  const messages = await fetchMessages(SPOTLIGHT_CHANNEL);
  if (!Array.isArray(messages) || !messages.length) {
    warn("Spotlight: no messages returned (channel may be gated or token expired).");
    return;
  }

  const file  = path.join(DATA_DIR, "spotlight.json");
  let   list  = readJSON(file, []);
  const known = new Set(list.map((e) => e.sourceMessageId).filter(Boolean));

  for (const msg of messages.slice().reverse()) {
    const view = flatten(msg);
    if (known.has(view.id)) continue;
    if (!(view.attachments || []).length) continue;
    const res = await parseSpotlight(view);
    if (!res.ok) { warn("Spotlight message " + view.id + ": " + res.reason); continue; }
    const merged = mergeNewest(list, res.entry);
    if (merged.added) {
      list = merged.list;
      known.add(view.id);
      changed = true;
      log("Spotlight synced: " + res.entry.date + " - " + res.entry.image);
    }
  }
  writeJSON(file, list);
}


// ══════════════════════════════════════════════════════
// AGP (Agent Grand Prix) AUTOMATION ENGINE
// ══════════════════════════════════════════════════════
function parseAgp(messages) {
  if (!messages || !messages.length) return null;

  const allAnnouncements = messages.map((m) => {
    const text = (m.content || "").trim();
    const trackMatch = text.match(/https:\/\/agp\.onlatch\.com\/tracks\?id=[\w-]+/);
    const timestampMatch = text.match(/<t:(\d+):([a-zA-Z]?)>/);
    const futureDate = timestampMatch ? new Date(parseInt(timestampMatch[1], 10) * 1000) : null;

    return {
      id: m.id,
      timestamp: m.timestamp,
      date: fmtDate(m.timestamp),
      author: m.author?.username || "ericargent",
      text: text,
      trackUrl: trackMatch ? trackMatch[0] : null,
      targetTime: futureDate ? futureDate.toISOString() : null,
    };
  });

  const latestItem = allAnnouncements[0];
  const now = new Date();
  const latestMsgDate = new Date(latestItem.timestamp);
  const diffHours = (now - latestMsgDate) / (1000 * 60 * 60);

  let status = "STANDBY";
  let statusBadge = "CIRCUIT STANDBY";
  let statusColor = "amber";
  let headline = "Tournament Status: Waiting for Next Round";
  let details = "Previous AGP races on Latch TEE word-circuits have concluded. Subzero Labs will announce the next race round in Discord.";
  let ctaText = "Preview AGP Track (onlatch.com) ↗";
  let ctaUrl = latestItem.trackUrl || "https://agp.onlatch.com";

  if (diffHours < 24) {
    if (/incoming|drops|starting|started|race day|live/i.test(latestItem.text)) {
      status = "LIVE";
      statusBadge = "RACE LIVE 🔴";
      statusColor = "emerald";
      headline = "Live Race in Progress!";
      details = latestItem.text.replace(/<@&?\d+>/g, "").replace(/https?:\/\/\S+/g, "").slice(0, 180).trim();
      ctaText = "Enter Live Track 🏎️ ↗";
    } else {
      status = "ANNOUNCED";
      statusBadge = "NEW ANNOUNCEMENT";
      statusColor = "purple";
      headline = "New AGP Update Dropped";
      details = latestItem.text.replace(/<@&?\d+>/g, "").replace(/https?:\/\/\S+/g, "").slice(0, 180).trim();
    }
  } else if (/first race is happening|second race|next race/i.test(latestItem.text) && latestItem.targetTime && new Date(latestItem.targetTime) > now) {
    status = "UPCOMING";
    statusBadge = "DATE ANNOUNCED";
    statusColor = "purple";
    headline = "Next Race Scheduled";
    details = "Next tournament circuit scheduled for " + new Date(latestItem.targetTime).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
    ctaText = "View Circuit Details ↗";
  }

  return {
    status,
    statusBadge,
    statusColor,
    headline,
    details,
    ctaText,
    ctaUrl,
    latestAnnouncement: {
      id: latestItem.id,
      timestamp: latestItem.timestamp,
      author: latestItem.author,
      date: latestItem.date,
      snippet: latestItem.text.slice(0, 300),
      trackUrl: latestItem.trackUrl,
    },
    totalAnnouncements: allAnnouncements.length,
    announcements: allAnnouncements,
    syncedAt: new Date().toISOString(),
  };
}

async function runAgp() {
  log("Fetching #agp-announcements directly from Rialo server...");
  const messages = await fetchMessages(AGP_CHANNEL);
  if (!Array.isArray(messages) || !messages.length) {
    warn("AGP: no messages returned (channel may be gated or token expired).");
    return;
  }

  const file = path.join(DATA_DIR, "agp.json");
  const existing = readJSON(file, null);

  const parsed = parseAgp(messages);
  if (!parsed) return;

  const isDifferent = !existing || 
    existing.latestAnnouncement?.id !== parsed.latestAnnouncement?.id ||
    existing.status !== parsed.status ||
    existing.statusBadge !== parsed.statusBadge;

  if (isDifferent) {
    writeJSON(file, parsed);
    changed = true;
    log("AGP synced: Status [" + parsed.statusBadge + "] - Latest msg: " + parsed.latestAnnouncement.id);
  } else {
    log("AGP: No status change (Latest msg: " + (existing.latestAnnouncement?.id || "none") + ").");
  }
}

// Main
async function main() {
  log("Verse Agent run @ " + new Date().toISOString() + (DRY_RUN ? " (dry-run)" : ""));
  log("Mode: DIRECT (reading Rialo server channels with user token)");

  if (!TOKEN) {
    console.error("FATAL: DISCORD_USER_TOKEN is not set. Add it as a GitHub secret named DISCORD_USER_TOKEN.");
    process.exit(1);
  }

  try {
    await runQuiz();
    await runSpotlight();
    await runAgp();
  } catch (err) {
    warn("Run error: " + err.message);
    fs.writeFileSync(REPORT_PATH, report.join("\n"));
    process.exit(1);
  }

  if (!changed) log("No new records. Nothing to write.");
  fs.writeFileSync(REPORT_PATH, report.join("\n"));

  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, "changed=" + (changed ? "true" : "false") + "\n");
  }
}

module.exports = { parseQuiz, parseSpotlight, parseAgp, flatten, resolveMentions, fmtDate };
if (require.main === module) {
  main();
}
