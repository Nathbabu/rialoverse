// ══════════════════════════════════════════════════════
// LUXURY GLASSMORPHISM TOAST & CONFIRM MODAL SYSTEM
// ══════════════════════════════════════════════════════
function showVerseToast(message, type, duration) {
  if (type === undefined) type = "success";
  if (duration === undefined) duration = 3200;

  var container = document.getElementById("verseToastContainer");
  if (!container) return;

  var toast = document.createElement("div");
  toast.className = "pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border backdrop-blur-md transition-all duration-300 transform translate-y-4 opacity-0 text-xs font-mono font-bold select-none " +
    (type === "error" ? "bg-rose-900/90 text-rose-100 border-rose-700/60 shadow-rose-950/20" :
     type === "warning" ? "bg-amber-900/90 text-amber-100 border-amber-700/60 shadow-amber-950/20" :
     type === "info" ? "bg-slate-900/90 text-slate-100 border-slate-700/60 shadow-slate-950/20" :
     "bg-[#205446]/95 text-white border-emerald-500/40 shadow-emerald-950/20");

  var iconMap = {
    success: "✓",
    error: "✕",
    warning: "⚠️",
    info: "⚡"
  };

  toast.innerHTML = 
    '<span class="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs shrink-0">' + (iconMap[type] || "✓") + '</span>' +
    '<span class="flex-1 leading-snug font-sans text-xs font-semibold">' + escapeHtml(message) + '</span>';

  container.appendChild(toast);

  requestAnimationFrame(function() {
    toast.classList.remove("translate-y-4", "opacity-0");
    toast.classList.add("translate-y-0", "opacity-100");
  });

  setTimeout(function() {
    toast.classList.remove("translate-y-0", "opacity-100");
    toast.classList.add("translate-y-2", "opacity-0");
    setTimeout(function() { toast.remove(); }, 300);
  }, duration);
}

function showVerseConfirm(options) {
  var overlay = document.getElementById("verseModalOverlay");
  var card = document.getElementById("verseModalCard");
  var title = document.getElementById("verseModalTitle");
  var msg = document.getElementById("verseModalMessage");
  var icon = document.getElementById("verseModalIcon");
  var confirmBtn = document.getElementById("verseModalConfirmBtn");
  var cancelBtn = document.getElementById("verseModalCancelBtn");

  if (!overlay || !card) {
    if (confirm(options.message)) {
      if (options.onConfirm) options.onConfirm();
    }
    return;
  }

  title.innerText = options.title || "Confirm Action";
  msg.innerText = options.message || "Are you sure you want to proceed?";
  icon.innerText = options.icon || "⚠️";
  confirmBtn.innerText = options.confirmText || "Confirm";
  
  if (options.isDanger) {
    confirmBtn.className = "px-4 py-2 rounded-xl text-xs font-mono font-bold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 shadow-sm transition-all";
    icon.className = "w-11 h-11 rounded-xl bg-rose-100 text-rose-900 border border-rose-200 flex items-center justify-center text-xl shrink-0 shadow-sm";
  } else {
    confirmBtn.className = "px-4 py-2 rounded-xl text-xs font-mono font-bold text-white bg-[#205446] hover:bg-[#184237] active:scale-95 shadow-sm transition-all";
    icon.className = "w-11 h-11 rounded-xl bg-amber-100 text-amber-900 border border-amber-200 flex items-center justify-center text-xl shrink-0 shadow-sm";
  }

  function closeModal() {
    overlay.classList.remove("opacity-100", "pointer-events-auto");
    overlay.classList.add("opacity-0", "pointer-events-none");
    card.classList.remove("scale-100");
    card.classList.add("scale-95");
  }

  confirmBtn.onclick = function() {
    closeModal();
    if (options.onConfirm) options.onConfirm();
  };

  cancelBtn.onclick = closeModal;
  overlay.onclick = function(e) {
    if (e.target === overlay) closeModal();
  };

  overlay.classList.remove("opacity-0", "pointer-events-none");
  overlay.classList.add("opacity-100", "pointer-events-auto");
  card.classList.remove("scale-95");
  card.classList.add("scale-100");
}

/* RIALOVERSE  -  Official Rialo Playground Cream & Pine Theme Engine */
var allProjects = getSeedFallbackData();
var filteredProjects = allProjects.slice();
var currentPage = "home";
var currentLeaderboardCriteria = "projects";
var activeCategoryFilter = "all";

function navigateTo(pageId) {
  var pages = document.querySelectorAll(".page-view");
  pages.forEach(function(p) { p.classList.remove("active"); });

  var target = document.getElementById("page-" + pageId);
  if (target) {
    target.classList.add("active");
  } else {
    var home = document.getElementById("page-home");
    if (home) home.classList.add("active");
  }

  
  var navBtns = document.querySelectorAll(".nav-pill");
  navBtns.forEach(function(btn) { btn.classList.remove("active"); });

  var activeBtn = document.getElementById("nav-btn-" + pageId);
  if (activeBtn) {
    activeBtn.classList.add("active");
  }

  // If on dapps, leaderboard, analytics or events, ensure renders
  if (pageId === "dapps") renderProjectDirectory();
  if (pageId === "leaderboard") renderLeaderboard();
  if (pageId === "analytics") renderAnalyticsView();
  if (pageId === "events") {
    if (typeof renderSharkTankCard === "function") renderSharkTankCard();
    if (typeof renderCommunitySpotlight === "function") renderCommunitySpotlight();
    if (typeof renderQuizChampions === "function") renderQuizChampions();
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function addRialoToWallet() {
  if (typeof window.ethereum !== "undefined") {
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{
          chainId: "0x2329",
          chainName: "Rialo Testnet",
          nativeCurrency: { name: "Rialo Point", symbol: "RIA", decimals: 18 },
          rpcUrls: ["https://testnet.rialo.io/rpc"],
          blockExplorerUrls: ["https://explorer.testnet.rialo.io"]
        }]
      });
      showVerseToast("✓ Rialo Testnet successfully added to your wallet!", "success");
    } catch (error) {
      if (error.code === 4001) {
        showVerseToast("Network request was cancelled by user.", "info");
      } else {
        showVerseToast("Could not add automatically: " + error.message, "error");
      }
    }
  } else {
    showVerseToast("MetaMask not detected. RPC: https://testnet.rialo.io", "warning");
  }
}

function copyText(str) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(str).then(function() { 
      showVerseToast("📋 Copied: " + str, "success"); 
    });
  } else {
    prompt("Copy parameter:", str);
  }
}

function generateLatchPolicy() {
  var role = document.getElementById("latchAgentRole") ? document.getElementById("latchAgentRole").value : "AGP Racer Bot";
  var spend = document.getElementById("latchSpendLimit") ? document.getElementById("latchSpendLimit").value : "50 RP / Day";
  var rate = document.getElementById("latchRateLimit") ? document.getElementById("latchRateLimit").value : "30 req/min";
  var token = "lat_test_" + Math.random().toString(36).substring(2, 8) + "_rialo";
  
  var tokenEl = document.getElementById("latchTokenSample");
  var codeEl = document.getElementById("latchCodeSnippet");
  
  if (tokenEl) tokenEl.textContent = token;
  if (codeEl) {
    codeEl.textContent = "# Python: " + role + " with Hardware-Enforced Latch Policy\n" +
      "from latch_sdk import LatchAgentProxy\n\n" +
      "# 1. Initialize agent with hardware-enforced Latch limits on Rialo\n" +
      "agent = LatchAgentProxy(\n" +
      "    latch_token=\"" + token + "\",\n" +
      "    network=\"rialo-testnet-9001\",\n" +
      "    policy={\n" +
      "        \"agent_role\": \"" + role + "\",\n" +
      "        \"max_daily_budget\": \"" + spend + "\",\n" +
      "        \"rate_limit\": \"" + rate + "\",\n" +
      "        \"allowed_contracts\": [\"0xRialoAGPWordCircuit\", \"0xRialoPredictPool\"]\n" +
      "    }\n" +
      ")\n\n" +
      "# 2. Safely call smart contracts without exposing master private keys\n" +
      "tx = agent.call_contract(\n" +
      "    target=\"0xRialoAGPWordCircuit\",\n" +
      "    function=\"submit_word_guess\",\n" +
      "    args={\"circuit_id\": 12, \"guess\": \"SUBZERO\"}\n" +
      ")\n\n" +
      "print(\"Safe Transaction Executed on Rialo:\", tx.tx_hash)";
  }
  showVerseToast("✓ New Latch Policy & Scoped Token Generated for: " + role, "success");
}

function copyGeneratedLatchCode() {
  var codeEl = document.getElementById("latchCodeSnippet");
  if (codeEl) copyText(codeEl.textContent);
}





var categoryPieChartInstance = null;

var sectorDatabase = {
  "Autonomous AI Agents & Bots": {
    icon: "smart_toy",
    color: "#205446",
    badge: "CORE PROTOCOL",
    description: "Autonomous software agents and AI bots executing on-chain transactions, trading logic, oracle interrogations, and task labor under Subzero Labs' Latch TEE governance without exposing master private keys.",
    whatsBuilt: "Task escrow markets (Trocooony), AI insurance claim bots (Rialo Claimbot), parimutuel race bots, and automated LLM prompt relays.",
    whatsMissing: "Long-term vector memory stores, multi-agent DAO consensus, and automated cross-agent liquidity rebalancing."
  },
  "Web3 Gaming & On-Chain Arcade": {
    icon: "sports_esports",
    color: "#D0882B",
    badge: "HIGH ACTIVITY",
    description: "Real-time mini-games, competitive reflex arcades, and on-chain puzzle circuits built on Rialo's ~0.4s sub-second block confirmation for lag-free Web3 gaming.",
    whatsBuilt: "Oracle word-circuit racers (AGP), drop reflex games, tile sliders, on-chain chess boards, and runner mini-games.",
    whatsMissing: "Multiplayer turn-based card battlers, confidential poker tables, and on-chain physics engines."
  },
  "Block Explorers & Telemetry": {
    icon: "query_stats",
    color: "#2563EB",
    badge: "INFRASTRUCTURE",
    description: "Real-time ledger visualizers, block explorers, transaction trackers, and network performance telemetry monitors tracking Rialo's sub-second finality.",
    whatsBuilt: "Block and transaction explorers (Rialoscan), REX state visualizers, and node telemetry dashboards.",
    whatsMissing: "AI-powered transaction natural-language decoders, gas analytics charts, and contract decompilers."
  },
  "DeFi, Prediction & Lending": {
    icon: "account_balance",
    color: "#059669",
    badge: "HIGH OPPORTUNITY",
    description: "Decentralized finance protocols, prediction outcome pools, collateralized lending, and automated market makers built for low-latency settlement.",
    whatsBuilt: "Binary prediction pools (Rialo Predict), deferred-settlement lending prototypes (Rialo-Syncred), and collateral trackers.",
    whatsMissing: "Confidential AMMs with private order routing, cross-chain yield aggregators, and flash loan primitives."
  },
  "Developer SDKs & Tooling": {
    icon: "terminal",
    color: "#7C3AED",
    badge: "DEVELOPER TOOLING",
    description: "Command-line interfaces (CLIs), Terminal UIs, Python & JavaScript client SDKs, testing harnesses, and automated deployment pipelines for smart contract engineers.",
    whatsBuilt: "Terminal faucets (Rialo Playground TUI), Latch policy generators, RPC injection scripts, and testing helpers.",
    whatsMissing: "Hardhat/Foundry deployment plugins for Rialo, VSCode contract debugging extensions, and local testnet mockers."
  },
  "Wallets, Identity & Bridges": {
    icon: "link",
    color: "#EA580C",
    badge: "GROWTH SECTOR",
    description: "Cryptographic account linkers, multi-signature key managers, cross-chain relayer bridges, and developer identity verification passports.",
    whatsBuilt: "Social account cryptographic linkers (Rialink), 1-click Web3 wallet connectors, and GitHub repo attestations.",
    whatsMissing: "Mobile biometric Latch authenticators (FaceID tap-to-sign) and trustless Ethereum/Base asset bridges."
  },
  "Privacy & Zero-Knowledge": {
    icon: "shield_lock",
    color: "#475569",
    badge: "NATIVE MATH",
    description: "Zero-knowledge encryption layers, confidential balance shields, private DAO voting protocols, and secret oracle compute pipelines.",
    whatsBuilt: "Shielded Base Sepolia relayer (Rialo Obscura), balance privacy simulators, and confidential transfer demos.",
    whatsMissing: "Private DAO governance voting with anonymous tallying, and ZK compliance attestations."
  }
};

// Short display label for a long sector name, e.g. "DeFi, Prediction & Lending" -> "DeFi".
function shortSectorName(sector) {
  return String(sector).split(/[,&]/)[0].trim();
}

// Compute the 4 analytics metric cards live from the data — no hardcoded percentages.
function updateAnalyticsMetrics(sectorCounts, sortedSectors, total) {
  if (typeof document === "undefined") return;
  var pct = function (c) { return Math.round((c / total) * 100); };
  var set = function (id, txt) { var el = document.getElementById(id); if (el) el.textContent = txt; };

  var top = sortedSectors[0];
  set("metricNicheName", shortSectorName(top) + " (" + pct(sectorCounts[top]) + "%)");
  set("metricNicheSub", sectorCounts[top] + " dApps in this sector");

  // Trending = the sector with the most new projects, excluding the overall
  // leader so this card adds information instead of repeating "Most built".
  var newBySector = {};
  allProjects.forEach(function (p) {
    if (p.isNew) { var s = p.primarySector || top; newBySector[s] = (newBySector[s] || 0) + 1; }
  });
  var trend = Object.keys(newBySector)
    .filter(function (s) { return s !== top; })
    .sort(function (a, b) { return newBySector[b] - newBySector[a]; })[0];
  if (trend) {
    set("metricTrendName", shortSectorName(trend));
    set("metricTrendSub", newBySector[trend] + " new projects added");
  } else {
    set("metricTrendName", shortSectorName(sortedSectors[1] || top));
    set("metricTrendSub", "Recently active sector");
  }

  // Biggest gap = smallest sector (last after descending sort) = best opportunity.
  var gap = sortedSectors[sortedSectors.length - 1];
  set("metricGapName", shortSectorName(gap) + " (" + pct(sectorCounts[gap]) + "%)");
  set("metricGapSub", sectorCounts[gap] + " dApps — room to build");

  set("metricBuildersCount", uniqueBuilderCount());
  set("metricBuildersSub", "shipping across " + total + " dApps");
}

function renderAnalyticsView() {
  var container = document.getElementById("categoryBarsContainer");
  if (!allProjects) return;

  var sectorCounts = {};
  Object.keys(sectorDatabase).forEach(function(k) { sectorCounts[k] = 0; });

  allProjects.forEach(function(p) {
    var sector = p.primarySector || "Autonomous AI Agents & Bots";
    if (!sectorCounts[sector]) sectorCounts[sector] = 0;
    sectorCounts[sector]++;
  });

  var total = allProjects.length || 1;
  var sortedSectors = Object.keys(sectorCounts).sort(function(a, b) { return sectorCounts[b] - sectorCounts[a]; });

  updateAnalyticsMetrics(sectorCounts, sortedSectors, total);

  // 1. Render Right Side Progress Bars with Clickable Deep-Dive Modals
  if (container) {
    container.innerHTML = sortedSectors.map(function(sector) {
      var meta = sectorDatabase[sector] || { color: "#205446", icon: "category" };
      var count = sectorCounts[sector];
      var pct = Math.round((count / total) * 100);

      return "<div class=\"p-3 rounded-xl hover:bg-black/[0.02] border border-transparent hover:border-black/[0.08] transition-all cursor-pointer\" onclick=\"openSectorModal('" + escapeHtml(sector) + "')\">" +
        "<div class=\"flex items-center justify-between text-xs font-mono mb-1.5\">" +
          "<span class=\"text-brand-text font-bold flex items-center gap-2\">" +
            "<span class=\"w-2.5 h-2.5 rounded-full flex-shrink-0\" style=\"background-color: " + meta.color + "\"></span>" +
            "<span>" + escapeHtml(sector) + "</span>" +
            "<span class=\"text-[10px] text-brand-pine font-normal underline\">View Details ↗</span>" +
          "</span>" +
          "<span class=\"text-brand-text font-bold\">" + count + " dApps <span class=\"text-slate-400 font-normal\">(" + pct + "%)</span></span>" +
        "</div>" +
        "<div class=\"w-full h-2.5 rounded-full bg-black/[0.06] overflow-hidden\">" +
          "<div class=\"h-full rounded-full transition-all duration-500\" style=\"width: " + pct + "%; background-color: " + meta.color + "\"></div>" +
        "</div>" +
      "</div>";
    }).join("");
  }

  // 2. Render Left Side Interactive Doughnut/Pie Chart
  var canvas = document.getElementById("categoryPieChart");
  if (canvas && typeof Chart !== "undefined") {
    var chartLabels = sortedSectors;
    var chartData = sortedSectors.map(function(s) { return sectorCounts[s]; });
    var chartColors = sortedSectors.map(function(s) { return (sectorDatabase[s] ? sectorDatabase[s].color : "#205446"); });

    if (categoryPieChartInstance) {
      categoryPieChartInstance.destroy();
    }

    var ctx = canvas.getContext("2d");
    categoryPieChartInstance = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: chartLabels,
        datasets: [{
          data: chartData,
          backgroundColor: chartColors,
          borderColor: "#FFFFFF",
          borderWidth: 2,
          hoverOffset: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "70%",
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: "#111214",
            titleColor: "#FFFFFF",
            bodyColor: "#FFFFFF",
            padding: 10,
            cornerRadius: 10,
            callbacks: {
              label: function(context) {
                var val = context.parsed || 0;
                var p = Math.round((val / total) * 100);
                return " " + context.label + ": " + val + " dApps (" + p + "%)";
              }
            }
          }
        }
      }
    });
  }
}

function openSectorModal(sectorName) {
  var meta = sectorDatabase[sectorName];
  if (!meta) return;

  var matchingProjects = allProjects.filter(function(p) { return p.primarySector === sectorName; });
  var modalEl = document.getElementById("sectorModal");
  var contentEl = document.getElementById("sectorModalContent");
  if (!modalEl || !contentEl) return;

  contentEl.innerHTML = 
    "<div class=\"flex items-start gap-4 pb-4 border-b border-black/[0.08]\">" +
      "<div class=\"w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm flex-shrink-0\" style=\"background-color: " + meta.color + "\">" +
        "<span class=\"material-symbols-outlined text-2xl\">" + meta.icon + "</span>" +
      "</div>" +
      "<div class=\"flex-1 min-w-0\">" +
        "<div class=\"flex items-center gap-2\">" +
          "<h2 class=\"text-xl font-black text-brand-text\">" + escapeHtml(sectorName) + "</h2>" +
          "<span class=\"text-[9px] font-mono font-bold px-2 py-0.5 rounded-full text-white\" style=\"background-color: " + meta.color + "\">" + meta.badge + "</span>" +
        "</div>" +
        "<p class=\"text-xs text-brand-textMuted mt-1 leading-relaxed\">" + escapeHtml(meta.description) + "</p>" +
      "</div>" +
    "</div>" +

    "<div class=\"grid grid-cols-1 md:grid-cols-2 gap-3 text-xs\">" +
      "<div class=\"p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 space-y-1\">" +
        "<div class=\"font-bold text-emerald-900 flex items-center gap-1.5\">" +
          "<span class=\"material-symbols-outlined text-sm text-emerald-700\">check_circle</span>" +
          "<span>What's Already Built:</span>" +
        "</div>" +
        "<p class=\"text-emerald-800 text-[11px] leading-relaxed\">" + escapeHtml(meta.whatsBuilt) + "</p>" +
      "</div>" +
      "<div class=\"p-3.5 rounded-xl bg-amber-50 border border-amber-100 space-y-1\">" +
        "<div class=\"font-bold text-amber-900 flex items-center gap-1.5\">" +
          "<span class=\"material-symbols-outlined text-sm text-amber-700\">construction</span>" +
          "<span>What's Missing (Opportunity):</span>" +
        "</div>" +
        "<p class=\"text-amber-800 text-[11px] leading-relaxed\">" + escapeHtml(meta.whatsMissing) + "</p>" +
      "</div>" +
    "</div>" +

    "<div class=\"space-y-2 pt-2\">" +
      "<div class=\"flex items-center justify-between text-xs font-bold text-brand-text\">" +
        "<span>Live Projects in this Sector (" + matchingProjects.length + "):</span>" +
        "<span class=\"text-[11px] font-mono text-brand-textMuted font-normal\">Click to Launch</span>" +
      "</div>" +
      "<div class=\"space-y-2 max-h-56 overflow-y-auto pr-1\">" +
        matchingProjects.map(function(p) {
          return "<div class=\"p-3 rounded-xl bg-[#F6F4EE] border border-black/[0.06] flex items-center justify-between gap-3 shadow-sm hover:border-brand-pine transition-all\">" +
            "<div class=\"min-w-0\">" +
              "<div class=\"text-xs font-bold text-brand-text truncate\">" + escapeHtml(p.title) + "</div>" +
              "<div class=\"text-[10px] text-brand-textMuted truncate\">@" + escapeHtml(p.builder ? (p.builder.username || "builder") : "builder") + "</div>" +
            "</div>" +
            "<a href=\"" + (p.liveLink || p.gitRepo || "#") + "\" target=\"_blank\" rel=\"noopener\" class=\"px-3 py-1 rounded-full bg-[#205446] text-white text-xs font-bold shadow-sm whitespace-nowrap\">Launch ↗</a>" +
          "</div>";
        }).join("") +
      "</div>" +
    "</div>";

  modalEl.classList.remove("hidden");
}

function closeSectorModal() {
  var modalEl = document.getElementById("sectorModal");
  if (modalEl) modalEl.classList.add("hidden");
}


var buildIdeas = [
  {
    title: "⚡ Rialo ZK-P2P: Confidential Over-The-Counter Swaps",
    niche: "DeFi / Zero-Knowledge",
    pitch: "An institutional OTC escrow desk on Rialo where whale traders and DAOs execute multi-million dollar RIA and USDC swaps with confidential balance proofs and 0.4s atomic settlement, preventing sandwich bots and frontrunning."
  },
  {
    title: "🤖 AgentVault: Hardware TEE Cold Storage for AI Bots",
    niche: "AI Security / Latch",
    pitch: "A decentralized vault protocol enabling autonomous trading agents to execute high-volume arbitrage orders while enforcing strict daily maximum drawdown caps through hardware-verified Latch policies."
  },
  {
    title: "📱 LatchPass: FaceID Biometric Session Authorizer",
    niche: "Mobile / Key Management",
    pitch: "A mobile Progressive Web App (PWA) that acts as the hardware 2FA key for autonomous AI agents. Developers scan a QR code to grant an AI bot a 24-hour scoped lat_ token with a $20 spending limit."
  },
  {
    title: "🏎️ AGP Oracle Matrix: Decentralized Semantic Oracle Feeds",
    niche: "Gaming / Oracles",
    pitch: "A low-latency oracle network optimized for Rialo's ~0.4s block time that generates cryptographically attested word-association puzzles for Agent Grand Prix racers."
  }
];

function generateBuildIdea() {
  var box = document.getElementById("aiIdeaBox");
  var content = document.getElementById("aiIdeaContent");
  if (!box || !content) return;

  var idea = buildIdeas[Math.floor(Math.random() * buildIdeas.length)];
  content.innerHTML = 
    "<div class=\"text-sm font-bold text-brand-pine\">" + escapeHtml(idea.title) + "</div>" +
    "<div class=\"text-[11px] text-slate-500 uppercase tracking-wider font-semibold\">Niche: " + escapeHtml(idea.niche) + "</div>" +
    "<p class=\"text-xs text-brand-text pt-1 font-sans leading-relaxed\">" + escapeHtml(idea.pitch) + "</p>" +
    "<div class=\"pt-2 flex items-center gap-3\">" +
      "<button onclick=\"generateLatchPolicy(); navigateTo('rialo');\" class=\"text-xs text-brand-pine underline font-bold\">Generate Latch Policy for this ↗</button>" +
      "<button onclick=\"generateBuildIdea()\" class=\"text-xs text-slate-500 hover:text-black\">🎲 Try Another Idea</button>" +
    "</div>";

  box.classList.remove("hidden");
  box.scrollIntoView({ behavior: "smooth", block: "nearest" });
}



var spotlightData = [
  {
    id: "spotlight-1",
    type: "agp",
    badge: "🏁 AGP TOURNAMENT",
    badgeColor: "bg-purple-100 text-purple-900 border-purple-200",
    title: "Agent Grand Prix (AGP) Racing Circuit",
    author: "@ericargent",
    desc: "The premier autonomous AI agent racing tournament on Rialo. 140 bots race under strict Latch TEE constraints to solve real-time semantic puzzles.",
    link: "https://agp.onlatch.com",
    metrics: "140 Approved Racers · 25 Priority Seats",
    featured: true
  },
  {
    id: "spotlight-2",
    type: "shark",
    badge: "🦈 SHARK TANK WINNER",
    badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-200",
    title: "Rialo Obscura (Shielded Relayer)",
    author: "@vikajoestar",
    desc: "Winner of Shark Tank Stage 1. Shielded transaction relayer bridging Base Sepolia to Rialo L1 with zero-knowledge private balance proofs.",
    link: "https://obscura-six.vercel.app",
    metrics: "103 Upvotes · Subzero Fast-Track",
    featured: true
  },
  {
    id: "spotlight-3",
    type: "shark",
    badge: "🦈 SHARK TANK WINNER",
    badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-200",
    title: "Agentflow: Gasless x402 Micropayments",
    author: "@snehal007",
    desc: "Autonomous Research -> Analyst -> Writer AI pipeline executing gasless per-step micropayments using Rialo Latch hardware tokens.",
    link: "https://agentflow-rialo.vercel.app",
    metrics: "Shark Tank Top Pick · Python SDK",
    featured: true
  },
  {
    id: "spotlight-4",
    type: "spotlight",
    badge: "🔦 COMMUNITY SPOTLIGHT",
    badgeColor: "bg-amber-100 text-amber-900 border-amber-200",
    title: "Rialoscan.org (Live Block Explorer)",
    author: "@rialoscan",
    desc: "Independent sub-second block and transaction explorer monitoring ~0.4s block finality, node telemetry, and validator latency.",
    link: "https://rialoscan.org",
    metrics: "Ecosystem Critical · 0.4s Tracking",
    featured: true
  },
  {
    id: "spotlight-5",
    type: "shark",
    badge: "🦈 SHARK TANK WINNER",
    badgeColor: "bg-emerald-100 text-emerald-900 border-emerald-200",
    title: "Rialo Predict: ML Outcome Markets",
    author: "@eliasskun",
    desc: "High-accuracy real-time prediction market using machine learning models with sub-second on-chain settlement.",
    link: "https://rialopredict.vercel.app",
    metrics: "Shark Tank Honoree · DeFi",
    featured: true
  },
  {
    id: "spotlight-6",
    type: "spotlight",
    badge: "🔦 COMMUNITY SPOTLIGHT",
    badgeColor: "bg-amber-100 text-amber-900 border-amber-200",
    title: "Rialink: Discord & GitHub Web3 Linker",
    author: "@rialink",
    desc: "Cryptographic account linker connecting Web3 addresses to verified GitHub and Discord developer profiles for Sybil defense.",
    link: "https://rialink.vercel.app",
    metrics: "Identity Bridge · 500+ Verified Linkers",
    featured: true
  }
];

function renderSpotlightCards(filterType) {
  var container = document.getElementById("spotlightCardsContainer");
  if (!container) return;

  var list = spotlightData;
  if (filterType && filterType !== "all") {
    list = spotlightData.filter(function(item) { return item.type === filterType; });
  }

  container.innerHTML = list.map(function(item) {
    return "<div class=\"hb-card p-6 flex flex-col justify-between space-y-5 bg-white border border-[#D8D2C5] rounded-2xl shadow-sm hover:border-brand-pine transition-all\">" +
      "<div>" +
        "<div class=\"flex items-center justify-between mb-3\">" +
          "<span class=\"text-[10px] font-mono px-2.5 py-1 rounded-full border uppercase font-bold tracking-wider " + item.badgeColor + "\">" + escapeHtml(item.badge) + "</span>" +
          "<span class=\"text-[11px] font-mono text-brand-textMuted font-bold\">" + escapeHtml(item.author) + "</span>" +
        "</div>" +
        "<h3 class=\"text-base font-extrabold text-brand-text mb-1.5 tracking-tight\">" + escapeHtml(item.title) + "</h3>" +
        "<p class=\"text-xs text-brand-textMuted leading-relaxed mb-4\">" + escapeHtml(item.desc) + "</p>" +
        "<div class=\"py-2 px-3 rounded-lg bg-[#F6F4EE] border border-black/[0.04] text-[11px] font-mono text-brand-pine font-bold\">" +
          "⚡ " + escapeHtml(item.metrics) +
        "</div>" +
      "</div>" +
      "<a href=\"" + item.link + "\" target=\"_blank\" rel=\"noopener\" class=\"w-full py-2.5 rounded-xl bg-[#F6F4EE] hover:bg-brand-pine text-brand-text hover:text-white text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 border border-black/[0.08] shadow-sm\">" +
        "<span>Open Project / Details</span>" +
        "<span class=\"material-symbols-outlined text-xs leading-none\">arrow_outward</span>" +
      "</a>" +
    "</div>";
  }).join("");
}

function filterSharkTankWinners() {
  navigateTo('events');
  renderSpotlightCards('shark');
  var el = document.getElementById('spotlightCardsContainer');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}


// Count distinct builders across the whole dataset.
function uniqueBuilderCount() {
  var set = {};
  allProjects.forEach(function (p) {
    var k = p.builder ? (p.builder.username || p.builder.name || "") : "";
    if (k) set[String(k).toLowerCase()] = true;
  });
  return Object.keys(set).length;
}

// Keep every displayed stat in sync with the real data — nothing hardcoded.
function refreshCounts() {
  if (typeof document === "undefined") return;
  var n = allProjects.length;
  var sp = document.getElementById("statProjects");
  if (sp) sp.textContent = n;
  document.querySelectorAll(".js-dapp-count").forEach(function (el) { el.textContent = n; });

  var builders = uniqueBuilderCount();
  var loves = allProjects.reduce(function (s, p) { return s + (p.loves || 0); }, 0);
  var sb = document.getElementById("statBuilders"); if (sb) sb.textContent = builders;
  var sl = document.getElementById("statLoves"); if (sl) sl.textContent = loves;
  var rb = document.getElementById("rosterBuilderCount"); if (rb) rb.textContent = builders + " VERIFIED BUILDERS";
}

function renderAllViews() {
  renderSpotlightCards("all");
  renderAnalyticsView();
  if (typeof document === "undefined") return;
  refreshCounts();
  renderProjectDirectory();
  renderLeaderboardView();
}

function renderProjectDirectory() {
  var container = document.getElementById("projectsGrid");
  var filtersContainer = document.getElementById("directoryCategoryFilters");
  var countEl = document.getElementById("dirCount");
  if (!container) return;

  var catSet = new Set(["all"]);
  allProjects.forEach(function(p) { (p.category || []).forEach(function(c) { catSet.add(c.toLowerCase().trim()); }); });

  if (filtersContainer) {
    filtersContainer.innerHTML = Array.from(catSet).slice(0, 10).map(function(cat) {
      var isAct = activeCategoryFilter === cat;
      var cls = isAct ? "bg-brand-pine text-white font-bold shadow-sm" : "bg-white text-brand-textMuted hover:text-black border border-black/[0.1] shadow-sm";
      return "<button onclick=\"filterDirectoryCategory('" + cat + "')\" class=\"px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all " + cls + "\">" + cat.toUpperCase() + "</button>";
    }).join("");
  }

  var displayList = filteredProjects;
  if (countEl) countEl.textContent = displayList.length;

  container.innerHTML = displayList.map(function(p) {
    var username = p.builder ? (p.builder.username || "builder") : "builder";
    var gitRepo = p.gitRepo || "";
    var liveLink = p.liveLink || p.gitRepo || "#";
    var category = (p.category || ["App"])[0];

    return "<div class=\"hb-card p-6 flex flex-col justify-between space-y-5 bg-white border border-[#D8D2C5] rounded-2xl shadow-sm hover:border-brand-pine transition-all\">" +
      "<div>" +
        "<div class=\"flex items-center justify-between mb-3\">" +
          "<span class=\"text-[10px] font-mono px-2.5 py-1 rounded-full bg-brand-pineMuted text-brand-pine border border-brand-pine/25 uppercase font-bold tracking-wider\">" + escapeHtml(category) + "</span>" +
          "<span class=\"text-xs font-mono text-pink-600 font-bold bg-pink-50 px-2.5 py-0.5 rounded-full border border-pink-100\">❤️ " + (p.loves || 1) + "</span>" +
        "</div>" +
        "<h3 class=\"text-base font-extrabold text-brand-text mb-1.5 tracking-tight\">" + escapeHtml(p.title) + "</h3>" +
        "<p class=\"text-xs text-brand-textMuted line-clamp-2 leading-relaxed mb-4\">" + escapeHtml(p.description || "Verified Rialo ecosystem application.") + "</p>" +
        "<div class=\"flex items-center justify-between pt-3.5 border-t border-black/[0.08]\">" +
          "<div class=\"flex items-center gap-2 min-w-0 cursor-pointer group\" onclick=\"openBuilderModal('" + escapeHtml(username) + "')\">" +
            "<img src=\"" + (p.builder && p.builder.image ? p.builder.image : ("https://api.dicebear.com/7.x/identicon/svg?seed=" + username)) + "\" class=\"w-6 h-6 rounded-full object-cover border border-black/10\" onerror=\"this.src='https://api.dicebear.com/7.x/identicon/svg?seed=" + username + "'\" />" +
            "<span class=\"text-xs text-brand-text font-medium truncate group-hover:text-brand-pine\">@" + escapeHtml(username) + "</span>" +
          "</div>" +
          (gitRepo ? "<a href=\"" + gitRepo + "\" target=\"_blank\" rel=\"noopener\" class=\"text-brand-textMuted hover:text-black text-xs font-mono underline\">GitHub ↗</a>" : "") +
        "</div>" +
      "</div>" +
      "<a href=\"" + liveLink + "\" target=\"_blank\" rel=\"noopener\" class=\"w-full py-2.5 rounded-xl bg-[#F6F4EE] hover:bg-brand-pine text-brand-text hover:text-white text-xs font-bold text-center transition-all flex items-center justify-center gap-1.5 border border-black/[0.08] shadow-sm\">" +
        "<span>Launch App</span>" +
        "<span class=\"material-symbols-outlined text-xs leading-none\">arrow_outward</span>" +
      "</a>" +
    "</div>";
  }).join("");
}

function filterDirectoryCategory(cat) {
  activeCategoryFilter = cat;
  applyFilters();
}

function searchDirectory(query) {
  var q = (query || "").toLowerCase().trim();
  applyFilters(q);
}

function applyFilters(searchQuery) {
  var searchInput = document.getElementById("dappSearchInput");
  var q = (typeof searchQuery === "string" ? searchQuery : (searchInput ? searchInput.value : "")).toLowerCase().trim();

  filteredProjects = allProjects.filter(function(p) {
    var matchCat = (activeCategoryFilter === "all") || (p.category || []).some(function(c) { return c.toLowerCase().trim() === activeCategoryFilter; });
    var matchSearch = !q || 
      (p.title && p.title.toLowerCase().includes(q)) || 
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.builder && ((p.builder.name && p.builder.name.toLowerCase().includes(q)) || (p.builder.username && p.builder.username.toLowerCase().includes(q)))) ||
      (p.category && p.category.some(function(c) { return c.toLowerCase().includes(q); }));
    return matchCat && matchSearch;
  });

  renderProjectDirectory();
}

function setLeaderboardCriteria(crit) {
  currentLeaderboardCriteria = crit;
  var btns = ["projects", "loves", "views"];
  btns.forEach(function(c) {
    var b = document.getElementById("lb-crit-" + c);
    if (!b) return;
    if (c === crit) {
      b.className = "lb-crit-btn px-4 py-1.5 rounded-full text-xs font-mono font-bold bg-[#111214] text-white shadow-sm transition-all";
    } else {
      b.className = "lb-crit-btn px-4 py-1.5 rounded-full text-xs font-mono font-semibold text-black/60 hover:text-black hover:bg-black/[0.04] transition-all";
    }
  });
  renderLeaderboardView();
}

function renderLeaderboardView() {
  var buildersMap = {};
  allProjects.forEach(function(p) {
    var key = p.builder ? (p.builder.username || p.builder.name || "anonymous") : "anonymous";
    if (!buildersMap[key]) {
      buildersMap[key] = {
        username: p.builder ? (p.builder.username || key) : key,
        name: p.builder ? (p.builder.name || key) : key,
        image: p.builder ? (p.builder.image || "") : "",
        about: p.builder ? (p.builder.about || "") : "",
        xLink: p.builder ? (p.builder.xLink || "") : "",
        gitRepo: p.gitRepo || "",
        projectsCount: 0,
        totalLoves: 0,
        totalViews: 0,
        projectsList: []
      };
    }
    buildersMap[key].projectsCount++;
    buildersMap[key].totalLoves += (p.loves || 1);
    buildersMap[key].totalViews += (p.views || 10);
    buildersMap[key].projectsList.push(p);
    if (!buildersMap[key].gitRepo && p.gitRepo) buildersMap[key].gitRepo = p.gitRepo;
  });

  var sortedBuilders = Object.values(buildersMap).sort(function(a, b) {
    if (currentLeaderboardCriteria === "projects") return b.projectsCount - a.projectsCount;
    if (currentLeaderboardCriteria === "loves") return b.totalLoves - a.totalLoves;
    return b.totalViews - a.totalViews;
  });

  var podiumEl = document.getElementById("podiumSection");
  if (podiumEl && sortedBuilders.length >= 3) {
    var b1 = sortedBuilders[0];
    var b2 = sortedBuilders[1];
    var b3 = sortedBuilders[2];
    podiumEl.innerHTML = 
      "<div class=\"rp-card p-6 flex flex-col items-center text-center space-y-3 shadow-sm\">" +
        "<div class=\"px-3 py-0.5 rounded-full bg-black/5 text-[#111214] font-mono text-[10px] font-bold border border-black/10\">🥈 #2 SILVER</div>" +
        "<img src=\"" + (b2.image || ("https://api.dicebear.com/7.x/identicon/svg?seed=" + b2.username)) + "\" class=\"w-16 h-16 rounded-full object-cover border-2 border-black/10\" onerror=\"this.src='https://api.dicebear.com/7.x/identicon/svg?seed=" + b2.username + "'\" />" +
        "<h3 class=\"text-sm font-bold text-[#111214]\">" + escapeHtml(b2.name) + "</h3>" +
        "<div class=\"text-xs text-black/50 font-mono\">@" + escapeHtml(b2.username) + "</div>" +
        "<div class=\"text-xs font-mono font-bold text-[#205446]\">" + b2.projectsCount + " dApps · " + b2.totalLoves + " loves</div>" +
        "<button onclick=\"openBuilderModal('" + escapeHtml(b2.username) + "')\" class=\"text-xs text-[#111214] hover:underline pt-1 font-semibold\">View Profile</button>" +
      "</div>" +
      "<div class=\"rp-card p-8 flex flex-col items-center text-center space-y-3 border-[#205446]/40 bg-gradient-to-b from-emerald-50 to-[#F7F5F0] shadow-md\">" +
        "<div class=\"px-3.5 py-0.5 rounded-full bg-[#205446] hover:bg-[#184237] text-white font-mono text-[10px] font-black\">👑 #1 CHAMPION</div>" +
        "<img src=\"" + (b1.image || ("https://api.dicebear.com/7.x/identicon/svg?seed=" + b1.username)) + "\" class=\"w-20 h-20 rounded-full object-cover border-2 border-[#205446] shadow-sm\" onerror=\"this.src='https://api.dicebear.com/7.x/identicon/svg?seed=" + b1.username + "'\" />" +
        "<h3 class=\"text-base font-black text-[#111214]\">" + escapeHtml(b1.name) + "</h3>" +
        "<div class=\"text-xs text-[#205446] font-mono font-bold\">@" + escapeHtml(b1.username) + "</div>" +
        "<div class=\"text-sm font-mono font-black text-[#205446]\">" + b1.projectsCount + " dApps · " + b1.totalLoves + " loves</div>" +
        "<button onclick=\"openBuilderModal('" + escapeHtml(b1.username) + "')\" class=\"text-xs text-[#205446] hover:underline font-bold pt-1\">View Portfolio ↗</button>" +
      "</div>" +
      "<div class=\"rp-card p-6 flex flex-col items-center text-center space-y-3 shadow-sm\">" +
        "<div class=\"px-3 py-0.5 rounded-full bg-amber-800/10 text-amber-900 font-mono text-[10px] font-bold border border-amber-800/20\">🥉 #3 BRONZE</div>" +
        "<img src=\"" + (b3.image || ("https://api.dicebear.com/7.x/identicon/svg?seed=" + b3.username)) + "\" class=\"w-16 h-16 rounded-full object-cover border-2 border-black/10\" onerror=\"this.src='https://api.dicebear.com/7.x/identicon/svg?seed=" + b3.username + "'\" />" +
        "<h3 class=\"text-sm font-bold text-[#111214]\">" + escapeHtml(b3.name) + "</h3>" +
        "<div class=\"text-xs text-black/50 font-mono\">@" + escapeHtml(b3.username) + "</div>" +
        "<div class=\"text-xs font-mono font-bold text-[#205446]\">" + b3.projectsCount + " dApps · " + b3.totalLoves + " loves</div>" +
        "<button onclick=\"openBuilderModal('" + escapeHtml(b3.username) + "')\" class=\"text-xs text-[#111214] hover:underline pt-1 font-semibold\">View Profile</button>" +
      "</div>";
  }

  var rowsEl = document.getElementById("leaderboardRows");
  if (rowsEl) {
    rowsEl.innerHTML = sortedBuilders.map(function(b, idx) {
      return "<div class=\"flex items-center justify-between p-4 hover:bg-black/[0.02] transition-all text-xs\">" +
        "<div class=\"flex items-center gap-4 min-w-0\">" +
          "<span class=\"font-mono font-bold w-6 text-center text-black/40\">#" + (idx + 1) + "</span>" +
          "<img src=\"" + (b.image || ("https://api.dicebear.com/7.x/identicon/svg?seed=" + b.username)) + "\" class=\"w-9 h-9 rounded-full object-cover border border-black/10\" onerror=\"this.src='https://api.dicebear.com/7.x/identicon/svg?seed=" + b.username + "'\" />" +
          "<div class=\"truncate\">" +
            "<div class=\"font-bold text-[#111214] truncate cursor-pointer hover:text-[#205446]\" onclick=\"openBuilderModal('" + escapeHtml(b.username) + "')\">" + escapeHtml(b.name) + "</div>" +
            "<div class=\"text-[11px] text-black/50 font-mono\">@" + escapeHtml(b.username) + "</div>" +
          "</div>" +
        "</div>" +
        "<div class=\"flex items-center gap-5 text-right font-mono\">" +
          "<div>" +
            "<div class=\"text-xs font-bold text-[#111214]\">" + b.projectsCount + " <span class=\"text-slate-400 font-normal\">dApps</span></div>" +
            "<div class=\"text-[10px] text-pink-600 font-bold\">❤️ " + b.totalLoves + " loves</div>" +
          "</div>" +
          "<button onclick=\"openBuilderModal('" + escapeHtml(b.username) + "')\" class=\"px-3.5 py-1.5 rounded-full bg-white hover:bg-black/[0.04] text-[#111214] border border-black/[0.08] text-xs font-semibold shadow-sm\">Profile</button>" +
        "</div>" +
      "</div>";
    }).join("");
  }
}

function openBuilderModal(username) {
  if (!username) return;
  var builderProjects = allProjects.filter(function(p) { return p.builder && (p.builder.username === username || p.builder.name === username); });
  if (builderProjects.length === 0) return;
  var first = builderProjects[0];
  var builder = first.builder || {};
  var totalLoves = builderProjects.reduce(function(sum, p) { return sum + (p.loves || 1); }, 0);
  var modalEl = document.getElementById("builderModal");
  var contentEl = document.getElementById("builderModalContent");
  if (!modalEl || !contentEl) return;
  contentEl.innerHTML = 
    "<div class=\"flex items-start gap-4 pb-4 border-b border-black/[0.08]\">" +
      "<img src=\"" + (builder.image || ("https://api.dicebear.com/7.x/identicon/svg?seed=" + username)) + "\" class=\"w-14 h-14 rounded-2xl object-cover border border-black/10 shadow-sm\" onerror=\"this.src='https://api.dicebear.com/7.x/identicon/svg?seed=" + username + "'\" />" +
      "<div class=\"flex-1 min-w-0\">" +
        "<h2 class=\"text-lg font-black text-[#111214]\">" + escapeHtml(builder.name || username) + "</h2>" +
        "<div class=\"text-xs font-mono text-[#205446] font-bold\">@" + escapeHtml(builder.username || username) + "</div>" +
        (builder.about ? "<p class=\"text-xs text-black/50 mt-2 p-3 rounded-xl bg-white border border-black/[0.06]\">" + escapeHtml(builder.about) + "</p>" : "") +
      "</div>" +
    "</div>" +
    "<div class=\"grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-white border border-black/[0.06] text-center font-mono text-xs shadow-sm\">" +
      "<div><div class=\"text-black/40 text-[10px]\">SHIPPED</div><div class=\"text-sm font-black text-[#111214]\">" + builderProjects.length + " dApps</div></div>" +
      "<div><div class=\"text-black/40 text-[10px]\">TOTAL LOVES</div><div class=\"text-sm font-black text-pink-600\">" + totalLoves + "</div></div>" +
    "</div>" +
    "<div class=\"space-y-2\">" +
      "<div class=\"text-xs font-bold text-[#111214] uppercase tracking-wider\">Shipped Projects:</div>" +
      "<div class=\"space-y-2 max-h-52 overflow-y-auto pr-1\">" +
        builderProjects.map(function(p) {
          return "<div class=\"p-3.5 rounded-xl bg-white border border-black/[0.06] flex items-center justify-between gap-3 shadow-sm\">" +
            "<div class=\"text-xs font-bold text-[#111214] truncate\">" + escapeHtml(p.title) + "</div>" +
            "<a href=\"" + (p.liveLink || "#") + "\" target=\"_blank\" rel=\"noopener\" class=\"px-3.5 py-1.5 rounded-full bg-[#205446] hover:bg-[#184237] text-white text-xs font-bold shadow-sm flex items-center gap-1 transition-all\"><span>Open App</span> <span class=\"text-[11px]\">↗</span></a>" +
          "</div>";
        }).join("") +
      "</div>" +
    "</div>";
  modalEl.classList.remove("hidden");
}

function closeBuilderModal() {
  var modalEl = document.getElementById("builderModal");
  if (modalEl) modalEl.classList.add("hidden");
}

// ══════════════════════════════════════════════════════
// DYNAMIC GOOGLE GEMINI MODEL DISCOVERY & AUTO-HEALING ENGINE
// ══════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════
// POLISHED VERSE AI WITH STREAMING & COPY CONTROLS
// ══════════════════════════════════════════════════════

var GEMINI_STORAGE_KEY = "rialoverse_gemini_api_key";
var GEMINI_MODEL_KEY = "rialoverse_gemini_active_model";
var GEMINI_MODELS_LIST_KEY = "rialoverse_gemini_available_models";
var GEMINI_LAST_SYNC_KEY = "rialoverse_gemini_last_sync";
var CHAT_HISTORY_STORAGE_KEY = "rialoverse_chat_history";
var aiConversationHistory = [];

function getStoredGeminiKey() {
  try {
    return localStorage.getItem(GEMINI_STORAGE_KEY) || "";
  } catch(e) {
    return "";
  }
}

function getStoredGeminiModel() {
  try {
    var m = localStorage.getItem(GEMINI_MODEL_KEY) || "gemini-2.0-flash";
    return m.replace(/^models\//, "");
  } catch(e) {
    return "gemini-2.0-flash";
  }
}

function getStoredModelsList() {
  try {
    var raw = localStorage.getItem(GEMINI_MODELS_LIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch(e) {
    return [];
  }
}

async function discoverAndSelectBestModel(rawKey) {
  if (!rawKey) return { success: false, error: "No API key provided" };

  try {
    var response = await fetch("https://generativelanguage.googleapis.com/v1beta/models?key=" + encodeURIComponent(rawKey), {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    var data = await response.json();

    if (response.ok && data.models && data.models.length > 0) {
      var supported = data.models.filter(function(m) {
        return m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent");
      });

      if (supported.length === 0) {
        return { success: false, error: "No models found supporting text generation for this key." };
      }

      var modelNames = supported.map(function(m) {
        return m.name.replace(/^models\//, "");
      });

      var preferenceOrder = [
        "gemini-2.0-flash",
        "gemini-2.5-flash",
        "gemini-2.0-flash-001",
        "gemini-2.0-flash-lite",
        "gemini-flash-latest",
        "gemini-2.5-pro",
        "gemini-2.0-pro"
      ];

      var selectedModel = "";
      for (var i = 0; i < preferenceOrder.length; i++) {
        if (modelNames.includes(preferenceOrder[i])) {
          selectedModel = preferenceOrder[i];
          break;
        }
      }

      if (!selectedModel && modelNames.length > 0) {
        selectedModel = modelNames[0];
      }

      localStorage.setItem(GEMINI_STORAGE_KEY, rawKey);
      localStorage.setItem(GEMINI_MODEL_KEY, selectedModel);
      localStorage.setItem(GEMINI_MODELS_LIST_KEY, JSON.stringify(modelNames));
      localStorage.setItem(GEMINI_LAST_SYNC_KEY, new Date().toISOString());

      return {
        success: true,
        model: selectedModel,
        availableCount: modelNames.length,
        models: modelNames
      };
    } else {
      var errMsg = (data.error && data.error.message) ? data.error.message : "API key verification failed.";
      return { success: false, error: errMsg };
    }
  } catch (err) {
    return { success: false, error: "Network error while connecting to Google AI API: " + err.message };
  }
}

async function refreshGeminiModels() {
  var key = getStoredGeminiKey();
  if (!key) {
    showVerseToast("No active API key to refresh. Connect a key first.", "warning");
    return;
  }

  var btn = document.getElementById("refreshModelBtn");
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = "<span class=\"animate-spin text-xs\">⏳</span><span>Scanning Google Models...</span>";
  }

  var result = await discoverAndSelectBestModel(key);

  if (btn) {
    btn.disabled = false;
    btn.innerHTML = "<span>🔄 Refresh</span>";
  }

  if (result.success) {
    renderAiKeyControls();
    showVerseToast("⚡ Models Refreshed: Using " + result.model + " (" + result.availableCount + " available)", "success", 4000);
  } else {
    showVerseToast("⚠️ Model Refresh: " + result.error, "warning", 4000);
  }
}

function renderAiKeyControls() {
  var key = getStoredGeminiKey();
  var container = document.getElementById("aiKeyStatusContainer");
  var banner = document.getElementById("geminiSetupBanner");
  var modeBadge = document.getElementById("aiModeBadge");

  if (!container) return;

  if (key) {
    if (banner) banner.classList.add("hidden");
    var activeModel = getStoredGeminiModel();

    if (modeBadge) {
      modeBadge.className = "px-3 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-300 flex items-center gap-1.5";
      modeBadge.innerHTML = "<span class=\"w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse\"></span><span>LIVE AI THINKING MODE ACTIVE</span>";
    }

    container.innerHTML = 
      "<div class=\"flex flex-wrap items-center gap-2\">" +
        "<span class=\"text-xs font-mono text-emerald-900 font-bold bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-300 flex items-center gap-1.5 shadow-sm\" title=\"Active Verified Model\">" +
          "<span>⚡</span><span>Model: <strong>" + escapeHtml(activeModel) + "</strong></span>" +
        "</span>" +
        "<button id=\"refreshModelBtn\" onclick=\"refreshGeminiModels()\" class=\"px-2.5 py-1 rounded-xl bg-white hover:bg-black/5 text-brand-text text-xs font-mono font-bold border border-black/10 transition-all active:scale-95 shadow-sm flex items-center gap-1\" title=\"Scan and select latest available Google models\">" +
          "<span>🔄 Refresh</span>" +
        "</button>" +
        "<button onclick=\"changeGeminiKeyPrompt()\" class=\"px-2.5 py-1 rounded-xl bg-white hover:bg-black/5 text-brand-text text-xs font-mono font-bold border border-black/10 transition-all active:scale-95 shadow-sm flex items-center gap-1\" title=\"Change API Key\">" +
          "<span>⚙️ Change</span>" +
        "</button>" +
        "<button onclick=\"removeGeminiKey()\" class=\"px-2.5 py-1 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-mono font-bold border border-red-200 transition-all active:scale-95 shadow-sm flex items-center gap-1\" title=\"Disconnect API Key\">" +
          "<span>🗑️ Disconnect</span>" +
        "</button>" +
      "</div>";
  } else {
    if (banner) banner.classList.remove("hidden");
    if (modeBadge) {
      modeBadge.className = "px-3 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#F6F4EE] text-slate-700 border border-black/10";
      modeBadge.textContent = "⚡ BUILT-IN KNOWLEDGE ENGINE";
    }
    container.innerHTML = "";
  }
}

async function saveAndVerifyGeminiKey() {
  var input = document.getElementById("geminiApiKeyInput");
  var status = document.getElementById("keyVerificationStatus");
  var btn = document.getElementById("connectKeyBtn");
  var rawKey = input ? input.value.trim() : "";

  if (!rawKey) {
    if (status) {
      status.className = "text-xs font-mono font-bold text-red-600 block";
      status.textContent = "⚠️ Please paste your Gemini API key from Google AI Studio.";
    }
    return;
  }

  if (btn) {
    btn.disabled = true;
    btn.innerHTML = "<span class=\"animate-spin text-xs\">⏳</span><span>Discovering Google Models...</span>";
  }
  if (status) {
    status.className = "text-xs font-mono font-bold text-slate-600 block";
    status.textContent = "Querying Google AI Studio to find available models for your key...";
  }

  var result = await discoverAndSelectBestModel(rawKey);

  if (btn) {
    btn.disabled = false;
    btn.innerHTML = "<span>Verify & Connect</span><span class=\"material-symbols-outlined text-xs\">verified</span>";
  }

  if (result.success) {
    if (input) input.value = "";
    if (status) {
      status.className = "text-xs font-mono font-bold text-emerald-600 block";
      status.textContent = "✅ Connected! Found " + result.availableCount + " available models. Optimal model set: " + result.model;
    }
    renderAiKeyControls();
    setTimeout(function() {
      if (status) status.className = "hidden";
    }, 4000);
  } else {
    if (status) {
      status.className = "text-xs font-mono font-bold text-red-600 block";
      status.textContent = "❌ Verification Failed: " + result.error;
    }
  }
}

function changeGeminiKeyPrompt() {
  var newKey = prompt("Enter your new Google Gemini API key (or leave empty to cancel):", getStoredGeminiKey());
  if (newKey !== null && newKey.trim() !== "") {
    var input = document.getElementById("geminiApiKeyInput");
    if (input) input.value = newKey.trim();
    saveAndVerifyGeminiKey();
  }
}

function removeGeminiKey() {
  showVerseConfirm({
    title: "Disconnect Gemini API Key",
    message: "Are you sure you want to remove your API key from this browser? Verse AI will smoothly revert to the built-in offline knowledge engine.",
    icon: "🔑",
    confirmText: "Disconnect Key",
    isDanger: true,
    onConfirm: function() {
      try {
        localStorage.removeItem(GEMINI_STORAGE_KEY);
        localStorage.removeItem(GEMINI_MODEL_KEY);
        localStorage.removeItem(GEMINI_MODELS_LIST_KEY);
        localStorage.removeItem(GEMINI_LAST_SYNC_KEY);
      } catch(e){}
      renderAiKeyControls();
      showVerseToast("API Key disconnected. Switched to Offline Built-in Mode.", "info");
    }
  });
}

function getStoredChatHistory() {
  try {
    var raw = localStorage.getItem(CHAT_HISTORY_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch(e) {
    return [];
  }
}

function saveChatMessageToStorage(role, text) {
  try {
    var history = getStoredChatHistory();
    history.push({
      role: role,
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    if (history.length > 40) history = history.slice(history.length - 40);
    localStorage.setItem(CHAT_HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch(e) {}
}

function clearChatHistory() {
  showVerseConfirm({
    title: "Clear Chat Conversation",
    message: "Are you sure you want to clear the entire chat history? This will wipe the active conversation thread.",
    icon: "🗑️",
    confirmText: "Clear History",
    isDanger: true,
    onConfirm: function() {
      try {
        localStorage.removeItem(CHAT_HISTORY_STORAGE_KEY);
      } catch(e) {}
      aiConversationHistory = [];
      var thread = document.getElementById("chatThread");
      if (thread) {
        thread.innerHTML = 
          '<div class="p-5 rounded-2xl bg-white border border-black/[0.08] shadow-sm space-y-2.5">' +
            '<div class="flex items-center gap-2 text-xs font-mono font-bold text-brand-pine">' +
              '<span class="w-2.5 h-2.5 rounded-full bg-brand-pine"></span>' +
              '<span>VERSE AI (COMMUNITY SENTINEL)</span>' +
            '</div>' +
            '<p class="text-sm text-brand-textMuted leading-relaxed">' +
              'Chat history cleared. You can ask me anything about Rialo, Latch security policies, AGP racing strategies, or SDK code!' +
            '</p>' +
          '</div>';
      }
      showVerseToast("Chat history cleared cleanly!", "success");
    }
  });
}

function loadSavedChatHistory() {
  var thread = document.getElementById("chatThread");
  if (!thread) return;

  var history = getStoredChatHistory();
  if (history && history.length > 0) {
    thread.innerHTML = "";
    history.forEach(function(msg) {
      appendChatMessage(msg.role, msg.text, false, false);
    });
  }
}

// ══════════════════════════════════════════════════════
// ADVANCED MARKDOWN PARSER WITH COPY & CLEAN STYLING
// ══════════════════════════════════════════════════════

function formatMarkdownChat(text) {
  if (!text) return "";
  var str = text;

  // Clean out any accidental raw chain-of-thought headers or internal step prompts
  str = str.replace(/^\s*\*\s*\*\s*(Step\s*\d+|Constraint Check|Self-Correction)[^\*]*\*\s*\*?\s*/gim, "");
  str = str.replace(/\*\s*\*\s*(Step\s*\d+|Constraint Check|Self-Correction)[^\*]*\*\s*\*?/gim, "");

  // 1. Multi-line Code Blocks (```lang ... ```)
  str = str.replace(/\`\`\`(python|javascript|js|json|bash|sh|html|css|solidity|rust)?\n([\s\S]*?)\`\`\`/g, function(match, lang, code) {
    var languageLabel = lang ? lang.toUpperCase() : "CODE";
    var cleanCode = code.trim();
    return '<div class="my-3 rounded-xl overflow-hidden bg-[#111618] border border-black/20 text-slate-100 font-mono text-xs shadow-inner select-text">' +
      '<div class="flex items-center justify-between px-3.5 py-2 bg-[#1B2327] border-b border-white/10 text-[11px] text-slate-400 font-bold">' +
        '<span>' + languageLabel + '</span>' +
        '<button onclick="copyCodeBlock(this)" class="px-2 py-0.5 rounded bg-white/10 hover:bg-white/20 text-white transition-all flex items-center gap-1 font-sans text-xs"><span>📋</span><span>Copy Code</span></button>' +
      '</div>' +
      '<pre class="p-4 overflow-x-auto leading-relaxed select-text font-mono text-xs selection:bg-emerald-500 selection:text-black"><code>' + escapeHtml(cleanCode) + '</code></pre>' +
    '</div>';
  });

  // 2. Headers (###, ##, #)
  str = str.replace(/^### (.*$)/gim, '<h4 class="text-base font-extrabold text-brand-pine mt-3 mb-1">$1</h4>');
  str = str.replace(/^## (.*$)/gim, '<h3 class="text-lg font-extrabold text-brand-text mt-3.5 mb-1.5">$1</h3>');
  str = str.replace(/^# (.*$)/gim, '<h2 class="text-xl font-extrabold text-brand-text mt-4 mb-2">$1</h2>');

  // 3. Inline Code (`...`)
  str = str.replace(/\`([^\`]+)\`/g, '<code class="px-1.5 py-0.5 rounded bg-black/[0.06] text-brand-pine font-mono text-xs font-bold select-text">$1</code>');

  // 4. Bold (**...**)
  str = str.replace(/\*\*([^\*]+)\*\*/g, '<strong class="font-bold text-brand-text">$1</strong>');

  // 5. Italic (*...*)
  str = str.replace(/(^|[^\*])\*([^\*]+)\*([^\*]|$)/g, '$1<em class="italic text-brand-textMuted">$2</em>$3');

  // 6. Markdown Links ([Text](URL))
  str = str.replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" class="text-brand-pine font-bold underline hover:text-brand-pineHover inline-flex items-center gap-0.5">$1 ↗</a>');

  // 7. Bullet Lists (•, *, -)
  str = str.replace(/^[•\*\-]\s+(.*$)/gim, '<li class="ml-5 list-disc text-sm text-brand-text my-1 leading-relaxed">$1</li>');
  
  // 8. Numbered Lists (1., 2.)
  str = str.replace(/^(\d+)\.\s+(.*$)/gim, '<li class="ml-5 list-decimal text-sm text-brand-text my-1 leading-relaxed"><strong class="text-brand-text">$1.</strong> $2</li>');

  // 9. Clean paragraph breaks
  str = str.replace(/\n\n+/g, '<div class="h-2.5"></div>');
  str = str.replace(/\n/g, '<br/>');

  return str;
}

function copyCodeBlock(btn) {
  var codeEl = btn.closest('.rounded-xl').querySelector('code');
  if (codeEl) {
    navigator.clipboard.writeText(codeEl.innerText).then(function() {
      btn.innerHTML = '<span>✅</span><span>Copied!</span>';
      setTimeout(function() { btn.innerHTML = '<span>📋</span><span>Copy Code</span>'; }, 2000);
    });
  }
}

function copyAssistantMessage(btn) {
  var bubble = btn.closest('.chat-assistant-bubble');
  if (bubble) {
    var rawText = bubble.getAttribute('data-raw-text') || bubble.innerText;
    navigator.clipboard.writeText(rawText).then(function() {
      btn.innerHTML = '<span>✅ Copied!</span>';
      setTimeout(function() { btn.innerHTML = '<span>📋 Copy</span>'; }, 2000);
    });
  }
}

// ══════════════════════════════════════════════════════
// ULTRA-SMOOTH BLOCK & TOKEN STREAMING ENGINE
// ══════════════════════════════════════════════════════
function typewriteResponse(targetElement, fullHtml, fullRawText, onComplete) {
  var thread = document.getElementById("chatThread");
  targetElement.innerHTML = "";

  // Temporary container to parse semantic HTML blocks
  var temp = document.createElement("div");
  temp.innerHTML = fullHtml;
  var nodes = Array.from(temp.childNodes);

  if (nodes.length === 0) {
    targetElement.innerHTML = fullHtml;
    if (onComplete) onComplete();
    return;
  }

  var blockIndex = 0;

  function streamNextBlock() {
    if (blockIndex >= nodes.length) {
      // Finished all blocks: ensure final HTML is clean and formatted
      targetElement.innerHTML = fullHtml;
      if (thread) {
        thread.scrollTo({ top: thread.scrollHeight, behavior: "smooth" });
      }
      if (onComplete) onComplete();
      return;
    }

    var node = nodes[blockIndex];
    blockIndex++;

    // For Code Blocks, Headers, Callout Boxes or Tables -> Cascade block smoothly
    if (node.nodeType === Node.ELEMENT_NODE && (
        node.tagName === "PRE" || 
        node.tagName === "TABLE" || 
        node.tagName === "H3" || 
        node.tagName === "H4" ||
        node.classList.contains("bg-") ||
        node.querySelector("pre")
    )) {
      var blockWrapper = document.createElement("div");
      blockWrapper.className = "ai-block-stream my-1.5";
      blockWrapper.appendChild(node.cloneNode(true));
      targetElement.appendChild(blockWrapper);

      if (thread) {
        thread.scrollTo({ top: thread.scrollHeight, behavior: "smooth" });
      }
      setTimeout(streamNextBlock, 60);
      return;
    }

    // For text paragraphs and list items -> Smooth fluid token streaming
    var blockWrapper = document.createElement("div");
    blockWrapper.className = "ai-block-stream my-1";
    targetElement.appendChild(blockWrapper);

    var rawInnerHtml = node.nodeType === Node.ELEMENT_NODE ? node.innerHTML : node.textContent;
    var tokens = rawInnerHtml.split(/(\s+)/); // Keep spaces intact for natural rendering
    var tokenIdx = 0;

    var cursor = document.createElement("span");
    cursor.className = "typing-cursor";
    blockWrapper.appendChild(cursor);

    function streamTokens() {
      if (tokenIdx < tokens.length) {
        // Stream 2 tokens at a time for buttery smooth 60fps cadence
        var chunk = (tokens[tokenIdx] || "") + (tokens[tokenIdx + 1] || "");
        tokenIdx += 2;

        var textSpan = document.createElement("span");
        textSpan.innerHTML = chunk;
        blockWrapper.insertBefore(textSpan, cursor);

        if (thread && tokenIdx % 6 === 0) {
          thread.scrollTop = thread.scrollHeight;
        }

        requestAnimationFrame(function() {
          setTimeout(streamTokens, 16);
        });
      } else {
        if (cursor && cursor.parentNode) cursor.remove();
        if (thread) thread.scrollTop = thread.scrollHeight;
        setTimeout(streamNextBlock, 40);
      }
    }

    streamTokens();
  }

  streamNextBlock();
}

function appendChatMessage(role, text, saveToStorage, animate) {
  if (saveToStorage === undefined) saveToStorage = true;
  if (animate === undefined) animate = false;
  var thread = document.getElementById("chatThread");
  if (!thread) return null;

  var msgDiv = document.createElement("div");

  if (role === "user") {
    msgDiv.className = "flex justify-end select-text";
    msgDiv.innerHTML = 
      '<div class="max-w-[85%] p-4 rounded-2xl rounded-tr-sm bg-brand-pine text-white text-sm leading-relaxed shadow-sm select-text">' +
        '<div class="font-bold text-[11px] font-mono text-emerald-200 mb-1">YOU</div>' +
        '<div class="select-text break-words">' + escapeHtml(text) + '</div>' +
      '</div>';
    if (saveToStorage) saveChatMessageToStorage("user", text);
  } else if (role === "loading") {
    msgDiv.className = "flex justify-start select-none";
    msgDiv.innerHTML = 
      '<div class="p-4 rounded-2xl rounded-tl-sm bg-white border border-black/[0.08] text-sm text-brand-textMuted flex items-center gap-2.5 shadow-sm">' +
        '<span class="animate-spin text-base">⚙️</span>' +
        '<span class="font-mono text-xs text-brand-pine font-bold">' + escapeHtml(text) + '</span>' +
      '</div>';
  } else {
    var formattedHtml = formatMarkdownChat(text);
    var currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    msgDiv.className = "flex justify-start select-text";
    msgDiv.innerHTML = 
      '<div class="chat-assistant-bubble max-w-[92%] p-5 rounded-2xl rounded-tl-sm bg-white border border-black/[0.08] text-sm text-brand-text leading-relaxed shadow-sm space-y-2 select-text" data-raw-text="' + escapeHtml(text) + '">' +
        '<div class="flex items-center justify-between border-b border-black/[0.06] pb-2 select-none">' +
          '<div class="flex items-center gap-2 text-xs font-mono font-bold text-brand-pine">' +
            '<span class="w-2.5 h-2.5 rounded-full bg-brand-pine animate-pulse"></span>' +
            '<span>VERSE AI</span>' +
          '</div>' +
          '<div class="flex items-center gap-2.5">' +
            '<button onclick="copyAssistantMessage(this)" class="px-2 py-0.5 rounded-lg bg-black/[0.04] hover:bg-black/[0.08] text-[11px] font-mono font-bold text-slate-600 transition-all flex items-center gap-1 shadow-2xs" title="Copy full response">' +
              '<span>📋 Copy</span>' +
            '</button>' +
            '<span class="text-[11px] font-mono text-black/40">' + currentTime + '</span>' +
          '</div>' +
        '</div>' +
        '<div class="chat-body-content text-sm text-brand-text leading-relaxed pt-1 select-text break-words"></div>' +
      '</div>';

    var bodyContainer = msgDiv.querySelector('.chat-body-content');
    if (animate) {
      typewriteResponse(bodyContainer, formattedHtml, text);
    } else {
      bodyContainer.innerHTML = formattedHtml;
    }

    if (saveToStorage) saveChatMessageToStorage("assistant", text);
  }

  thread.appendChild(msgDiv);
  thread.scrollTop = thread.scrollHeight;
  return msgDiv;
}

function askPreset(promptText) {
  navigateTo("ai");
  var input = document.getElementById("chatInput");
  if (input) input.value = promptText;
  submitChatMessage();
}

async function submitChatMessage() {
  var input = document.getElementById("chatInput");
  var message = input ? input.value.trim() : "";
  if (!message) return;

  appendChatMessage("user", message, true, false);
  if (input) input.value = "";

  var key = getStoredGeminiKey();
  var sendBtn = document.getElementById("chatSendBtn");
  if (sendBtn) sendBtn.disabled = true;

  if (key) {
    var loadingMsg = appendChatMessage("loading", "Verse AI is generating response...", false, false);
    try {
      var activeModel = getStoredGeminiModel() || "gemini-2.0-flash";
      cleanModel = activeModel.replace(/^models\//, "").trim();

      var systemPrompt = 
        "You are Verse AI, the independent community AI assistant, ecosystem guide, and historical archive keeper for RialoVerse (rialoverse.com) — a community intelligence hub for Rialo Layer-1 Network (rialo.network) and Latch Protocol (onlatch.com / Subzero Labs).\n\n" +
        "ECOSYSTEM SECTORS & DAPP RECOMMENDATION DATABASE (Community Ecosystem Directory):\n" +
        "• Gaming, Racing & Betting:\n" +
        "  - Agent Grand Prix (AGP): Word-circuit AI agent racing with live parimutuel RP betting (agp.onlatch.com).\n" +
        "  - CyberRialo Combat Arena: Tactical PvP combat with 0.4s instant settlement (Shark Tank #1 Winner).\n" +
        "  - Rialo Pixel Quest & Rialo Roulette: On-chain gaming and probability games.\n" +
        "• DeFi, DEX & Yield:\n" +
        "  - OLPA DEX: Event-native decentralized derivatives exchange & AMM (olpadex.vercel.app).\n" +
        "  - Rialo Agent Vault / YieldSentinel: Automated yield optimization and LP rebalancing using Latch agents.\n" +
        "• AI Agents, Operating Systems & Tooling:\n" +
        "  - RialOS: The agent desktop operating system for automated payroll and credit (rialos.vercel.app, Shark Tank #3 Winner by Just Jena).\n" +
        "  - Latch Sentinel & Policy Sandbox: TEE hardware policy builder for spend limits and scoped session tokens.\n" +
        "  - RialoVerse: The central ecosystem super-hub created by @NathBabu.\n" +
        "• Social, Profiles & Identity:\n" +
        "  - Official Profile Linking & Retroactive Points Portal: playground.rialo.io.\n" +
        "• Top Builders by Shipped Apps: Yusoof4all (4 dApps), AMR70234 (4 dApps), Elias (3 dApps), Kingxfn (3 dApps), Iblamehsan (3 dApps).\n" +
        "• @NathBabu: Creator of RialoVerse & Quiz Round 27 Top 10 Finisher.\n" +
        "• Shark Tank Archive: Edition #3 Just Jena (RialOS), Edition #2 Elias (Rialo Agent Vault), Edition #1 Vika Joestar (CyberRialo).\n" +
        "• Rialo Tech: ~0.4s instant finality, Latch TEE hardware security, native ZK math, Chain ID 9001, RP token.\n\n" +
        "GUIDELINES:\n" +
        "- When asked if there is a specific type of dApp (e.g. 'Is there a racing game?', 'Is there a DEX?', 'Is there a betting app?', 'Is there a prediction market?'), identify the matching category and recommend the exact dApp name, what it does, who built it, and how to access it.\n" +
        "- If asked about gap areas (e.g. what is missing in Rialo), encourage builders to deploy in under-served categories.\n" +
        "- Output clean, direct markdown with zero prompt repetition or thought scratchpads.";

      var url = "https://generativelanguage.googleapis.com/v1beta/models/" + cleanModel + ":generateContent?key=" + encodeURIComponent(key);

      var response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemPrompt }]
          },
          contents: [
            {
              role: "user",
              parts: [{ text: message }]
            }
          ],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 600
          }
        })
      });

      var data = await response.json();
      var replyText = "";
      var success = false;

      if (response.ok && data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0].text) {
        replyText = data.candidates[0].content.parts[0].text;
        success = true;
      } else if (data.error) {
        console.warn("Primary model error:", data.error.message);
        // Quick 1-step fallback to a current model if the selected one was invalid
        if (cleanModel !== "gemini-2.0-flash") {
          var fallbackUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + encodeURIComponent(key);
          var fbRes = await fetch(fallbackUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: systemPrompt }] },
              contents: [{ role: "user", parts: [{ text: message }] }],
              generationConfig: { temperature: 0.4, maxOutputTokens: 600 }
            })
          });
          var fbData = await fbRes.json();
          if (fbRes.ok && fbData.candidates && fbData.candidates[0].content.parts[0].text) {
            replyText = fbData.candidates[0].content.parts[0].text;
            localStorage.setItem(GEMINI_MODEL_KEY, "gemini-2.0-flash");
            renderAiKeyControls();
            success = true;
          }
        }
      }

      if (loadingMsg && loadingMsg.remove) loadingMsg.remove();

      if (success && replyText) {
        appendChatMessage("assistant", replyText, true, true);
      } else {
        var fallbackReply = generateAutonomousLatchAnswer(message);
        appendChatMessage("assistant", fallbackReply, true, true);
      }
    } catch (err) {
      if (loadingMsg && loadingMsg.remove) loadingMsg.remove();
      var fallbackReply = generateAutonomousLatchAnswer(message);
      appendChatMessage("assistant", fallbackReply, true, true);
    } finally {
      if (sendBtn) sendBtn.disabled = false;
    }
  } else {
    var loadingMsg = appendChatMessage("loading", "Verse AI is searching built-in knowledge...", false, false);
    setTimeout(function() {
      if (loadingMsg && loadingMsg.remove) loadingMsg.remove();
      var reply = generateAutonomousLatchAnswer(message);
      appendChatMessage("assistant", reply, true, true);
      if (sendBtn) sendBtn.disabled = false;
    }, 200);
  }
}

function generateAutonomousLatchAnswer(query) {
  var q = (query || "").toLowerCase().trim();

  // 1. EXACT TARGET: Prevent Wallet Drains / Latch Security
  if (q.includes("wallet drain") || q.includes("drain") || q.includes("hardware tee") || q.includes("spending cap") || q.includes("latch token") || q.includes("policy") || q.includes("security") || q.includes("lat_")) {
    return "🛡️ **Verse AI Guide: How Latch Prevents Wallet Drains**\n\n" +
      "Autonomous AI agents operating directly on-chain face a critical risk: prompt injections or malicious contract calls can drain an unconstrained private key.\n\n" +
      "**Latch Hardware Solution:**\n" +
      "1. **Scoped Session Tokens (`lat_...`):** Agents never hold raw private keys. Instead, they receive scoped tokens generated in secure TEE (Trusted Execution Environment) hardware enclaves.\n" +
      "2. **Strict Spending Limits:** Developers set hard per-transaction caps (e.g. 5 RP) and 24-hour daily limits (e.g. 50 RP).\n" +
      "3. **Contract Whitelisting:** Agents can only call verified, authorized smart contract addresses.\n" +
      "4. **Sub-second Revocation:** If an agent acts unexpectedly, its token is instantly revoked on-chain with ~0.4s finality.\n\n" +
      "👉 Visit the [Rialo & Latch Tab](#rialo) to configure an interactive security policy!";
  }

  // 2. EXACT TARGET: AGP Race Strategy
  if (q.includes("agp") || q.includes("grand prix") || q.includes("race") || q.includes("racing") || q.includes("word circuit") || q.includes("circuit") || q.includes("betting")) {
    return "🏎️ **Verse AI Guide: Agent Grand Prix (AGP) Strategy & Rules**\n\n" +
      "Agent Grand Prix ([agp.onlatch.com](https://agp.onlatch.com)) is Rialo's premier autonomous racing benchmark where AI agents navigate real-time word circuits:\n\n" +
      "**Winning Strategies:**\n" +
      "• **Low Latency RPC Calls:** Leverage Rialo's ~0.4s finality to query oracle clues and submit route words before opponents.\n" +
      "• **Subzero Oracle Prompts:** Parse linguistic hints broadcasted by the oracle to predict the next circuit checkpoint.\n" +
      "• **Parimutuel RP Betting:** Spectators stake Rialo Points (RP) on agent racers with dynamic on-chain odds.\n" +
      "• **Telemetry Safeguards:** Use Latch policy tokens to prevent agent racers from exceeding gas allowances during high-speed laps.";
  }

  // 3. EXACT TARGET: RPC & 20 RP Faucet
  if (q.includes("faucet") || q.includes("20 rp") || q.includes("rpc") || q.includes("metamask") || q.includes("chain id") || q.includes("testnet") || q.includes("connect wallet") || q.includes("claim rp")) {
    return "🧪 **Verse AI Guide: Rialo Testnet RPC & 20 RP Faucet Guide**\n\n" +
      "**Network Parameters:**\n" +
      "• **Network Name:** Rialo Testnet\n" +
      "• **RPC URL:** `https://testnet.rialo.io`\n" +
      "• **Chain ID:** `9001` (Hex: `0x2329`)\n" +
      "• **Currency Symbol:** `RP` (or `RIA`)\n" +
      "• **Block Explorer:** [explorer.testnet.rialo.io](https://explorer.testnet.rialo.io)\n\n" +
      "**How to Claim 20 RP:**\n" +
      "1. Join the official Rialo Discord: [discord.gg/BuwYqeZ357](https://discord.gg/BuwYqeZ357)\n" +
      "2. Head over to the **#faucet** channel.\n" +
      "3. Type: \`/faucet <your-0x-wallet-address>\`\n" +
      "4. You will receive 20 RP directly into your wallet with sub-second (~0.4s) finality!";
  }

  // 4. EXACT TARGET: Retroactive Points & Profile Linking (playground.rialo.io)
  if (q.includes("profile") || q.includes("link") || q.includes("retroactive") || q.includes("playground.rialo.io") || q.includes("connect discord") || q.includes("connect github") || q.includes("lock")) {
    return "🎁 **Verse AI Guide: Retroactive Rialo Points & Profile Linking**\n\n" +
      "Rialo has officially distributed retroactive Rialo Points for all past building, testing, and ecosystem contributions!\n\n" +
      "**How to Link Your Profile & Claim Points:**\n" +
      "1. Go to [playground.rialo.io](https://playground.rialo.io) and sign in with Google.\n" +
      "2. Connect your **Discord** and/or **GitHub** accounts.\n" +
      "3. Double check that you connected the right handles (disconnect and reconnect if wrong).\n" +
      "4. Click **'Connect and claim points'**.\n" +
      "5. Confirm with **'Yes, connect and claim'** to add retroactive Points to your balance!\n\n" +
      "⚠️ **Important Rule:** Once confirmed, your connected accounts are **permanently locked** to your wallet and cannot be changed or moved to another wallet!\n\n" +
      "🔗 **Official Portal:** [playground.rialo.io](https://playground.rialo.io)";
  }

  // 5. EXACT TARGET: Python Latch SDK Code
  if (q.includes("python") || q.includes("sdk") || q.includes("code") || q.includes("snippet") || q.includes("script") || q.includes("library")) {
    return "💻 **Verse AI Guide: Python Latch SDK Integration**\n\n" +
      "Here is how to initialize an autonomous AI agent with hardware-enforced spending limits using the Latch SDK:\n\n" +
      "```python\n" +
      "from rialo_latch import LatchAgent, Policy\n\n" +
      "# 1. Initialize agent with scoped session token\n" +
      "agent = LatchAgent(\n" +
      "    token='lat_live_rialo_agent_7x9q',\n" +
      "    network='rialo-testnet-1',\n" +
      "    rpc='https://testnet.rialo.io'\n" +
      ")\n\n" +
      "# 2. Enforce strict budget & contract whitelists\n" +
      "policy = Policy(\n" +
      "    max_per_tx=5.0,         # Max 5 RP per transaction\n" +
      "    daily_cap=50.0,         # Max 50 RP per 24 hours\n" +
      "    allowed_contracts=['0x742d35Cc6634C0532925a3b844Bc454e4438f44e']\n" +
      ")\n" +
      "agent.set_policy(policy)\n\n" +
      "# 3. Execute safe on-chain trade (fails automatically if limits exceeded)\n" +
      "tx_receipt = agent.execute_trade(pair='RP/USDT', amount=3.5)\n" +
      "print(f'Trade executed safely: {tx_receipt.hash}')\n" +
      "```\n\n" +
      "💡 *Tip: For customized code generation for your own smart contract, connect your free Gemini API key using the banner above!*";
  }

  // 6. EXACT TARGET: Shark Tank Pitch Winners
  if (q.includes("shark tank") || q.includes("pitch") || q.includes("jena") || q.includes("elias") || q.includes("vika")) {
    return "🏆 **Verse AI Guide: Shark Tank Pitch Champions**\n\n" +
      "Rialo Shark Tank is the official community pitch competition where ecosystem builders present live dApps:\n\n" +
      "• **Edition #3 Winner (August 18, 2026):**\n" +
      "  - **Winner:** **Just Jena** (`@kirahell69`)\n" +
      "  - **Winning dApp:** **RialOS - The Agent Desktop** ([rialos.vercel.app](https://rialos.vercel.app/))\n\n" +
      "• **Edition #2 Winner (August 4, 2026):**\n" +
      "  - **Winner:** **Elias** (`@eliasskun`)\n" +
      "  - **Winning dApp:** **Rialo Agent Vault**\n\n" +
      "• **Edition #1 Winner (July 20, 2026):**\n" +
      "  - **Winner:** **Vika Joestar** (`@vikajoestar`)\n" +
      "  - **Winning dApp:** **CyberRialo Combat Arena**\n\n" +
      "👉 Visit the [Events Tab](#events) to flip through all historical pitch winners!";
  }

  // 7. EXACT TARGET: Top Verified Ecosystem dApps
  if (q.includes("dapp") || q.includes("app") || q.includes("verified") || q.includes("ecosystem") || q.includes("project") || q.includes("gaming") || q.includes("defi") || q.includes("olpa") || q.includes("dex")) {
    return "📱 **Verse AI Guide: Top Verified Community dApps**\n\n" +
      "Here are top community-built applications across key sectors:\n\n" +
      "• **💎 DeFi & Derivatives:**\n" +
      "  - *OLPA DEX*: Event-native decentralized derivatives AMM ([olpadex.vercel.app](https://olpadex.vercel.app/)).\n" +
      "  - *YieldSentinel*: Automated LP rebalancing using Latch agents.\n\n" +
      "• **🎮 Gaming & Racing:**\n" +
      "  - *Agent Grand Prix (AGP)*: Real-time word circuit racing and RP betting.\n" +
      "  - *CyberRialo Combat*: Tactical PvP arena with instant 0.4s combat settlement.\n\n" +
      "• **🤖 AI Agents & Tools:**\n" +
      "  - *RialOS*: The official agent desktop environment (Shark Tank Winner).\n" +
      "  - *Latch Sentinel*: Hardware policy generator and security sandbox.\n\n" +
      "👉 Visit the [dApps Tab](#dapps) to search, filter by sector, and launch all 165+ live applications!";
  }

  // 8. EXACT TARGET: Quiz Games & Leaderboard Archive
  if (q.includes("quiz") || q.includes("round") || q.includes("nathbabu") || q.includes("keinn") || q.includes("vangle") || q.includes("winner") || q.includes("champion") || q.includes("leaderboard") || q.includes("top builder")) {
    var latestQuiz = (typeof quizHistory !== "undefined" && quizHistory[0]) ? quizHistory[0] : null;
    var quizCount = (typeof quizHistory !== "undefined") ? quizHistory.length : 30;
    var quizLines = (latestQuiz && latestQuiz.champions) ? latestQuiz.champions.slice(0, 3).map(function (c) {
      return "  - " + c.medal + " " + c.tag + ": **" + c.name + "**\n";
    }).join("") : "";
    return "🧠 **Verse AI Guide: Quiz Games & Community Leaderboard**\n\n" +
      "Rialo hosts weekly tech quizzes on Discord #quiz (" + quizCount + " rounds archived):\n\n" +
      (latestQuiz ? "• **Latest quiz (" + latestQuiz.date + "):**\n" + quizLines + "\n" : "") +
      "👉 Visit the [Events & Leaderboard Tabs](#events) to browse every round and the live builder rankings!";
  }

  // 9. EXACT TARGET: Community Spotlight / Members of the Week
  if (q.includes("spotlight") || q.includes("member") || q.includes("week") || q.includes("regional") || q.includes("community")) {
    var latestSpot = (typeof spotlightHistory !== "undefined" && spotlightHistory[0]) ? spotlightHistory[0] : null;
    var spotCount = (typeof spotlightHistory !== "undefined") ? spotlightHistory.length : 9;
    var spotNames = (latestSpot && latestSpot.members && latestSpot.members.length)
      ? latestSpot.members.slice(0, 5).map(function (m) { return m.name; }).join(", ") : "";
    return "🌟 **Verse AI Guide: Community Spotlight & Members of the Week**\n\n" +
      "Rialo recognizes top regional community champions every week (" + spotCount + " editions recorded):\n\n" +
      (latestSpot ? "• **Latest edition (" + latestSpot.date + "):** " + (spotNames ? spotNames + ", and more regional ambassadors." : "see the archive for the full lineup.") + "\n" : "") +
      "👉 Visit the [Events Tab](#events) to view regional portraits and contributor details!";
  }

  // 10. General Rialo Overview
  if (q.includes("what is rialo") || q.includes("about rialo") || q.includes("speed") || q.includes("privacy") || q.includes("layer 1") || q.includes("why rialo") || q.includes("rialo network")) {
    return "⚡ **Verse AI Guide: What is Rialo Network?**\n\n" +
      "Rialo is a high-speed Layer-1 blockchain engineered by Subzero Labs specifically for autonomous AI agents and privacy-preserving dApps.\n\n" +
      "**Key Capabilities:**\n" +
      "1. **~0.4s Instant Finality:** Sub-second block confirmation for real-time agent execution.\n" +
      "2. **Latch Hardware Security:** Native TEE enclaves and scoped tokens to protect agent wallets.\n" +
      "3. **Zero-Knowledge Privacy:** Native ZK cryptography for confidential transactions and DAO voting.\n" +
      "4. **Fractional-Cent Gas Fees:** High throughput designed for continuous high-frequency agent actions.";
  }

  // 9. Intelligent, context-aware offline response for non-Rialo questions
  return "ℹ️ **Verse AI (Built-in Knowledge Mode)**\n\n" +
    "I am currently operating in **Offline Built-in Mode**, which contains dedicated answers for the **Rialo Network & Latch Protocol** ecosystem.\n\n" +
    "To ask general questions about **\"" + escapeHtml(query) + "\"**, other blockchains, or custom coding, please connect a free Google Gemini API key using the setup banner above to enable **Live AI Thinking Mode**!\n\n" +
    "**Built-in topics I can answer offline:**\n" +
    "• *What is Rialo Network?* (~0.4s finality & ZK privacy)\n" +
    "• *How to prevent wallet drains with Latch?*\n" +
    "• *Testnet RPC & 20 RP faucet guide*\n" +
    "• *Retroactive Points & playground.rialo.io linking*\n" +
    "• *Agent Grand Prix (AGP) racing strategy*\n" +
    "• *Shark Tank Winners & Top ecosystem dApps*";
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;");
}


function getSeedFallbackData() {
  return [
  {
    "title": "OLPA DEX",
    "description": "The first event-native decentralized derivatives exchange and automated market maker built for real-time order routing.",
    "category": [
      "defi",
      "dex"
    ],
    "gitRepo": "",
    "liveLink": "https://olpadex.vercel.app/",
    "builder": {
      "name": "OLPA Labs",
      "username": "olpa_dex",
      "image": "https://api.dicebear.com/7.x/identicon/svg?seed=rdex_labs",
      "xLink": "https://x.com/rdex_labs",
      "about": "High-frequency AMM for Rialo L1"
    },
    "loves": 24,
    "views": 45,
    "isNew": true,
    "source": "Community Submissions",
    "verified": true,
    "primarySector": "DeFi, Prediction & Lending"
  },
  {
    "title": "Stello Finance",
    "description": "Decentralized lending, yield staking, and treasury asset management protocol built on Rialo L1 with automated policy settlement.",
    "category": [
      "defi",
      "lending"
    ],
    "gitRepo": "",
    "liveLink": "https://playground.rialo.io/",
    "builder": {
      "name": "Stello Team",
      "username": "stellofinance",
      "image": "https://api.dicebear.com/7.x/identicon/svg?seed=stellofinance",
      "xLink": "https://x.com/stellofinance",
      "about": "DeFi & yield protocol on Rialo"
    },
    "loves": 18,
    "views": 31,
    "isNew": true,
    "source": "Community Submissions",
    "verified": true,
    "primarySector": "DeFi, Prediction & Lending"
  },
  {
    "title": "Rialo Drop Game",
    "description": "A simple yet challenging drop game where quick reflexes and perfect timing are the key to survival.",
    "category": [
      "game"
    ],
    "gitRepo": "",
    "liveLink": "https://muhtasimmuiz.github.io/Rialo-Game-/",
    "builder": {
      "name": "Muhtasim Muiz",
      "username": "muhtasim4921",
      "image": "https://pbs.twimg.com/profile_images/2006444862737186816/kYzDIO54_400x400.jpg",
      "xLink": "https://x.com/muhtasimmuiz",
      "about": "Creating simple, fun digital experiences through gaming and creativity.\nThe build is on: http://rialo.io"
    },
    "loves": 4,
    "views": 9,
    "isNew": false,
    "source": "Rialo Showcase DB",
    "verified": true,
    "primarySector": "Web3 Gaming & On-Chain Arcade"
  },
  {
    "title": "Rialo - 2048",
    "description": "Rialo-2048 is a web-based version of the classic number-merging puzzle game 2048.",
    "category": [
      "game"
    ],
    "gitRepo": "https://github.com/mishunir/Rialo-2048",
    "liveLink": "https://mishunir.github.io/Rialo-2048/",
    "builder": {
      "name": "Koushik Nir",
      "username": "mishunir",
      "image": "https://pbs.twimg.com/profile_images/1990726148997918720/wC0FYl9O_400x400.jpg",
      "xLink": "https://x.com/AhmedNir",
      "about": "Developer |  Video Artist | Digital Artist |  Meme & Sticker Maker | Building ideas into visuals"
    },
    "loves": 10,
    "views": 31,
    "isNew": false,
    "source": "Rialo Showcase DB",
    "verified": true,
    "primarySector": "Web3 Gaming & On-Chain Arcade"
  },
  {
    "title": "R-Cade",
    "description": "Next gen gaming platform which which combine game, NFT and Betting together.",
    "category": [
      "launchpad"
    ],
    "gitRepo": "",
    "liveLink": "https://r-cade-demo.vercel.app/",
    "builder": {
      "name": "Nahian",
      "username": "yournahian",
      "image": "https://pbs.twimg.com/profile_images/1966521996080209920/MbtcGvTv_400x400.jpg",
      "xLink": "https://x.com/yournahian",
      "about": "❖  Ritual Fanboy-live on \n@ritualnet\n\n🎯 Started at 0 → Writing to earn attention\n🚀 Building, learning, connecting"
    },
    "loves": 8,
    "views": 25,
    "isNew": false,
    "source": "Rialo Showcase DB",
    "verified": true,
    "primarySector": "Web3 Gaming & On-Chain Arcade"
  },
  {
    "title": "Rialo REX Native Privacy Simulator",
    "description": "An interactive visualizer demonstrating the critical difference between public blockchain execution and Rialo's Native Privacy (REX). The app simulates real-time transaction flows, showing how public mempools expose sensitive data (API keys, PII, Trades) to MEV bots, while Rialo's TEE enclaves keep inputs encrypted and secure. It features a fully interactive simulation, educational comparisons, and visualizations of real-world use cases like Private DeFi and Authenticated Services",
    "category": [
      "tooling",
      "privacy",
      "education",
      "visualizer"
    ],
    "gitRepo": "https://github.com/Phonicxxxx24/Privacy-Simulator",
    "liveLink": "https://privacy-simulator-rialo.vercel.app/",
    "builder": {
      "name": "Harshit",
      "username": "Phonicxxxx24",
      "image": "https://pbs.twimg.com/profile_images/1989340568288382976/mu8jtfjJ_400x400.jpg",
      "xLink": "https://x.com/gaminggop24",
      "about": "Hey, I’m Harshit CS student, web and AI enthusiast, exploring the world of technology and blockchain through real projects.\n I share my journey, experiments, and lessons learned as I build in Web, AI, and Crypto."
    },
    "loves": 6,
    "views": 11,
    "isNew": false,
    "source": "Rialo Showcase DB",
    "verified": true,
    "primarySector": "Block Explorers & Telemetry"
  },
  {
    "title": "RIALO OBSCURA",
    "description": "Rialo Obscura is the premier privacy layer for Base Sepolia, enabling shielded transactions and encrypted asset management through advanced cryptographic protocols.",
    "category": [
      "defi",
      "dex",
      "tooling"
    ],
    "gitRepo": "https://github.com/cilokcimol/Rialo-Obscura",
    "liveLink": "https://www.rialo.online/",
    "builder": {
      "name": "Vika Joestar",
      "username": "vikajoestar",
      "image": "https://pbs.twimg.com/profile_images/2038221160400449536/brTBv48V_400x400.jpg",
      "xLink": "https://x.com/cryptocymol",
      "about": "Builder at \n@RialoHQ"
    },
    "loves": 103,
    "views": 136,
    "isNew": false,
    "source": "Rialo Showcase DB",
    "verified": true,
    "primarySector": "DeFi, Prediction & Lending"
  },
  {
    "title": "RELOX",
    "description": "RELOX – Relax, Match, Earn!\n\nStep into the vibrant world of RELOX, where color, strategy, and crypto collide! Match patterns, earn Relox Points, and unlock rewards as you navigate this visually stunning grid-based game. With an easy-to-learn interface and a playful, neon aesthetic, RELOX invites both casual gamers and crypto enthusiasts to test their focus, reflexes, and strategy.",
    "category": [
      "game"
    ],
    "gitRepo": "",
    "liveLink": "https://reloxrialo.netlify.app/",
    "builder": {
      "name": "Hasibul Hasan Mahi",
      "username": "mahi017fr",
      "image": "https://pbs.twimg.com/profile_images/1979567307299880964/jtyBPk_O_400x400.jpg",
      "xLink": "https://x.com/HasibulHasanM2",
      "about": "Hello! I’m Hasibul Hasan Mahi, a passionate web designer, graphic designer, and a budding web3 expert from Bangladesh."
    },
    "loves": 5,
    "views": 7,
    "isNew": false,
    "source": "Rialo Showcase DB",
    "verified": true,
    "primarySector": "Web3 Gaming & On-Chain Arcade"
  },
  {
    "title": "Rialo Games",
    "description": "Kami membangun sebuah game on-chain sederhana dengan fokus pada transparansi, keterbukaan logika, dan mekanisme yang bisa diverifikasi langsung di blockchain.\n\nGame ini masih dalam tahap pengembangan awal, namun sudah berjalan dengan sistem dasar yang sepenuhnya on-chain.",
    "category": [
      "game"
    ],
    "gitRepo": "",
    "liveLink": "https://rialo-hub.vercel.app/",
    "builder": {
      "name": "SZA",
      "username": "deffz10",
      "image": "https://pbs.twimg.com/profile_images/2002722627140673536/DR8ThBcv_400x400.jpg",
      "xLink": "https://x.com/Szaonly666",
      "about": "contributor \n@RialoHQ\n\n\nin my own season, in my own rhythm."
    },
    "loves": 2,
    "views": 9,
    "isNew": false,
    "source": "Rialo Showcase DB",
    "verified": true,
    "primarySector": "Web3 Gaming & On-Chain Arcade"
  },
  {
    "title": "ROXOR Cavalier Scent",
    "description": "ROXOR Cavalier: RWA Loyalty System 🧪 Smart Contract for ROXOR fragrance brand. Integrating real-world luxury with blockchain utility on Rialo Network.",
    "category": [
      "tooling"
    ],
    "gitRepo": "https://github.com/zahraefendy/ROXOR-Scent-Contract",
    "liveLink": "https://roxor-web.vercel.app/",
    "builder": {
      "name": "CryptoNdo",
      "username": "fernando220169",
      "image": "https://pbs.twimg.com/profile_images/1978513383550025728/KaL7KjRl_400x400.jpg",
      "xLink": "https://x.com/FernandoZa5928",
      "about": "Web 3 Airdrop | Agent Competitor Role"
    },
    "loves": 2,
    "views": 6,
    "isNew": false,
    "source": "Rialo Showcase DB",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialo Event Community Hub",
    "description": "Your single source of truth for everything happening across the Rialo ecosystem.",
    "category": [
      "dashboard",
      "visualizer"
    ],
    "gitRepo": "https://github.com/mrnetwork0001/rialo-event-hub",
    "liveLink": "https://rialo-event-hub.vercel.app/",
    "builder": {
      "name": "MrNetwork",
      "username": "mrnetwork001",
      "image": "https://pbs.twimg.com/profile_images/1866934536992354304/8lTxuhqj_400x400.jpg",
      "xLink": "https://x.com/encrypt_wizard",
      "about": "Developer | Community Management Specialist | DeFi Researcher |"
    },
    "loves": 2,
    "views": 7,
    "isNew": false,
    "source": "Rialo Showcase DB",
    "verified": true,
    "primarySector": "Block Explorers & Telemetry"
  },
  {
    "title": "Rialo Car Game",
    "description": "Rialo Car Game is a fast-paced, reflex-based driving game where players must navigate their car along multiple lanes while avoiding incoming obstacles. The game tests your hand-eye coordination and timing: as obstacles fall or appear in different lanes, you need to quickly move your car left or right to avoid collisions.",
    "category": [
      "game"
    ],
    "gitRepo": "",
    "liveLink": "https://roaring-babka-e33b03.netlify.app/",
    "builder": {
      "name": "Nayem",
      "username": "nayem_109",
      "image": "https://pbs.twimg.com/profile_images/1972187817259438080/RSW4XQsg_400x400.jpg",
      "xLink": "https://x.com/Nayem109",
      "about": "Contributor | Content creator | Junior dev | Club role holder at Rialo"
    },
    "loves": 4,
    "views": 12,
    "isNew": false,
    "source": "Rialo Showcase DB",
    "verified": true,
    "primarySector": "Web3 Gaming & On-Chain Arcade"
  },
  {
    "title": "Trigr",
    "description": "he first trading terminal with native automation. Your orders execute automatically on-chain — no bots, no keepers, no third parties.",
    "category": [
      "trading",
      "dex"
    ],
    "gitRepo": "https://github.com/cutepawss/trigr",
    "liveLink": "https://trigr-web.vercel.app/",
    "builder": {
      "name": "minion.btc",
      "username": "nftgal",
      "image": "https://pbs.twimg.com/profile_images/2022058390445277185/uVzdi9pW_400x400.jpg",
      "xLink": "https://x.com/minion_btc",
      "about": "Building on Arc | Full-Stack Dev in the making...\nArt & Content Creator💙 | dc id: nftgal"
    },
    "loves": 7,
    "views": 14,
    "isNew": false,
    "source": "Rialo Showcase DB",
    "verified": true,
    "primarySector": "DeFi, Prediction & Lending"
  },
  {
    "title": "Rialo Live",
    "description": "RialoStream: The Next-Gen High-Performance Web3 Live Tipping Platform Built on Rialo",
    "category": [
      "social",
      "streaminig"
    ],
    "gitRepo": "https://github.com/syf1213764315/rialo_live",
    "liveLink": "https://keen-centaur-8c8bf6.netlify.app/",
    "builder": {
      "name": "ayun",
      "username": "syf1213764315",
      "image": "https://pbs.twimg.com/profile_images/2010998012731146249/BSRCYUaT_400x400.jpg",
      "xLink": "https://x.com/ayun24335167",
      "about": "web3亏钱者"
    },
    "loves": 3,
    "views": 10,
    "isNew": false,
    "source": "Rialo Showcase DB",
    "verified": true,
    "primarySector": "Autonomous AI Agents & Bots"
  },
  {
    "title": "Rialo Catch Game",
    "description": "Rialo Catch Game - Catch, Score, Conquer!\nA fast-paced casual arcade experience where reflexes and focus are your greatest allies! In this minimalist yet addictive title, tokens drift through the air and it’s up to you to catch them with precision before time runs out.",
    "category": [
      "game"
    ],
    "gitRepo": "",
    "liveLink": "https://muhtasimmuiz.github.io/Rialo-Catch-Game/",
    "builder": {
      "name": "Anika Saima",
      "username": "woshopy",
      "image": "https://pbs.twimg.com/profile_images/1997930342527995904/kNdm1BDs_400x400.jpg",
      "xLink": "https://x.com/muhtasimmuiz",
      "about": "Junior devs | Contributor | Content creator | Artist"
    },
    "loves": 2,
    "views": 5,
    "isNew": false,
    "source": "Rialo Showcase DB",
    "verified": true,
    "primarySector": "Web3 Gaming & On-Chain Arcade"
  },
  {
    "title": "UniFAIR",
    "description": "A fully functional Web3 dApp for the Rialo Layer 1 ecosystem. Built with Next.js (frontend) + Express.js (backend) + ethers.js (blockchain).",
    "category": [
      "dex"
    ],
    "gitRepo": "",
    "liveLink": "https://unifairlabs.xyz/",
    "builder": {
      "name": "Luzzy",
      "username": "luzzy97",
      "image": "https://pbs.twimg.com/profile_images/2024600868944039936/VmY2nOE4_400x400.jpg",
      "xLink": "https://x.com/luzzyzz97",
      "about": "working as a full-time nobody, web3 n shitpost enjoyer"
    },
    "loves": 1,
    "views": 5,
    "isNew": false,
    "source": "Rialo Showcase DB",
    "verified": true,
    "primarySector": "DeFi, Prediction & Lending"
  },
  {
    "title": "Privstay",
    "description": "PrivStay is a complete MVP decentralized application that demonstrates how real-world hospitality assets can be listed, booked, paid, verified, and settled through blockchain without exposing sensitive customer, host, hotel, or booking data publicly.",
    "category": [
      "cloude"
    ],
    "gitRepo": "",
    "liveLink": "https://www.privstay.cloud/",
    "builder": {
      "name": "Cloud Labs",
      "username": "cloudtechvn",
      "image": "https://pbs.twimg.com/profile_images/2033003962698465280/H3zXD_Q5_400x400.jpg",
      "xLink": "https://x.com/cloudtechvn",
      "about": "🪪 https://cloudlabs.id.vn\n🧑‍💻 Mod & Researcher\n🧑‍💻  Alpha and OG Support Early project\n🤝Magnitude at \n@SeismicSys\n\n🟢https://seismicpfp.xyz"
    },
    "loves": 1,
    "views": 2,
    "isNew": false,
    "source": "Rialo Showcase DB",
    "verified": true,
    "primarySector": "Autonomous AI Agents & Bots"
  },
  {
    "title": "Rialo Builder Showcase",
    "description": "Explore real projects from the Rialo community. From DeFi protocols to NFT platforms, find the builders and tools shaping what's next.",
    "category": [
      "showcase"
    ],
    "gitRepo": "https://github.com/Sukanto01899/rialo-build-showcase",
    "liveLink": "https://rialobs.vercel.app",
    "builder": {
      "name": "Sukanto",
      "username": "sukanto01899",
      "image": "https://pbs.twimg.com/profile_images/2032044013885468672/ogpJNYPp_400x400.jpg",
      "xLink": "https://x.com/sukanto018",
      "about": "Building @Ababilpay | Turning ideas into onchain reality"
    },
    "loves": 2,
    "views": 3,
    "isNew": false,
    "source": "Rialo Showcase DB",
    "verified": true,
    "primarySector": "DeFi, Prediction & Lending"
  },
  {
    "title": "Sender",
    "description": "Sender is the fastest way to batch-distribute native tokens and NFTs on Rialo & Arc. Upload a CSV, review and execute with a single transaction.",
    "category": [
      "tooling"
    ],
    "gitRepo": "https://github.com/shazib083/Sender",
    "liveLink": "https://sender-dapp.vercel.app/",
    "builder": {
      "name": "hossain",
      "username": "funkgirl",
      "image": "https://pbs.twimg.com/profile_images/2022010475031277571/D-op69r8_400x400.jpg",
      "xLink": "https://x.com/0xclowng",
      "about": "Web3 visionary | Building \n@Ababilpay\n | just a pleb Contributor | Builder \n@arc\n house"
    },
    "loves": 2,
    "views": 3,
    "isNew": false,
    "source": "Rialo Showcase DB",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialo royal casino",
    "description": "Play provably fair games on Base Sepolia. Connect once, play everything. All outcomes are determined on-chain.",
    "category": [
      "predication"
    ],
    "gitRepo": "",
    "liveLink": "https://rialo-royale-casino.vercel.app/games/slots",
    "builder": {
      "name": "Juniorr",
      "username": "juniorr1945",
      "image": "https://pbs.twimg.com/profile_images/2002722627140673536/DR8ThBcv_400x400.jpg",
      "xLink": "https://x.com/szaonly666?s=21",
      "about": "contributor \n@RialoHQ\n\nin my own season, in my own rhythm. building : https://rialo-royale-casino.vercel.app/games/slots"
    },
    "loves": 1,
    "views": 2,
    "isNew": false,
    "source": "Rialo Showcase DB",
    "verified": true,
    "primarySector": "Web3 Gaming & On-Chain Arcade"
  },
  {
    "title": "Rialo Alpha",
    "description": "our very own AI buddy for the blockchain! Rialo handles all the boring stuff while you enjoy the ride. It's smart, fun, and really, really fast!",
    "category": [
      "dex",
      "ai"
    ],
    "gitRepo": "https://github.com/JohnsonNguyen-coll/rialoalpha",
    "liveLink": "https://rialoalpha.vercel.app/",
    "builder": {
      "name": "Elias",
      "username": "eliasskun",
      "image": "https://pbs.twimg.com/profile_images/1978492502786416640/pb-VpMY1_400x400.jpg",
      "xLink": "https://x.com/Johson_Nguyen",
      "about": "onchain | building dApp on \n@arc\n \n@RialoHQ\n \ndc: eliasskun"
    },
    "loves": 1,
    "views": 11,
    "isNew": false,
    "source": "Rialo Showcase DB",
    "verified": true,
    "primarySector": "DeFi, Prediction & Lending"
  },
  {
    "title": "MMArena( Meme Arena )",
    "description": "Bet ETH\nFight for real\nWin on-chain\nRound-by-round 1v1 PvP combat, stake real SepoliaETH",
    "category": [
      "memecoin"
    ],
    "gitRepo": "",
    "liveLink": "https://mmarena.online/",
    "builder": {
      "name": "Minwon",
      "username": "maiwuocbinh1997",
      "image": "https://pbs.twimg.com/profile_images/2035613679195242496/agjj_2Df_400x400.jpg",
      "xLink": "https://x.com/binhbethc",
      "about": "Builders at : \n@RialoHQ"
    },
    "loves": 1,
    "views": 3,
    "isNew": false,
    "source": "Rialo Showcase DB",
    "verified": true,
    "primarySector": "Autonomous AI Agents & Bots"
  },
  {
    "title": "Rialo Oracle",
    "description": "Predict the outcome and earn rewards if you're right.",
    "category": [
      "trading",
      "prediction"
    ],
    "gitRepo": "https://github.com/Stella112/Rialo-oracle",
    "liveLink": "https://rialo-oracle.vercel.app/",
    "builder": {
      "name": "Stellamaris",
      "username": "steste112",
      "image": "https://pbs.twimg.com/profile_images/1830888540458102784/sXDE1OoU_400x400.jpg",
      "xLink": "https://x.com/Marisdigitals11",
      "about": "Founder \n@sweepers_dao\n\ncrypto enthusiast\nAlpha hunter\n@maygNFT\n holder 😎\nAmbassador \n@spicenetio\n\nVIBE CODER"
    },
    "loves": 1,
    "views": 5,
    "isNew": false,
    "source": "Rialo Showcase DB",
    "verified": true,
    "primarySector": "DeFi, Prediction & Lending"
  },
  {
    "title": "Whisper Tiles — Flip Edition",
    "description": "All cards start hidden. Watch for the signal and flip the correct cards at the right moment. Precision and timing decide everything—Rialo-style.",
    "category": [
      "game"
    ],
    "gitRepo": "https://github.com/nrraihan834/Whisper-Tiles-Rialo",
    "liveLink": "https://whisper-tiles-rialo.vercel.app/",
    "builder": {
      "name": "NR Raihan",
      "username": "nrraihan",
      "image": "https://pbs.twimg.com/profile_images/1972622416443850752/ER88re_7_400x400.jpg",
      "xLink": "https://x.com/nrraihan391",
      "about": "Content Creator 🎨 | Web3 & Crypto Strategist 💹 | NFT Artist & Collector 🖼️ | Collabs & Discord"
    },
    "loves": 2,
    "views": 5,
    "isNew": false,
    "source": "Rialo Showcase DB",
    "verified": true,
    "primarySector": "Web3 Gaming & On-Chain Arcade"
  },
  {
    "title": "RialEstate",
    "description": "a decentralized real estate platform designed to address critical challenges faced by property buyers and sellers.",
    "category": [
      "p2p",
      "rwa"
    ],
    "gitRepo": "https://github.com/Ritapossible/RialEstate",
    "liveLink": "https://rialestate.vercel.app/",
    "builder": {
      "name": "Rita Crypto Tips",
      "username": "rita95",
      "image": "http://pbs.twimg.com/profile_images/2011939995758854144/2r1bexy7_400x400.jpg",
      "xLink": "https://x.com/RitaCryptoTips",
      "about": "software engr || creator. || technical writer || space host. || educator. || \n@RialoHQ\n contributor. || cooking \n@r3taLabs\n || building \n@web3paths_"
    },
    "loves": 0,
    "views": 8,
    "isNew": false,
    "source": "Rialo Showcase DB",
    "verified": true,
    "primarySector": "Autonomous AI Agents & Bots"
  },
  {
    "title": "The nexus",
    "description": "Community dashboard for the Rialo ecosystem on Solana Devnet. Daily check-ins, social missions, on-chain badge minting via Metaplex, leaderboard, chatroom, X tracker, and OAuth2 profile integration for GitHub, Discord, and X.",
    "category": [
      "showcase"
    ],
    "gitRepo": "https://github.com/cilokcimol/tale-of-nexus",
    "liveLink": "https://taleofnexus.netlify.app/",
    "builder": {
      "name": "Reji ganteng",
      "username": "reji00504",
      "image": "https://pbs.twimg.com/profile_images/2031949830977961992/AskQyajG_400x400.jpg",
      "xLink": "https://x.com/rejii73927",
      "about": "shitposter | comunity builder | bocah kelipto"
    },
    "loves": 1,
    "views": 5,
    "isNew": false,
    "source": "Rialo Showcase DB",
    "verified": true,
    "primarySector": "Wallets, Identity & Bridges"
  },
  {
    "title": "R-Cloud",
    "description": "Connect your family cameras to a secure private cloud. Watch live feeds, store recordings, and review footage anytime from any device.",
    "category": [
      "cloud-storage"
    ],
    "gitRepo": "https://github.com/STMTP95/R-Cloud/",
    "liveLink": "https://github.com/STMTP95/R-Cloud/",
    "builder": {
      "name": "SonTung.MTP",
      "username": "stmtp95",
      "image": "https://pbs.twimg.com/profile_images/2004226467987877888/Fk54rG50_400x400.jpg",
      "xLink": "https://x.com/STMTP95",
      "about": "🥇 CM Support\n🥇 Project Support\n🥇 Contribute for community"
    },
    "loves": 1,
    "views": 5,
    "isNew": false,
    "source": "Rialo Showcase DB",
    "verified": true,
    "primarySector": "Autonomous AI Agents & Bots"
  },
  {
    "title": "Rialo Fun Zone",
    "description": "Rialo Fun Zone is playground arena for fun like quiz,gaming,art and parlay market.",
    "category": [
      "game"
    ],
    "gitRepo": "",
    "liveLink": "https://rialo-fun.vercel.app/",
    "builder": {
      "name": "rey88",
      "username": "rey88.",
      "image": "https://i.ibb.co/9kCqQWpR/rey.jpg",
      "xLink": "https://x.com/Rey_8899",
      "about": "Creator, Builder and Believer"
    },
    "loves": 0,
    "views": 4,
    "isNew": false,
    "source": "Rialo Showcase DB",
    "verified": true,
    "primarySector": "Web3 Gaming & On-Chain Arcade"
  },
  {
    "title": "TruthLens",
    "description": "Every photo and video is recorded on-chain the moment it's captured.\nWhether it's AI-generated or real — the chain proves it.",
    "category": [
      "ai"
    ],
    "gitRepo": "https://github.com/psu0612/truthlens",
    "liveLink": "https://psu0612.github.io/truthlens/",
    "builder": {
      "name": "Greenmelon",
      "username": "sangwook06",
      "image": "https://pbs.twimg.com/profile_images/1990594528395603973/kL_eV-41_400x400.jpg",
      "xLink": "https://x.com/bjdrst",
      "about": "I ALWAYS DO MY BEST  (🇰🇷 KOREA)\nDiscord : sangwook06\nRialo : Rialo Club Member\nSuccinct : ALL IN SUCCINCT"
    },
    "loves": 0,
    "views": 3,
    "isNew": false,
    "source": "Rialo Showcase DB",
    "verified": true,
    "primarySector": "Autonomous AI Agents & Bots"
  },
  {
    "title": "Project Gaia",
    "description": "Watch unpredictable natural events, predict outcomes and see how your predictions create useful data for nature science.",
    "category": [
      "prediction"
    ],
    "gitRepo": "",
    "liveLink": "https://project-gaia-ten.vercel.app/",
    "builder": {
      "name": "Meowth",
      "username": "tenoli0424",
      "image": "https://pbs.twimg.com/profile_images/2036224208376848384/8clGeaSJ_400x400.jpg",
      "xLink": "https://x.com/dwowmuch",
      "about": "코인과 AI를 좋아하는 INFP (헛소리 심함) D is for Dogecoin"
    },
    "loves": 0,
    "views": 3,
    "isNew": false,
    "source": "Rialo Showcase DB",
    "verified": true,
    "primarySector": "DeFi, Prediction & Lending"
  },
  {
    "title": "Rialo Court",
    "description": "File a dispute, submit evidence, and receive a binding verdict from our AI arbitration engine — backed by on-chain escrow.",
    "category": [
      "ai"
    ],
    "gitRepo": "",
    "liveLink": "https://rialo-court.vercel.app/",
    "builder": {
      "name": "ZOEFUNDS",
      "username": "zoefunds",
      "image": "https://pbs.twimg.com/profile_images/2043659553120903168/Tmk6FSrz_400x400.jpg",
      "xLink": "https://x.com/BardOfTheBlocks",
      "about": "Building arc || Content Writer || Dev || Simulation Website Pro"
    },
    "loves": 0,
    "views": 4,
    "isNew": false,
    "source": "Rialo Showcase DB",
    "verified": true,
    "primarySector": "Autonomous AI Agents & Bots"
  },
  {
    "title": "RiaLobster",
    "description": "Agentic Infrastructure on Rialo",
    "category": [
      "ai",
      "agent",
      "tooling"
    ],
    "gitRepo": "",
    "liveLink": "https://rialobster.vercel.app/",
    "builder": {
      "name": "Lun",
      "username": "cr3ap3r9487",
      "image": "https://pbs.twimg.com/profile_images/1878842647403716608/JXkozxNn_400x400.jpg",
      "xLink": "https://x.com/creapergod",
      "about": "A dev, a gamer and a wannabe educator"
    },
    "loves": 0,
    "views": 4,
    "isNew": false,
    "source": "Rialo Showcase DB",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Chainsure",
    "description": "ChainSure is a decentralized insurance protocol built on the Rialo blockchain, leveraging native Timer and HTTP capabilities for fully automated, trustless insurance products.",
    "category": [
      "tooling",
      "oracle",
      "insurance"
    ],
    "gitRepo": "https://github.com/GeorgeScoote/rialo-",
    "liveLink": "https://rialo-qrv4.vercel.app/",
    "builder": {
      "name": "ウルトラマンエース",
      "username": "memeswapbitj6842",
      "image": "https://pbs.twimg.com/profile_images/2029092326828851202/e9ytdsyv_400x400.jpg",
      "xLink": "https://x.com/TeenaTiesha",
      "about": "Developer 🐱‍🏍Monad Developer"
    },
    "loves": 0,
    "views": 5,
    "isNew": false,
    "source": "Rialo Showcase DB",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Volund",
    "description": "The native reputation layer for the Rialo ecosystem. Prove your credibility, earn badges, and unlock institutional DeFi access.",
    "category": [
      "defi"
    ],
    "gitRepo": "https://github.com/septian-coder/volund",
    "liveLink": "https://volund.vercel.app/",
    "builder": {
      "name": "Kent Lee",
      "username": "kent_lee",
      "image": "https://pbs.twimg.com/profile_images/1974496931624943616/4EVMRyVc_400x400.jpg",
      "xLink": "https://x.com/kentwoodsahpu",
      "about": ""
    },
    "loves": 0,
    "views": 4,
    "isNew": false,
    "source": "Rialo Showcase DB",
    "verified": true,
    "primarySector": "DeFi, Prediction & Lending"
  },
  {
    "title": "Rialo-predict",
    "description": "Rialo Market Predictor App (opsional)",
    "category": [
      "predication"
    ],
    "gitRepo": "https://github.com/sheingelzs/Rialo-Predict",
    "liveLink": "https://github.com/sheingelzs/Rialo-Predict",
    "builder": {
      "name": "sheina",
      "username": "rayhan_pdillah",
      "image": "https://pbs.twimg.com/profile_images/2004558427377512448/2pODKBqE_400x400.jpg",
      "xLink": "https://x.com/sheinasalisha",
      "about": "learning web 3 |\ngrow wth \n@RialoHQ\n \n@GenLayer"
    },
    "loves": 0,
    "views": 7,
    "isNew": false,
    "source": "Rialo Showcase DB",
    "verified": true,
    "primarySector": "DeFi, Prediction & Lending"
  },
  {
    "title": "OlpaDEX",
    "description": "The moment it happens on the pitch, it happens on-chain. Trade on real-world events with millisecond execution, zero manipulation, and complete transparency.",
    "category": [
      "tooling",
      "dex"
    ],
    "gitRepo": "https://github.com/MrBillion1/olpasimulation",
    "liveLink": "https://olpasimulation.lovable.app/",
    "builder": {
      "name": "Chiphon",
      "username": "mhiztabillion01",
      "image": "https://pbs.twimg.com/profile_images/1960714139145318400/rLkmDlcq_400x400.jpg",
      "xLink": "https://x.com/chiphon_olpa",
      "about": "Constructive thinker"
    },
    "loves": 0,
    "views": 6,
    "isNew": false,
    "source": "Rialo Showcase DB",
    "verified": true,
    "primarySector": "DeFi, Prediction & Lending"
  },
  {
    "title": "RialoHub prediction market",
    "description": "1. What differentiates Rialohub from competitors?\nRialohub is designed as a Hybrid Prediction Ecosystem. Unlike Polymarket, which focuses primarily on binary event outcomes, Rialohub integrates:\nMulti-Vertical Markets: Football predictions, Binary Options (high-frequency crypto price trading), and general Market Forecasts in a single dashboard.\nIntegrated AI Intelligence: A native AI Agent that provides real-time market sentiment and data analysis to help users make informed predictions.\nGamified UX: A high-performance, \"hardware-inspired\" interface that feels more like a professional trading terminal than a standard web app.",
    "category": [
      "predication"
    ],
    "gitRepo": "https://github.com/mahi017fr/RialoHUB-testnet-",
    "liveLink": "https://www.mahii.xyz/",
    "builder": {
      "name": "MAHE",
      "username": "hasibulhasanm",
      "image": "https://pbs.twimg.com/profile_images/1979567307299880964/jtyBPk_O_400x400.jpg",
      "xLink": "https://x.com/HasibulHasanM2",
      "about": "Font-End Developer and Contributor Contributing for \n@RialoHQ\n & \n@perlelabs\n.       Senior Developer - \n@ababilpay"
    },
    "loves": 0,
    "views": 3,
    "isNew": false,
    "source": "Rialo Showcase DB",
    "verified": true,
    "primarySector": "DeFi, Prediction & Lending"
  },
  {
    "title": "Who wants to be a RialOne",
    "description": "Read · Answer · Earn your card · 60 Questions",
    "category": [
      "game"
    ],
    "gitRepo": "https://github.com/0xchukss/who-wants-to-be-a-RialONE",
    "liveLink": "https://who-wants-to-be-a-rial-one.vercel.app/",
    "builder": {
      "name": "Chuks",
      "username": "chuksdakingz",
      "image": "https://pbs.twimg.com/profile_images/1971512283239944192/-Aq4HpnX_400x400.jpg",
      "xLink": "https://x.com/Chuksdakingz",
      "about": "researcher | solidity and onchain analysis"
    },
    "loves": 0,
    "views": 2,
    "isNew": false,
    "source": "Rialo Showcase DB",
    "verified": true,
    "primarySector": "Web3 Gaming & On-Chain Arcade"
  },
  {
    "title": "Rialo Builder Tracker",
    "description": "Rialo Builders Arena is a web platform built for the Rialo Discord community to: 🏗️ Builder's Hub — Showcase weekly builder projects in a warm, workshop-themed environment 🦈 Shark Tank — Feature bold pitches in an intense, ocean-themed arena 🗳️ Community Voting — Discord-verified voting where Club Members get 2x voting power 👤 Builder Profiles — GitHub-integrated profiles with stats, repos, and achievement badges 🏆 Hall of Fame — Immortalize weekly winners",
    "category": [
      "showcase"
    ],
    "gitRepo": "https://github.com/surajcrypto04-cell/Rialo-Builder-Tracker",
    "liveLink": "https://rialo-builder-tracker.vercel.app/",
    "builder": {
      "name": "SurajCrypto69",
      "username": "surajcrypto69",
      "image": "https://pbs.twimg.com/profile_images/2014694734841970693/WG2xlWmM_400x400.jpg",
      "xLink": "https://x.com/SurajCrypto69",
      "about": "Observing from the front row."
    },
    "loves": 0,
    "views": 2,
    "isNew": false,
    "source": "Rialo Showcase DB",
    "verified": true,
    "primarySector": "Autonomous AI Agents & Bots"
  },
  {
    "title": "Rialopay",
    "description": "Cross-border payments, reimagined",
    "category": [
      "payment"
    ],
    "gitRepo": "https://github.com/Bibidee/rialopay",
    "liveLink": "https://rialo-pay.vercel.app",
    "builder": {
      "name": "𝖆urah",
      "username": "aur_ah",
      "image": "https://pbs.twimg.com/profile_images/1981036814119899136/IljcJWac_400x400.jpg",
      "xLink": "https://x.com/imani_cc",
      "about": "If you can't do big things, do small things in a big way. ||| WAGMI"
    },
    "loves": 0,
    "views": 2,
    "isNew": false,
    "source": "Rialo Showcase DB",
    "verified": true,
    "primarySector": "Autonomous AI Agents & Bots"
  },
  {
    "title": "Rialo Jackpot",
    "description": "A real-time, on-chain jackpot game suite built with Next.js, featuring three game modes: The Tower, Operators Hub, and Infinite Rug. The UI connects to a backend over WebSockets and renders live game state for all players.",
    "category": [
      "game"
    ],
    "gitRepo": "https://github.com/syf1213764315/rialo_game",
    "liveLink": "https://github.com/syf1213764315/rialo_game",
    "builder": {
      "name": "Cat🐱🐱🐱ayun",
      "username": "syf1213764315",
      "image": "https://pbs.twimg.com/profile_images/2010998012731146249/BSRCYUaT_400x400.jpg",
      "xLink": "https://x.com/ayun24335167",
      "about": "web3亏钱者"
    },
    "loves": 0,
    "views": 2,
    "isNew": false,
    "source": "Rialo Showcase DB",
    "verified": true,
    "primarySector": "Web3 Gaming & On-Chain Arcade"
  },
  {
    "title": "Rialo saving jar",
    "description": "Deposit USDC or USDT into your Rialo Saving Jar. Yield compounds daily on-chain — no bots, no keepers, no complexity. Just steady growth.",
    "category": [
      "defi",
      "dex",
      "tooling"
    ],
    "gitRepo": "",
    "liveLink": "https://rialo-saving-jar.vercel.app/",
    "builder": {
      "name": "Brokie",
      "username": "brokie0928",
      "image": "https://pbs.twimg.com/profile_images/2056672867656556544/d0mIkCZv_400x400.jpg",
      "xLink": "https://x.com/cryptofav",
      "about": ""
    },
    "loves": 0,
    "views": 1,
    "isNew": false,
    "source": "Rialo Showcase DB",
    "verified": true,
    "primarySector": "DeFi, Prediction & Lending"
  },
  {
    "title": "Rialo poap",
    "description": "Proof Your Presence,\nBuild Your Reputation\nJoin events, claim badges, and grow your onchain community identity.",
    "category": [
      "poap"
    ],
    "gitRepo": "",
    "liveLink": "https://rialo-poap.vercel.app/",
    "builder": {
      "name": "Szaa",
      "username": "szaxbt",
      "image": "https://pbs.twimg.com/profile_images/2046308716333678592/UT1jfwsY_400x400.jpg",
      "xLink": "https://x.com/szaonly666",
      "about": "contributor \n@RialoHQ\n\nin my own season, in my own rhythm. building : https://rialo-royale-"
    },
    "loves": 0,
    "views": 0,
    "isNew": false,
    "source": "Rialo Showcase DB",
    "verified": true,
    "primarySector": "Wallets, Identity & Bridges"
  },
  {
    "title": "Rialo-Rex-Vision",
    "description": "A visual debugger that demonstrates how Rialo blockchain executes transactions without oracles, pays gas through staking, and handles both fast and secure transaction modes.",
    "category": [
      "visualizer"
    ],
    "gitRepo": "https://github.com/surajcrypto04-cell/Rialo-Rex-Vision",
    "liveLink": "https://rialo-rex-vision.vercel.app/",
    "builder": {
      "name": "SurajCrypto69",
      "username": "surajcrypto69",
      "image": "https://pbs.twimg.com/profile_images/2014694734841970693/WG2xlWmM_400x400.jpg",
      "xLink": "https://x.com/SurajCrypto69",
      "about": "Observing from the front row."
    },
    "loves": 0,
    "views": 1,
    "isNew": false,
    "source": "Rialo Showcase DB",
    "verified": true,
    "primarySector": "Block Explorers & Telemetry"
  },
  {
    "title": "Stride",
    "description": "Zero-inflation, Move-to-Earn built natively on Rialo Network. Stake USDC against your fitness goals - win your stake back plus yield slashed from those who faltered.",
    "category": [
      "game"
    ],
    "gitRepo": "http://github.com/mrnetwork0001/Stride",
    "liveLink": "https://stride-run-app.vercel.app/",
    "builder": {
      "name": "MrNetwork",
      "username": "mrnetwork001",
      "image": "https://pbs.twimg.com/profile_images/1866934536992354304/8lTxuhqj_400x400.jpg",
      "xLink": "https://x.com/encrypt_wizard",
      "about": "Builder\nAI Enthusiast\nDeFi Researcher \n2x Hackathon Winner"
    },
    "loves": 0,
    "views": 0,
    "isNew": false,
    "source": "Rialo Showcase DB",
    "verified": true,
    "primarySector": "Web3 Gaming & On-Chain Arcade"
  },
  {
    "title": "RiApps",
    "description": "Discover the next generation of decentralized apps, tools, and infrastructure built on the world's most scalable blockchain.",
    "category": [
      "ecosystem"
    ],
    "gitRepo": "https://github.com/thelotachi/riapps",
    "liveLink": "https://riapps.vercel.app/",
    "builder": {
      "name": "Thelotachi",
      "username": "0xlota",
      "image": "https://pbs.twimg.com/profile_images/2007684416890343424/qJRJzRG__400x400.jpg",
      "xLink": "https://x.com/0xlota",
      "about": "Apply Yourself Daily | Keep Clicking 🧑‍💻"
    },
    "loves": 0,
    "views": 0,
    "isNew": false,
    "source": "Rialo Showcase DB",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialo-arena",
    "description": "A competitive real-time multiplayer quiz & reflex game built on Web3/Rialo.",
    "category": [
      "game"
    ],
    "gitRepo": "https://github.com/Asadullah0575/rialo-arena",
    "liveLink": "https://rialo-arena.vercel.app/",
    "builder": {
      "name": "",
      "username": "asad_0x",
      "image": "https://pbs.twimg.com/profile_images/1980911132358402049/NSV1eBoE_400x400.jpg",
      "xLink": "https://x.com/Asad_0x",
      "about": "turning ideas into digital impact"
    },
    "loves": 0,
    "views": 0,
    "isNew": false,
    "source": "Rialo Showcase DB",
    "verified": true,
    "primarySector": "Web3 Gaming & On-Chain Arcade"
  },
  {
    "title": "RialOS",
    "description": "One programmable layer for payroll, credit, and investing — running automatically, on-chain, with no intermediaries. Shark Tank Winner.",
    "category": [
      "tools",
      "system"
    ],
    "gitRepo": "",
    "liveLink": "https://rialos.vercel.app/",
    "builder": {
      "name": "Just Jena",
      "username": "kirahell69",
      "image": "assets/just_jena.png",
      "xLink": "https://x.com/RialOS_xyz",
      "about": "Shark Tank Winner · Builder of RialOS on Rialo L1"
    },
    "loves": 45,
    "views": 58,
    "isNew": false,
    "source": "Rialo Shark Tank Winner",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "NarrativeOS",
    "description": "narrativeonchain",
    "category": [
      "defi",
      "dex",
      "tooling"
    ],
    "gitRepo": "https://github.com/SuryaXyz-art/NarrativeOS",
    "liveLink": "https://narrativeonchain.netlify.app/",
    "builder": {
      "name": "Surya",
      "username": "surya6276",
      "image": "https://pbs.twimg.com/profile_images/1982406446407987200/GbIPi7Ul_400x400.jpg",
      "xLink": "https://x.com/Surya_xyz_",
      "about": "The blockchain is going to change everything more than the Internet has - I write about blockchain"
    },
    "loves": 0,
    "views": 0,
    "isNew": false,
    "source": "Rialo Showcase DB",
    "verified": true,
    "primarySector": "DeFi, Prediction & Lending"
  },
  {
    "title": "PROOF PAY",
    "description": "Lock funds, verify real-world GitHub proof, and execute conditional payment actions through the ProofPay Rialo adapter.",
    "category": [
      "payments"
    ],
    "gitRepo": "",
    "liveLink": "https://proofpay-nu.vercel.app",
    "builder": {
      "name": "TiAdler",
      "username": "_neitenoz26",
      "image": "https://pbs.twimg.com/profile_images/1918191739585875968/OduU6Qq2_400x400.jpg",
      "xLink": "https://x.com/Neitenoz26",
      "about": "AI Engineer at CMS Technology | Crypto x AI | Fun & Fundamentals"
    },
    "loves": 0,
    "views": 0,
    "isNew": false,
    "source": "Rialo Showcase DB",
    "verified": true,
    "primarySector": "Autonomous AI Agents & Bots"
  },
  {
    "title": "Rialo Testnet Explorer",
    "description": "Rialo ecosystem project",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/phamvanngocdien/Rialo-testnet-Explorer",
    "liveLink": "https://github.com/phamvanngocdien/Rialo-testnet-Explorer",
    "builder": {
      "name": "phamvanngocdien",
      "username": "phamvanngocdien",
      "image": "https://avatars.githubusercontent.com/u/89622712?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Block Explorers & Telemetry"
  },
  {
    "title": "Rialo Hub Backend",
    "description": "Rialo ecosystem project",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/Davethompson01/rialo_hub_backend",
    "liveLink": "https://github.com/Davethompson01/rialo_hub_backend",
    "builder": {
      "name": "Davethompson01",
      "username": "Davethompson01",
      "image": "https://avatars.githubusercontent.com/u/158461935?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialo",
    "description": "Rialo is an early-stage Layer 1 blockchain building high-throughput infrastructure with configurable privacy for real-world finance and the emerging agent economy. Developed by Subzero Labs and backed by Pantera Capital, Rialo positions itself as the infrastructure for the next generation of intelligent systems, replacing the fragile stack of…",
    "category": [
      "apis-json",
      "blockchain",
      "company",
      "crypto",
      "defi",
      "infrastructure",
      "layer-1",
      "privacy",
      "real-world-assets",
      "web3"
    ],
    "gitRepo": "https://github.com/api-evangelist/rialo",
    "liveLink": "https://github.com/api-evangelist/rialo",
    "builder": {
      "name": "api-evangelist",
      "username": "api-evangelist",
      "image": "https://avatars.githubusercontent.com/u/3026872?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "DeFi, Prediction & Lending"
  },
  {
    "title": "Rialo Playground Automation",
    "description": "Multi-account terminal client (TUI) untuk Rialo Playground — cek wallet, klaim faucet, dan pantau points dari satu terminal. Go + Bubble Tea + Camoufox.",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/Ardian3D/rialo-playground-automation",
    "liveLink": "https://github.com/Ardian3D/rialo-playground-automation",
    "builder": {
      "name": "Ardian3D",
      "username": "Ardian3D",
      "image": "https://avatars.githubusercontent.com/u/215558529?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialink",
    "description": "Link your GitHub, Discord, and Farcaster accounts to your wallet. No real name or email stored. Just proof permanent and verifiable on Rialo.",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/Abd00lmalik/Rialink",
    "liveLink": "https://rialink.vercel.app",
    "builder": {
      "name": "Abd00lmalik",
      "username": "Abd00lmalik",
      "image": "https://avatars.githubusercontent.com/u/153097744?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Wallets, Identity & Bridges"
  },
  {
    "title": "Rialogames",
    "description": "games on rialo",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/Rialdon/Rialogames",
    "liveLink": "https://rialogames.vercel.app",
    "builder": {
      "name": "Rialdon",
      "username": "Rialdon",
      "image": "https://avatars.githubusercontent.com/u/138004238?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Web3 Gaming & On-Chain Arcade"
  },
  {
    "title": "Rialo Visualizations",
    "description": "Interactive visualizations for Rialo's blog, built with vanilla HTML/CSS/JS and hosted on GitHub Pages.",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/eawosika/rialo-visualizations",
    "liveLink": "https://eawosika.github.io/rialo-visualizations/",
    "builder": {
      "name": "eawosika",
      "username": "eawosika",
      "image": "https://avatars.githubusercontent.com/u/271299477?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Block Explorers & Telemetry"
  },
  {
    "title": "Rialolens",
    "description": "Master the Rialo blockchain through immersive quests,\nAI-powered insights, and real-world asset discovery.",
    "category": [
      "ai",
      "agent",
      "tooling"
    ],
    "gitRepo": "",
    "liveLink": "https://rialolens.vercel.app/",
    "builder": {
      "name": "Relixsx",
      "username": "relixsx",
      "image": "https://pbs.twimg.com/profile_images/1950794865421250560/NxS9OgIs_400x400.jpg",
      "xLink": "https://x.com/GojoReality",
      "about": "Machine learning Engineer ┃AI Dev┃"
    },
    "loves": 0,
    "views": 0,
    "isNew": false,
    "source": "Rialo Showcase DB",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialoscan",
    "description": "An independent block explorer for Rialo. Blocks, transactions, accounts, validators and REX workflows, read straight from the node JSON-RPC.",
    "category": [
      "block-explorer",
      "blockchain",
      "devnet",
      "explorer",
      "json-rpc",
      "nextjs",
      "polkavm",
      "rialo",
      "testnet",
      "typescript"
    ],
    "gitRepo": "",
    "liveLink": "https://rialoscan.org",
    "builder": {
      "name": "Orvynel",
      "username": "Orvynel",
      "image": "https://avatars.githubusercontent.com/u/88089483?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Block Explorers & Telemetry"
  },
  {
    "title": "PayOnRain",
    "description": "Protect your business from unpredictable weather. Set your threshold, and get automatic payouts when conditions are met.",
    "category": [
      "insurance"
    ],
    "gitRepo": "https://github.com/Jennivarl/Rialo-Weather-Insurance",
    "liveLink": "https://payonrain.vercel.app/",
    "builder": {
      "name": "varl𓏲ּ𝄢",
      "username": "varl999",
      "image": "https://pbs.twimg.com/profile_images/2017108189053956096/Xhz4pMt0_400x400.jpg",
      "xLink": "https://x.com/varl999",
      "about": "…?"
    },
    "loves": 0,
    "views": 0,
    "isNew": false,
    "source": "Rialo Showcase DB",
    "verified": true,
    "primarySector": "DeFi, Prediction & Lending"
  },
  {
    "title": "Rialo Chatbot",
    "description": "A bot for Q&A about Rialo ",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/Yusoof4all/Rialo-chatbot",
    "liveLink": "https://github.com/Yusoof4all/Rialo-chatbot",
    "builder": {
      "name": "Yusoof4all",
      "username": "Yusoof4all",
      "image": "https://avatars.githubusercontent.com/u/152717704?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialo Chatbot Q A",
    "description": "As the bot everything about Rialo ",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/Yusoof4all/Rialo-chatbot-Q-A",
    "liveLink": "https://github.com/Yusoof4all/Rialo-chatbot-Q-A",
    "builder": {
      "name": "Yusoof4all",
      "username": "Yusoof4all",
      "image": "https://avatars.githubusercontent.com/u/152717704?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialo Claimbot",
    "description": "AI-powered micro-insurance claim processor for motorbikes on Ethereum Sepolia. 4-agent pipeline, on-chain USDC payout, Chainlink Automation + Functions.",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/phu1271997/rialo-claimbot",
    "liveLink": "https://github.com/phu1271997/rialo-claimbot",
    "builder": {
      "name": "phu1271997",
      "username": "phu1271997",
      "image": "https://avatars.githubusercontent.com/u/197733364?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Wallets, Identity & Bridges"
  },
  {
    "title": "Rialo Perp",
    "description": "Hyperliquid-style perpetual futures DEX on Rialo",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/nbaeti630-ui/rialo-perp",
    "liveLink": "https://github.com/nbaeti630-ui/rialo-perp",
    "builder": {
      "name": "nbaeti630-ui",
      "username": "nbaeti630-ui",
      "image": "https://avatars.githubusercontent.com/u/245698538?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "DeFi, Prediction & Lending"
  },
  {
    "title": "Rialo Credit Scoring",
    "description": "Rialo ecosystem project",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/nbaeti630-ui/rialo-credit-scoring",
    "liveLink": "https://github.com/nbaeti630-ui/rialo-credit-scoring",
    "builder": {
      "name": "nbaeti630-ui",
      "username": "nbaeti630-ui",
      "image": "https://avatars.githubusercontent.com/u/245698538?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "RialoPulse",
    "description": "Real-time network telemetry dashboard and developer sandbox for the Rialo ecosystem.",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/promanas0/RialoPulse",
    "liveLink": "https://github.com/promanas0/RialoPulse",
    "builder": {
      "name": "promanas0",
      "username": "promanas0",
      "image": "https://avatars.githubusercontent.com/u/221670567?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Block Explorers & Telemetry"
  },
  {
    "title": "Rialo Faucet Auto",
    "description": "Rialo ecosystem project",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/quangdai1321/rialo-faucet-auto",
    "liveLink": "https://github.com/quangdai1321/rialo-faucet-auto",
    "builder": {
      "name": "quangdai1321",
      "username": "quangdai1321",
      "image": "https://avatars.githubusercontent.com/u/24934409?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialohub Typescript",
    "description": "Rialo ecosystem project",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/Davethompson01/rialohub_typescript",
    "liveLink": "https://github.com/Davethompson01/rialohub_typescript",
    "builder": {
      "name": "Davethompson01",
      "username": "Davethompson01",
      "image": "https://avatars.githubusercontent.com/u/158461935?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Conduit",
    "description": "Conduit: multi-chain treasury app with AI integration on Rialo",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/edwarderlick/Conduit",
    "liveLink": "https://conduit-omega.vercel.app",
    "builder": {
      "name": "edwarderlick",
      "username": "edwarderlick",
      "image": "https://avatars.githubusercontent.com/u/84850708?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialo Agent Market",
    "description": "Autonomous AI agent marketplace on Rialo ,on-chain HTTP dispatch, no oracle",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/JspIIV/rialo-agent-market",
    "liveLink": "https://rialo-agent-market.vercel.app",
    "builder": {
      "name": "JspIIV",
      "username": "JspIIV",
      "image": "https://avatars.githubusercontent.com/u/98713940?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialo Petverse Rwa",
    "description": "Rialo PetVerse is a digital identity platform for pets running on Sepolia testnet. Owners mint their pet as an on-chain NFT. Microchip, vaccine, vet and insurance records are verified by a vet panel or Rialo Rex AI, then written on-chain as a proof hash. Includes a global leaderboard and city-based Community.",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/Cagdasozsahin/rialo-petverse-rwa",
    "liveLink": "https://cagdasozsahin.github.io/rialo-petverse-rwa/",
    "builder": {
      "name": "Cagdasozsahin",
      "username": "Cagdasozsahin",
      "image": "https://avatars.githubusercontent.com/u/118298201?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Wallets, Identity & Bridges"
  },
  {
    "title": "Trocooony",
    "description": "On-chain labor market for AI agents on Rialo — escrow-backed work, autonomous judging, deadline auto-refunds, and risk-priced insurance.",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/Cepodr/trocooony",
    "liveLink": "https://www.trocooony.tech",
    "builder": {
      "name": "Cepodr",
      "username": "Cepodr",
      "image": "https://avatars.githubusercontent.com/u/158283801?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Circlo Rialo",
    "description": "Circlo turns community savings circles into a trustless, on-chain protocol no organizer to trust, no wallet setup, no interest.",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/Kingxfn/circlo-rialo",
    "liveLink": "https://github.com/Kingxfn/circlo-rialo",
    "builder": {
      "name": "Kingxfn",
      "username": "Kingxfn",
      "image": "https://avatars.githubusercontent.com/u/140968765?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Circlo Rialoo",
    "description": "Circlo turns community savings circles into a trustless, on-chain protocol no organizer to trust, no wallet setup, no interest.",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/Kingxfn/Circlo_Rialoo",
    "liveLink": "https://circlo-rialoo22.vercel.app",
    "builder": {
      "name": "Kingxfn",
      "username": "Kingxfn",
      "image": "https://avatars.githubusercontent.com/u/140968765?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialo Life Online",
    "description": "Rialo ecosystem project",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/Nanangn27/rialo-life-online",
    "liveLink": "https://github.com/Nanangn27/rialo-life-online",
    "builder": {
      "name": "Nanangn27",
      "username": "Nanangn27",
      "image": "https://avatars.githubusercontent.com/u/197187988?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Aam110",
    "description": "Build Game Rialo",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/aam110/aam110",
    "liveLink": "https://github.com/aam110/aam110",
    "builder": {
      "name": "aam110",
      "username": "aam110",
      "image": "https://avatars.githubusercontent.com/u/56313935?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Web3 Gaming & On-Chain Arcade"
  },
  {
    "title": "Rialoflow",
    "description": "Rialo ecosystem project",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/boksoon9511/rialoflow",
    "liveLink": "https://github.com/boksoon9511/rialoflow",
    "builder": {
      "name": "boksoon9511",
      "username": "boksoon9511",
      "image": "https://avatars.githubusercontent.com/u/314282680?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialorace",
    "description": "Rialo ecosystem project",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/tenoli750/rialorace",
    "liveLink": "https://github.com/tenoli750/rialorace",
    "builder": {
      "name": "tenoli750",
      "username": "tenoli750",
      "image": "https://avatars.githubusercontent.com/u/132812666?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "ReformaTribut RiaLocadoresImoveis",
    "description": "Rialo ecosystem project",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/JCcontabilidade/ReformaTribut-riaLocadoresImoveis",
    "liveLink": "https://github.com/JCcontabilidade/ReformaTribut-riaLocadoresImoveis",
    "builder": {
      "name": "JCcontabilidade",
      "username": "JCcontabilidade",
      "image": "https://avatars.githubusercontent.com/u/308390562?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialobounty",
    "description": "Açık kaynağa katkı ver, RIALO ile kazan. Şirketler ödül koyar, geliştiriciler GitHub üzerinden çözüm gönderir, en iyi çözüm seçilir ve ödeme zincir üstünde otomatik yapılır.",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/Cagdasozsahin/rialobounty",
    "liveLink": "https://cagdasozsahin.github.io/rialobounty/",
    "builder": {
      "name": "Cagdasozsahin",
      "username": "Cagdasozsahin",
      "image": "https://avatars.githubusercontent.com/u/118298201?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Agentguard Rialo",
    "description": "Rialo ecosystem project",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/AMR70234/agentguard-rialo",
    "liveLink": "https://github.com/AMR70234/agentguard-rialo",
    "builder": {
      "name": "AMR70234",
      "username": "AMR70234",
      "image": "https://avatars.githubusercontent.com/u/77763751?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Moolo Wallet Guardian",
    "description": "Moolo browser-only reactive wallet security simulation designed for Rialo Builders Hub",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/mingyu-wtf/moolo-wallet-guardian",
    "liveLink": "https://github.com/mingyu-wtf/moolo-wallet-guardian",
    "builder": {
      "name": "mingyu-wtf",
      "username": "mingyu-wtf",
      "image": "https://avatars.githubusercontent.com/u/208666798?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialo Import Intelligenc",
    "description": "Rialo ecosystem project",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/Temmygabriel/rialo-import-intelligenc",
    "liveLink": "https://rialo-import-intelligenc.vercel.app",
    "builder": {
      "name": "Temmygabriel",
      "username": "Temmygabriel",
      "image": "https://avatars.githubusercontent.com/u/68011822?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "RialoTempleAgent",
    "description": "Rialo ecosystem project",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/nxrskyaa/RialoTempleAgent",
    "liveLink": "https://rialo-temple-agent.vercel.app",
    "builder": {
      "name": "nxrskyaa",
      "username": "nxrskyaa",
      "image": "https://avatars.githubusercontent.com/u/3919974?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Circlo",
    "description": "Trustless rotating savings circles (ROSCA/Kameti/Susu/Tanda) built on Rialo, the real-world blockchain.",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/Kingxfn/Circlo",
    "liveLink": "https://circlo-ruddy.vercel.app",
    "builder": {
      "name": "Kingxfn",
      "username": "Kingxfn",
      "image": "https://avatars.githubusercontent.com/u/140968765?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Latchspend",
    "description": "Agent spend control — Latch scopes charges, Rialo records settlement",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/KeithinX/latchspend",
    "liveLink": "https://latchspend.vercel.app",
    "builder": {
      "name": "KeithinX",
      "username": "KeithinX",
      "image": "https://avatars.githubusercontent.com/u/103510224?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialo Rewind",
    "description": "Native compensation and recovery engine for real-world workflows on Rialo.",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/CryptoDombili/rialo-rewind",
    "liveLink": "https://rialo-rewind.vercel.app",
    "builder": {
      "name": "CryptoDombili",
      "username": "CryptoDombili",
      "image": "https://avatars.githubusercontent.com/u/213498199?v=4",
      "xLink": ""
    },
    "loves": 2,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialo Real Explore",
    "description": "Rialo ecosystem project",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/Nanangn27/rialo-real-explore",
    "liveLink": "https://rialo-real-explore.vercel.app",
    "builder": {
      "name": "Nanangn27",
      "username": "Nanangn27",
      "image": "https://avatars.githubusercontent.com/u/197187988?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialo Market Place 3",
    "description": "A Real world assets market place for rialo",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/Iblamehsan/Rialo-market-place-3",
    "liveLink": "https://github.com/Iblamehsan/Rialo-market-place-3",
    "builder": {
      "name": "Iblamehsan",
      "username": "Iblamehsan",
      "image": "https://avatars.githubusercontent.com/u/180299647?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialo Agp Agent",
    "description": "Rialo ecosystem project",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/songsong6059/rialo-agp-agent",
    "liveLink": "https://github.com/songsong6059/rialo-agp-agent",
    "builder": {
      "name": "songsong6059",
      "username": "songsong6059",
      "image": "https://avatars.githubusercontent.com/u/128883518?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialo.Swap",
    "description": "Rialo ecosystem project",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/melophile0646/rialo.swap",
    "liveLink": "https://github.com/melophile0646/rialo.swap",
    "builder": {
      "name": "melophile0646",
      "username": "melophile0646",
      "image": "https://avatars.githubusercontent.com/u/226128142?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "DeFi, Prediction & Lending"
  },
  {
    "title": "Rialohq Ecosystem Dapps",
    "description": "Applications on Rialo ecosystem ",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/Yusoof4all/Rialohq-ecosystem-dapps",
    "liveLink": "https://github.com/Yusoof4all/Rialohq-ecosystem-dapps",
    "builder": {
      "name": "Yusoof4all",
      "username": "Yusoof4all",
      "image": "https://avatars.githubusercontent.com/u/152717704?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialo Landing Page",
    "description": "Rialo Landing Page",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/xBerayan/rialo-landing-page",
    "liveLink": "https://github.com/xBerayan/rialo-landing-page",
    "builder": {
      "name": "xBerayan",
      "username": "xBerayan",
      "image": "https://avatars.githubusercontent.com/u/185531323?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialo Apps",
    "description": "Place to search for apps on Rialo ecosystem ",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/Yusoof4all/Rialo-apps",
    "liveLink": "https://github.com/Yusoof4all/Rialo-apps",
    "builder": {
      "name": "Yusoof4all",
      "username": "Yusoof4all",
      "image": "https://avatars.githubusercontent.com/u/152717704?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialo Onlatch",
    "description": "Rialo ecosystem project",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/JuliocesarsantosTI/Rialo-onlatch",
    "liveLink": "https://github.com/JuliocesarsantosTI/Rialo-onlatch",
    "builder": {
      "name": "JuliocesarsantosTI",
      "username": "JuliocesarsantosTI",
      "image": "https://avatars.githubusercontent.com/u/51294116?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialo Latch",
    "description": "Rialo ecosystem project",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/syf1213764315/rialo_latch",
    "liveLink": "https://github.com/syf1213764315/rialo_latch",
    "builder": {
      "name": "syf1213764315",
      "username": "syf1213764315",
      "image": "https://avatars.githubusercontent.com/u/34392447?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialo Prediction",
    "description": "Rialo ecosystem project",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/JuliocesarsantosTI/Rialo-prediction",
    "liveLink": "https://github.com/JuliocesarsantosTI/Rialo-prediction",
    "builder": {
      "name": "JuliocesarsantosTI",
      "username": "JuliocesarsantosTI",
      "image": "https://avatars.githubusercontent.com/u/51294116?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "DeFi, Prediction & Lending"
  },
  {
    "title": "Rialo Snippet Generator",
    "description": "Rialo ecosystem project",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/SamDavodi/rialo-snippet-generator",
    "liveLink": "https://samdavodi.github.io/rialo-snippet-generator/latch-leak-simulator.html",
    "builder": {
      "name": "SamDavodi",
      "username": "SamDavodi",
      "image": "https://avatars.githubusercontent.com/u/136931926?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "RialCast",
    "description": "A decentralized football prediction and gaming dApp built on Rialo, featuring betting, games, leaderboards, and user profiles.",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/erfanmohamadnabi/RialCast",
    "liveLink": "https://rial-cast.vercel.app/",
    "builder": {
      "name": "erfanmohamadnabi",
      "username": "erfanmohamadnabi",
      "image": "https://avatars.githubusercontent.com/u/162614590?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Web3 Gaming & On-Chain Arcade"
  },
  {
    "title": "Rialo Captain",
    "description": "Rialo ecosystem project",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/fangTiger/rialo-captain",
    "liveLink": "https://captain-rialo.vercel.app",
    "builder": {
      "name": "fangTiger",
      "username": "fangTiger",
      "image": "https://avatars.githubusercontent.com/u/37855848?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialo Site",
    "description": "Rialo ecosystem project",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/Aabis5004/rialo-site",
    "liveLink": "https://rialo-site-navy.vercel.app",
    "builder": {
      "name": "Aabis5004",
      "username": "Aabis5004",
      "image": "https://avatars.githubusercontent.com/u/88813561?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialo Agent",
    "description": "Rialo ecosystem project",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/hosammahdy91/rialo-agent",
    "liveLink": "https://github.com/hosammahdy91/rialo-agent",
    "builder": {
      "name": "hosammahdy91",
      "username": "hosammahdy91",
      "image": "https://avatars.githubusercontent.com/u/66032004?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialo Chess",
    "description": "Rialo ecosystem project",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/edoyh34-bot/rialo-chess-",
    "liveLink": "https://github.com/edoyh34-bot/rialo-chess-",
    "builder": {
      "name": "edoyh34-bot",
      "username": "edoyh34-bot",
      "image": "https://avatars.githubusercontent.com/u/295822875?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Web3 Gaming & On-Chain Arcade"
  },
  {
    "title": "Rialo Private Portfolio",
    "description": "Rialo ecosystem project",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/DARMA150/rialo-private-portfolio",
    "liveLink": "https://github.com/DARMA150/rialo-private-portfolio",
    "builder": {
      "name": "DARMA150",
      "username": "DARMA150",
      "image": "https://avatars.githubusercontent.com/u/236298411?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialo Vercel",
    "description": "Rialo ecosystem project",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/shazib083/rialo-vercel",
    "liveLink": "https://github.com/shazib083/rialo-vercel",
    "builder": {
      "name": "shazib083",
      "username": "shazib083",
      "image": "https://avatars.githubusercontent.com/u/33812982?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialo Guard Desk2",
    "description": "Rialo ecosystem project",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/keleqaq123/rialo-guard-desk2",
    "liveLink": "https://github.com/keleqaq123/rialo-guard-desk2",
    "builder": {
      "name": "keleqaq123",
      "username": "keleqaq123",
      "image": "https://avatars.githubusercontent.com/u/161554673?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialo Market Place 2",
    "description": "A Real world assets market place for rialo",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/Iblamehsan/Rialo-market-place-2",
    "liveLink": "https://github.com/Iblamehsan/Rialo-market-place-2",
    "builder": {
      "name": "Iblamehsan",
      "username": "Iblamehsan",
      "image": "https://avatars.githubusercontent.com/u/180299647?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialo Microinsurance",
    "description": "Rialo ecosystem project",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/AMR70234/rialo-microinsurance",
    "liveLink": "https://rialo-microinsurance.vercel.app",
    "builder": {
      "name": "AMR70234",
      "username": "AMR70234",
      "image": "https://avatars.githubusercontent.com/u/77763751?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialo Spend Guardian",
    "description": "Rialo ecosystem project",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/AMR70234/rialo-spend-guardian",
    "liveLink": "https://rialo-spend-guardian.vercel.app",
    "builder": {
      "name": "AMR70234",
      "username": "AMR70234",
      "image": "https://avatars.githubusercontent.com/u/77763751?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialo Flow",
    "description": "Rialo ecosystem project",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/memosr/rialo-flow",
    "liveLink": "https://rialo-flow.vercel.app",
    "builder": {
      "name": "memosr",
      "username": "memosr",
      "image": "https://avatars.githubusercontent.com/u/96793918?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Parcel Rialo",
    "description": "Delivery-settled escrow on Rialo: the contract reads the carrier itself through HTTPS Pulse and releases USDC on delivery. No oracle, no keeper.",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/rivaleuc/Parcel-Rialo",
    "liveLink": "https://parcel-rialo-web.vercel.app",
    "builder": {
      "name": "rivaleuc",
      "username": "rivaleuc",
      "image": "https://avatars.githubusercontent.com/u/96087144?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Block Explorers & Telemetry"
  },
  {
    "title": "Rialo Hub",
    "description": "Rialo ecosystem project",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/AMR70234/rialo-hub",
    "liveLink": "https://rialo-hub-pi.vercel.app",
    "builder": {
      "name": "AMR70234",
      "username": "AMR70234",
      "image": "https://avatars.githubusercontent.com/u/77763751?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialo Console",
    "description": "Rialo ecosystem project",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/shazib083/rialo-console",
    "liveLink": "https://rialo-console.vercel.app",
    "builder": {
      "name": "shazib083",
      "username": "shazib083",
      "image": "https://avatars.githubusercontent.com/u/33812982?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialo Market Place",
    "description": "A Real world assets market place for rialo",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/Iblamehsan/Rialo-market-place-",
    "liveLink": "https://github.com/Iblamehsan/Rialo-market-place-",
    "builder": {
      "name": "Iblamehsan",
      "username": "Iblamehsan",
      "image": "https://avatars.githubusercontent.com/u/180299647?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialo Examples",
    "description": "Rialo Examples",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/samsamtrum/rialo-examples",
    "liveLink": "https://github.com/samsamtrum/rialo-examples",
    "builder": {
      "name": "samsamtrum",
      "username": "samsamtrum",
      "image": "https://avatars.githubusercontent.com/u/53391581?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 35,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialo Id Card",
    "description": "Rialo ecosystem project",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/devshafin/rialo-id-card",
    "liveLink": "https://github.com/devshafin/rialo-id-card",
    "builder": {
      "name": "devshafin",
      "username": "devshafin",
      "image": "https://avatars.githubusercontent.com/u/124555339?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Snake Ll",
    "description": "game snake Rialo",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/Felix-X0/snake-ll",
    "liveLink": "https://felix-x0.github.io/snake-ll/",
    "builder": {
      "name": "Felix-X0",
      "username": "Felix-X0",
      "image": "https://avatars.githubusercontent.com/u/48359859?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Web3 Gaming & On-Chain Arcade"
  },
  {
    "title": "Arkive",
    "description": "Crypto inheritance and digital legacy protection on the Rialo Protocol.",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/Ritapossible/Arkive",
    "liveLink": "https://github.com/Ritapossible/Arkive",
    "builder": {
      "name": "Ritapossible",
      "username": "Ritapossible",
      "image": "https://avatars.githubusercontent.com/u/124313160?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialo Move2give",
    "description": "Rialo Move2Give demo",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/bruce5110/rialo-move2give",
    "liveLink": "https://github.com/bruce5110/rialo-move2give",
    "builder": {
      "name": "bruce5110",
      "username": "bruce5110",
      "image": "https://avatars.githubusercontent.com/u/129502420?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialopred",
    "description": "On-chain prediction market built on Rialo — crypto, sports, World Cup, wrestling, politics & more",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/Premusking/rialopred",
    "liveLink": "https://github.com/Premusking/rialopred",
    "builder": {
      "name": "Premusking",
      "username": "Premusking",
      "image": "https://avatars.githubusercontent.com/u/110945988?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "DeFi, Prediction & Lending"
  },
  {
    "title": "Rialo Studio",
    "description": "Rialo ecosystem project",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/Raviteja995952/Rialo-Studio",
    "liveLink": "https://github.com/Raviteja995952/Rialo-Studio",
    "builder": {
      "name": "Raviteja995952",
      "username": "Raviteja995952",
      "image": "https://avatars.githubusercontent.com/u/163875148?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialo Spin Wheels",
    "description": "Rialo Spin Wheels",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/rakswp/Rialo-Spin-Wheels",
    "liveLink": "https://rialo-spin-wheels.vercel.app",
    "builder": {
      "name": "rakswp",
      "username": "rakswp",
      "image": "https://avatars.githubusercontent.com/u/44085283?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialo Signal",
    "description": "Rialo Signal — Onchain Intelligence Terminal | RWA + Crypto signal engine built for the Rialo ecosystem. Live price feeds, wallet analysis, cluster visualization, and Rialo SDK-ready architecture.",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/selcouthweb3/rialo-signal",
    "liveLink": "https://rialo-signal.vercel.app",
    "builder": {
      "name": "selcouthweb3",
      "username": "selcouthweb3",
      "image": "https://avatars.githubusercontent.com/u/136738758?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Block Explorers & Telemetry"
  },
  {
    "title": "Rialone",
    "description": "Rialo ecosystem project",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/0xchukss/Rialone",
    "liveLink": "https://rialone.vercel.app",
    "builder": {
      "name": "0xchukss",
      "username": "0xchukss",
      "image": "https://avatars.githubusercontent.com/u/64996976?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialo Quest",
    "description": "Rialo ecosystem project",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/Afghanistan8/Rialo-Quest",
    "liveLink": "https://rialo-quest.vercel.app",
    "builder": {
      "name": "Afghanistan8",
      "username": "Afghanistan8",
      "image": "https://avatars.githubusercontent.com/u/99311444?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialo Quiz",
    "description": "Rialo ecosystem project",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/gberyll/rialo-quiz",
    "liveLink": "https://rialo-knowledge-game.vercel.app/",
    "builder": {
      "name": "gberyll",
      "username": "gberyll",
      "image": "https://avatars.githubusercontent.com/u/192154324?v=4",
      "xLink": ""
    },
    "loves": 2,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialounge",
    "description": "Rialo ecosystem project",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/skynyx420/rialounge",
    "liveLink": "https://github.com/skynyx420/rialounge",
    "builder": {
      "name": "skynyx420",
      "username": "skynyx420",
      "image": "https://avatars.githubusercontent.com/u/284285341?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "RIALO ORBIT",
    "description": "Rialo ecosystem project",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/lolaaa00/RIALO-ORBIT",
    "liveLink": "https://github.com/lolaaa00/RIALO-ORBIT",
    "builder": {
      "name": "lolaaa00",
      "username": "lolaaa00",
      "image": "https://avatars.githubusercontent.com/u/233496294?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "The Nexus Alpha Core",
    "description": "Rialo Market Predictor App (opsional)",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/sheingelzs/The-Nexus-Alpha-Core",
    "liveLink": "https://the-nexus-alpha-core-o9ii.vercel.app/",
    "builder": {
      "name": "sheingelzs",
      "username": "sheingelzs",
      "image": "https://avatars.githubusercontent.com/u/265601746?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "DeFi, Prediction & Lending"
  },
  {
    "title": "Rialo Testnet",
    "description": "For syncing pubkeys and configs during genesis",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/manos/rialo-testnet",
    "liveLink": "https://github.com/manos/rialo-testnet",
    "builder": {
      "name": "manos",
      "username": "manos",
      "image": "https://avatars.githubusercontent.com/u/132518?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 125,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialo Move2give Legacy",
    "description": "Rialo ecosystem project",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/bruce5110/rialo-move2give-legacy",
    "liveLink": "https://github.com/bruce5110/rialo-move2give-legacy",
    "builder": {
      "name": "bruce5110",
      "username": "bruce5110",
      "image": "https://avatars.githubusercontent.com/u/129502420?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialoball",
    "description": "gabut game",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/nxrskyaa/rialoball",
    "liveLink": "https://github.com/nxrskyaa/rialoball",
    "builder": {
      "name": "nxrskyaa",
      "username": "nxrskyaa",
      "image": "https://avatars.githubusercontent.com/u/3919974?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Web3 Gaming & On-Chain Arcade"
  },
  {
    "title": "Rialo Up",
    "description": "Rialo ecosystem project",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/keleqaq123/rialo-up",
    "liveLink": "https://github.com/keleqaq123/rialo-up",
    "builder": {
      "name": "keleqaq123",
      "username": "keleqaq123",
      "image": "https://avatars.githubusercontent.com/u/161554673?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialhq Wallet",
    "description": "RialHQ - EVM Multi-Chain Wallet Extension for Rialo Ecosystem",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/Fatkhl/rialhq-wallet",
    "liveLink": "https://github.com/Fatkhl/rialhq-wallet",
    "builder": {
      "name": "Fatkhl",
      "username": "Fatkhl",
      "image": "https://avatars.githubusercontent.com/u/107779066?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialo Dapp",
    "description": "Rialo ecosystem project",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/koyan11/rialo-dapp",
    "liveLink": "https://rialo-dapp.vercel.app",
    "builder": {
      "name": "koyan11",
      "username": "koyan11",
      "image": "https://avatars.githubusercontent.com/u/116417093?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialohub NEW",
    "description": "Rialo ecosystem project",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/mahi017fr/Rialohub-NEW",
    "liveLink": "https://rialohub-new.vercel.app",
    "builder": {
      "name": "mahi017fr",
      "username": "mahi017fr",
      "image": "https://avatars.githubusercontent.com/u/204923718?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 15,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialo Pmm",
    "description": "rialo build ",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/ABDOZYREX/rialo-pmm",
    "liveLink": "https://abdozyrex.github.io/rialo-pmm/",
    "builder": {
      "name": "ABDOZYREX",
      "username": "ABDOZYREX",
      "image": "https://avatars.githubusercontent.com/u/191288680?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialo Dapp V2",
    "description": "Rialo ecosystem project",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/koyan11/rialo-dapp-v2",
    "liveLink": "https://rialo-dapp-v2.vercel.app",
    "builder": {
      "name": "koyan11",
      "username": "koyan11",
      "image": "https://avatars.githubusercontent.com/u/116417093?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Rialo Spars Game",
    "description": "Spars battle game built on Rialo network — on-chain PvP combat with async execution",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/SifatHossain456/Rialo-spars-game",
    "liveLink": "https://rialo-spars-game.vercel.app",
    "builder": {
      "name": "SifatHossain456",
      "username": "SifatHossain456",
      "image": "https://avatars.githubusercontent.com/u/53669494?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Web3 Gaming & On-Chain Arcade"
  },
  {
    "title": "Rialo Syncred",
    "description": "Async lending protocol demo on Goerli — Rialo-style deferred execution, collateral management, and async loan settlement",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/SifatHossain456/Rialo-Syncred",
    "liveLink": "https://rialo-syncred.vercel.app",
    "builder": {
      "name": "SifatHossain456",
      "username": "SifatHossain456",
      "image": "https://avatars.githubusercontent.com/u/53669494?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "DeFi, Prediction & Lending"
  },
  {
    "title": "Hello @everyone 📢",
    "description": "Hello @everyone 📢\nWelcome to Rialo! 💐\n\nRialo is the first full-stack network for real-world apps, bringing real users directly to real builders.\nWhy does it matter? Because today’s Web3 isn’t the future we were promised.\n\n**✨ It’s been:**\n\n- 16 years since digital scarcity on blockchains\n- 10 year",
    "category": [
      "Community dApp",
      "Game/Tooling"
    ],
    "gitRepo": "",
    "liveLink": "https://www.rialo.io/",
    "builder": {
      "name": "neyamulhadi",
      "username": "neyamulhadi",
      "image": "https://cdn.discordapp.com/avatars/465146664861040640/ffb5cf917edc9a9522e13689f001b2c2.png",
      "xLink": ""
    },
    "loves": 3,
    "views": 15,
    "isNew": true,
    "source": "Rialo Discord Community",
    "verified": true,
    "primarySector": "Web3 Gaming & On-Chain Arcade"
  },
  {
    "title": "<@862550907349893151>",
    "description": "<@862550907349893151> \nI made game, rialo puzzle vibe game, \nFor now only max lv5, i can up more LV.\n\nhttps://x.com/Wisnu100802/status/1978063455895597556\n\nhttps://khoerulwisnupirdaus.github.io/rialo-puzzle/\n\npreviously had a bug, then we talked with <@1055977815742349373>, we discussed it together ",
    "category": [
      "Community dApp",
      "Game/Tooling"
    ],
    "gitRepo": "",
    "liveLink": "https://khoerulwisnupirdaus.github.io/rialo-puzzle/",
    "builder": {
      "name": "wzscarlet",
      "username": "wzscarlet",
      "image": "https://cdn.discordapp.com/avatars/917077549052489738/8855cb1a6f0e1e89cb5e949e3401dd79.png",
      "xLink": ""
    },
    "loves": 3,
    "views": 15,
    "isNew": true,
    "source": "Rialo Discord Community",
    "verified": true,
    "primarySector": "Web3 Gaming & On-Chain Arcade"
  },
  {
    "title": "Hello <@862550907349893151> <@302388310142353410>",
    "description": "Hello <@862550907349893151> <@302388310142353410> \nI made a mini game using HTML, CSS and Javascript for the Rialo community and I was inspired by space shooter galaxy attack.please take a look and try playing  \n\ngithub (Open Source) : https://iddesot.github.io/Rialo-Shooter---Defend-the-Future/\n\nx ",
    "category": [
      "Community dApp",
      "Game/Tooling"
    ],
    "gitRepo": "",
    "liveLink": "https://iddesot.github.io/Rialo-Shooter---Defend-the-Future/",
    "builder": {
      "name": "bitcoinanalytisc",
      "username": "bitcoinanalytisc",
      "image": "https://cdn.discordapp.com/avatars/717268254841765918/e96ccfe59cf9400fc592599c73b5144f.png",
      "xLink": ""
    },
    "loves": 3,
    "views": 15,
    "isNew": true,
    "source": "Rialo Discord Community",
    "verified": true,
    "primarySector": "Web3 Gaming & On-Chain Arcade"
  },
  {
    "title": "Rialo Ecosystem Project",
    "description": "https://x.com/AyushSingh3291/status/1978041220707361103?t=M6wG686_flACcJmMlI44tw&s=19\n\nCreated a Flap game for Rialo fam \n\nGame link: https://yaaas32.github.io/Rialoflap/\n\n<@862550907349893151> \nPlease check ser!",
    "category": [
      "Community dApp",
      "Game/Tooling"
    ],
    "gitRepo": "",
    "liveLink": "https://yaaas32.github.io/Rialoflap/",
    "builder": {
      "name": "ayushkumar0437",
      "username": "ayushkumar0437",
      "image": "https://cdn.discordapp.com/avatars/1140241931654418532/5e6821cb8fbe36ac44eaacd91814bb9b.png",
      "xLink": ""
    },
    "loves": 3,
    "views": 15,
    "isNew": true,
    "source": "Rialo Discord Community",
    "verified": true,
    "primarySector": "Web3 Gaming & On-Chain Arcade"
  },
  {
    "title": "Rialo Website",
    "description": "Rialo is a next-gen blockchain by Subzero Labs, built to connect Web2 and Web3 with event-driven smart contracts. It enables fast, secure, and real-world data integration, offering Web2-like speed, social identity login, and VM compatibility for seamless decentralized applications.",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/Mrcredible909/Rialo-website",
    "liveLink": "https://github.com/Mrcredible909/Rialo-website",
    "builder": {
      "name": "Mrcredible909",
      "username": "Mrcredible909",
      "image": "https://avatars.githubusercontent.com/u/205922861?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Wallets, Identity & Bridges"
  },
  {
    "title": "Rialo Verse",
    "description": "Rialo Portal is your gateway to the next era of blockchain. Powered by Rialo’s event-driven smart contracts and Web2 integration, this website showcases the vision, features, and roadmap of the network.",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/Mrcredible909/Rialo-verse",
    "liveLink": "https://github.com/Mrcredible909/Rialo-verse",
    "builder": {
      "name": "Mrcredible909",
      "username": "Mrcredible909",
      "image": "https://avatars.githubusercontent.com/u/205922861?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Fusion Gateway",
    "description": "A modular framework for the Rialo blockchain that enables smart contracts to connect with real-world data from any HTTPS-based API.",
    "category": [
      "blockchain",
      "defi",
      "foundry",
      "nft",
      "oracle",
      "rialo",
      "solidity"
    ],
    "gitRepo": "https://github.com/Huawei123r/fusion-gateway",
    "liveLink": "https://github.com/Huawei123r/fusion-gateway",
    "builder": {
      "name": "Huawei123r",
      "username": "Huawei123r",
      "image": "https://avatars.githubusercontent.com/u/195354465?v=4",
      "xLink": ""
    },
    "loves": 2,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "DeFi, Prediction & Lending"
  },
  {
    "title": "Rialo Demo Dapp",
    "description": "Rialo ecosystem project",
    "category": [
      "Tooling",
      "AI Agent"
    ],
    "gitRepo": "https://github.com/Fatkhl/rialo-demo-dapp",
    "liveLink": "https://rialo-shooter.vercel.app",
    "builder": {
      "name": "Fatkhl",
      "username": "Fatkhl",
      "image": "https://avatars.githubusercontent.com/u/107779066?v=4",
      "xLink": ""
    },
    "loves": 1,
    "views": 5,
    "isNew": true,
    "source": "GitHub Testnet Crawler (August 2026)",
    "verified": true,
    "primarySector": "Developer SDKs & Tooling"
  },
  {
    "title": "Im made mini game escape from orca",
    "description": "Im made mini game escape from orca\n\nkindly check please <@862550907349893151> , <@740494723080388638> , <@953512127983915009> \n\nhttps://x.com/Rickstrife08/status/1977768224143048780\n\ndeployment link on X\n\nrepository https://github.com/Rickstrifes/Rialo",
    "category": [
      "Community dApp",
      "Game/Tooling"
    ],
    "gitRepo": "https://github.com/Rickstrifes/Rialo",
    "liveLink": "https://github.com/Rickstrifes/Rialo",
    "builder": {
      "name": "rickstrife",
      "username": "rickstrife",
      "image": "https://cdn.discordapp.com/avatars/303027825143840768/d0306207b93dc15c42f00349cf8d0b0c.png",
      "xLink": ""
    },
    "loves": 3,
    "views": 15,
    "isNew": true,
    "source": "Rialo Discord Community",
    "verified": true,
    "primarySector": "Web3 Gaming & On-Chain Arcade"
  },
  {
    "title": "Minimalist Tile Puzzle Game",
    "description": "hey guys. i create a minimalist tile puzzle game to assemble the RIALO logo. you can fork if you want to make your own version\n\nGithub: https://github.com/xyzsola/rialo-puzzle-game\nX Post: https://x.com/solasidoXYZ/status/1977987484559814779\n\nkindly check or you can play it <@740494723080388638> <@9",
    "category": [
      "Community dApp",
      "Game/Tooling"
    ],
    "gitRepo": "",
    "liveLink": "https://github.com/xyzsola/rialo-puzzle-game",
    "builder": {
      "name": "solaxyz",
      "username": "solaxyz",
      "image": "https://cdn.discordapp.com/avatars/1251844685773803593/1277a0679688e70ab4e5dc4c48bafaed.png",
      "xLink": ""
    },
    "loves": 3,
    "views": 15,
    "isNew": true,
    "source": "Rialo Discord Community",
    "verified": true,
    "primarySector": "Web3 Gaming & On-Chain Arcade"
  },
  {
    "title": "Here’s the link to the repositories",
    "description": "Here’s the link to the repositories https://github.com/0xQayyum/Rialo",
    "category": [
      "Community dApp",
      "Game/Tooling"
    ],
    "gitRepo": "",
    "liveLink": "https://github.com/0xQayyum/Rialo",
    "builder": {
      "name": "0xxabdul",
      "username": "0xxabdul",
      "image": "https://cdn.discordapp.com/avatars/828397810814025748/dd312dc7f748f0642c8af73bd4f5e341.png",
      "xLink": ""
    },
    "loves": 3,
    "views": 15,
    "isNew": true,
    "source": "Rialo Discord Community",
    "verified": true,
    "primarySector": "Web3 Gaming & On-Chain Arcade"
  },
  {
    "title": "I Created a Game for Rialo 😊",
    "description": "I Created a Game for Rialo 😊 \nRialo Rush brings utility and fun together, a new way to experience crypto gaming. it’s about belonging to a community that runs together. 💙\n\nGame Link: https://valoto2.github.io/RialoRush/\nRepo Link: https://github.com/valoto2/RialoRush\nI posted on X, Please Check ou",
    "category": [
      "Community dApp",
      "Game/Tooling"
    ],
    "gitRepo": "",
    "liveLink": "https://valoto2.github.io/RialoRush/",
    "builder": {
      "name": "valotoo2.0_79318",
      "username": "valotoo2.0_79318",
      "image": "https://cdn.discordapp.com/avatars/1278597695870730283/c7bc5863115c19d5cb99ea60e8422c76.png",
      "xLink": ""
    },
    "loves": 3,
    "views": 15,
    "isNew": true,
    "source": "Rialo Discord Community",
    "verified": true,
    "primarySector": "Web3 Gaming & On-Chain Arcade"
  },
  {
    "title": "Rialo Space Quest",
    "description": "Been exploring Rialo’s world and couldn’t resist building my own version of Rialo Space Quest 🚀\n\nInspired by the Coordination Layer — smoother gameplay, fresh visuals, and pure community energy!\n\nPlay game:- https://ashokakb000.github.io/rialouniverse/\nGithub:-https://github.com/Ashokakb000/rialoun",
    "category": [
      "Community dApp",
      "Game/Tooling"
    ],
    "gitRepo": "",
    "liveLink": "https://ashokakb000.github.io/rialouniverse/",
    "builder": {
      "name": "ashok000",
      "username": "ashok000",
      "image": "https://cdn.discordapp.com/avatars/1038655567318761513/bbad6e87bca378929bc8231c3cdc5b51.png",
      "xLink": ""
    },
    "loves": 3,
    "views": 15,
    "isNew": true,
    "source": "Rialo Discord Community",
    "verified": true,
    "primarySector": "Web3 Gaming & On-Chain Arcade"
  }
];
}

if (typeof document !== "undefined") {
  function initApp() {
    allProjects = getSeedFallbackData();
    filteredProjects = allProjects.slice();
    renderAllViews();
    var hash = window.location.hash.replace("#", "");
    if (hash && document.getElementById("page-" + hash)) {
      navigateTo(hash);
    } else {
      navigateTo("home");
    }
    window.addEventListener("hashchange", function() {
      var h = window.location.hash.replace("#", "");
      if (h && document.getElementById("page-" + h)) {
        navigateTo(h);
      }
    });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
  } else {
    initApp();
  }
}

function renderLeaderboard() { renderLeaderboardView(); }


// ══════════════════════════════════════════════════════
// HISTORICAL WINNERS DATA ENGINE (SHARK TANK & QUIZ)
// ══════════════════════════════════════════════════════

var sharkTankHistory = [
  {
    edition: "Edition #3",
    date: "August 18, 2026",
    winnerName: "Just Jena",
    handle: "@kirahell69",
    projectName: "RialOS - The Agent Desktop",
    projectUrl: "https://rialos.vercel.app/",
    avatar: "assets/avatars/just_jena.png",
    bgClass: "from-white via-[#FAF9F5] to-emerald-50/50 border-brand-pine/30",
    description: "The autonomous operating system for payroll, credit, and investing on Rialo L1, running automatically on-chain with zero intermediaries.",
    badge: "🏆 Discord Stage Pitch Winner",
    isLatest: true
  },
  {
    edition: "Edition #2",
    date: "August 4, 2026",
    winnerName: "Elias",
    handle: "@eliasskun",
    projectName: "Rialo Agent Vault",
    projectUrl: "",
    avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=eliasskun",
    bgClass: "from-white via-[#FAF9F5] to-blue-50/50 border-blue-500/30",
    description: "Autonomous smart contract vault protocol for automated liquidity management and yield optimization on Rialo.",
    badge: "🏆 Shark Tank Winner",
    isLatest: false
  },
  {
    edition: "Edition #1",
    date: "July 20, 2026",
    winnerName: "Vika Joestar",
    handle: "@vikajoestar",
    projectName: "CyberRialo Combat Arena",
    projectUrl: "",
    avatar: "https://api.dicebear.com/7.x/identicon/svg?seed=vikajoestar",
    bgClass: "from-white via-[#FAF9F5] to-purple-50/50 border-purple-500/30",
    description: "Tactical PvP battle arena game featuring on-chain agent combat settlement and instantaneous 0.4s match finality.",
    badge: "🏆 Shark Tank Winner",
    isLatest: false
  }
];

var currentSharkTankIndex = 0;

function renderSharkTankCard() {
  var data = sharkTankHistory[currentSharkTankIndex];
  var cardContainer = document.getElementById("sharkTankCardContainer");
  if (!cardContainer) return;

  var isFirst = currentSharkTankIndex === 0;
  var isLast = currentSharkTankIndex === sharkTankHistory.length - 1;

  var projectUrlBtn = data.projectUrl ? 
    "<a href=\"" + data.projectUrl + "\" target=\"_blank\" rel=\"noopener\" class=\"px-4 py-2 rounded-xl bg-[#205446] hover:bg-[#184237] active:scale-95 text-white text-xs font-bold font-mono transition-all flex items-center gap-1.5 shadow-sm\">" +
      "<span>Open Live App</span>" +
      "<span class=\"text-xs\">↗</span>" +
    "</a>" : "";

  cardContainer.innerHTML = 
    "<div class=\"flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/[0.08] pb-3.5\">" +
      "<div class=\"flex items-center gap-3\">" +
        "<div class=\"w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-base shadow-sm\">🏆</div>" +
        "<div>" +
          "<div class=\"flex items-center gap-2\">" +
            "<h3 class=\"text-base font-extrabold text-brand-text\">Shark Tank Pitch Winner</h3>" +
            "<span class=\"text-xs font-mono font-bold bg-amber-100/80 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-200/60\">📅 " + data.date + "</span>" +
            (data.isLatest ? "<span class=\"text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200\">LATEST</span>" : "") +
          "</div>" +
          "<p class=\"text-[11px] text-black/60 font-mono mt-0.5\">Winner of the Rialo Discord Stage live community pitch competition</p>" +
        "</div>" +
      "</div>" +
      "<div class=\"flex items-center gap-2 self-start sm:self-auto\">" +
        "<button onclick=\"prevSharkTank()\" " + (isLast ? "disabled" : "") + " class=\"px-3 py-1.5 rounded-xl border border-black/10 flex items-center gap-1.5 text-xs font-mono font-bold transition-all " + (isLast ? "opacity-30 cursor-not-allowed bg-black/[0.02] text-black/40" : "bg-white hover:bg-black/5 active:scale-95 text-brand-text shadow-sm") + "\" title=\"Previous Edition\">" +
          "<span>← Prev Date</span>" +
        "</button>" +
        "<span class=\"text-xs font-mono font-bold text-black/50 px-1\">" + (currentSharkTankIndex + 1) + " / " + sharkTankHistory.length + "</span>" +
        "<button onclick=\"nextSharkTank()\" " + (isFirst ? "disabled" : "") + " class=\"px-3 py-1.5 rounded-xl border border-black/10 flex items-center gap-1.5 text-xs font-mono font-bold transition-all " + (isFirst ? "opacity-30 cursor-not-allowed bg-black/[0.02] text-black/40" : "bg-white hover:bg-black/5 active:scale-95 text-brand-text shadow-sm") + "\" title=\"Next Edition\">" +
          "<span>Next Date →</span>" +
        "</button>" +
      "</div>" +
    "</div>" +

    "<div class=\"p-5 rounded-2xl bg-gradient-to-r " + data.bgClass + " border border-black/[0.08] flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-sm transition-all\">" +
      "<div class=\"flex items-center gap-4\">" +
        "<div class=\"relative\">" +
          "<img src=\"" + data.avatar + "\" alt=\"" + escapeHtml(data.winnerName) + "\" class=\"w-16 h-16 rounded-full border-2 border-brand-pine/40 shadow-sm object-cover bg-slate-900\" onerror=\"this.src='https://api.dicebear.com/7.x/identicon/svg?seed=" + encodeURIComponent(data.winnerName) + "'\" />" +
          "<div class=\"absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-amber-400 text-amber-950 flex items-center justify-center text-xs font-bold border border-white shadow-sm\" title=\"Pitch Champion\">👑</div>" +
        "</div>" +
        "<div class=\"space-y-1\">" +
          "<div class=\"flex items-center gap-2\">" +
            "<h4 class=\"text-base font-extrabold text-brand-text\">" + escapeHtml(data.projectName) + "</h4>" +
            "<span class=\"text-[11px] font-mono font-bold px-2.5 py-0.5 bg-[#205446]/10 text-[#205446] rounded-full border border-[#205446]/20\">" + escapeHtml(data.badge) + "</span>" +
          "</div>" +
          "<div class=\"text-xs text-black/70 font-mono\">" +
            "<span>Pitcher: </span><strong class=\"text-brand-text\">" + escapeHtml(data.winnerName) + "</strong> <span class=\"text-slate-500 font-mono text-[11px]\">(" + escapeHtml(data.handle) + ")</span>" +
          "</div>" +
          "<p class=\"text-xs text-black/70 leading-relaxed max-w-xl pt-0.5\">" + escapeHtml(data.description) + "</p>" +
        "</div>" +
      "</div>" +
      "<div class=\"flex flex-wrap items-center gap-2.5 self-start md:self-auto\">" +
        projectUrlBtn +
      "</div>" +
    "</div>";
}

function prevSharkTank() {
  if (currentSharkTankIndex < sharkTankHistory.length - 1) {
    currentSharkTankIndex++;
    renderSharkTankCard();
  }
}

function nextSharkTank() {
  if (currentSharkTankIndex > 0) {
    currentSharkTankIndex--;
    renderSharkTankCard();
  }
}


var quizHistory = [
  {
    "date": "August 28, 2026",
    "attestedBy": "@Rollins in #quiz",
    "participants": "195+ Active Participants",
    "isLatest": true,
    "champions": [
      {
        "rank": 1,
        "medal": "🥇",
        "name": "@khalid | Rialo",
        "tag": "Rank 1",
        "isTop": true
      },
      {
        "rank": 2,
        "medal": "🥈",
        "name": "@Hasinur | Rialo",
        "tag": "Rank 2",
        "isTop": true
      },
      {
        "rank": 3,
        "medal": "🥉",
        "name": "@Sojibjaber1",
        "tag": "Rank 3",
        "isTop": true
      },
      {
        "rank": 4,
        "medal": "🎖️",
        "name": "@Grimm",
        "tag": "Rank 4",
        "isTop": false
      },
      {
        "rank": 5,
        "medal": "🎖️",
        "name": "@Lueguo",
        "tag": "Rank 5",
        "isTop": false
      },
      {
        "rank": 6,
        "medal": "🎖️",
        "name": "@Yash",
        "tag": "Rank 6",
        "isTop": false
      },
      {
        "rank": 7,
        "medal": "🎖️",
        "name": "@LastExam",
        "tag": "Rank 7",
        "isTop": false
      },
      {
        "rank": 8,
        "medal": "🎖️",
        "name": "@Shin vN",
        "tag": "Rank 8",
        "isTop": false
      },
      {
        "rank": 9,
        "medal": "🎖️",
        "name": "@vangle",
        "tag": "Rank 9",
        "isTop": false
      },
      {
        "rank": 10,
        "medal": "🎖️",
        "name": "@midmintmick!!!",
        "tag": "Rank 10",
        "isTop": false
      }
    ]
  },
  {
    "date": "August 21, 2026",
    "attestedBy": "@Rollins in #quiz",
    "participants": "180+ Active Participants",
    "isLatest": false,
    "champions": [
      {
        "rank": 1,
        "medal": "🥇",
        "name": "@Siyam AHMED",
        "tag": "Rank 1",
        "isTop": true
      },
      {
        "rank": 2,
        "medal": "🥈",
        "name": "@Ranjay",
        "tag": "Rank 2",
        "isTop": true
      },
      {
        "rank": 3,
        "medal": "🥉",
        "name": "@shaking",
        "tag": "Rank 3",
        "isTop": true
      },
      {
        "rank": 4,
        "medal": "🎖️",
        "name": "@Rial/bleidd",
        "tag": "Rank 4",
        "isTop": false
      },
      {
        "rank": 5,
        "medal": "🎖️",
        "name": "@vangle",
        "tag": "Rank 5",
        "isTop": false
      },
      {
        "rank": 6,
        "medal": "🎖️",
        "name": "@Lueguo",
        "tag": "Rank 6",
        "isTop": false
      },
      {
        "rank": 7,
        "medal": "🎖️",
        "name": "@Shin vn",
        "tag": "Rank 7",
        "isTop": false
      },
      {
        "rank": 8,
        "medal": "🎖️",
        "name": "@LastExam",
        "tag": "Rank 8",
        "isTop": false
      },
      {
        "rank": 9,
        "medal": "🎖️",
        "name": "@NathBabu",
        "tag": "Rank 9",
        "isTop": false
      },
      {
        "rank": 10,
        "medal": "🎖️",
        "name": "@Hun-Jun-Suk",
        "tag": "Rank 10",
        "isTop": false
      }
    ]
  },
  {
    "date": "August 14, 2026",
    "attestedBy": "@Rollins in #quiz",
    "participants": "175+ Active Participants",
    "isLatest": false,
    "champions": [
      {
        "rank": 1,
        "medal": "🥇",
        "name": "@Rahma",
        "tag": "Rank 1",
        "isTop": true
      },
      {
        "rank": 2,
        "medal": "🥈",
        "name": "@won",
        "tag": "Rank 2",
        "isTop": true
      },
      {
        "rank": 3,
        "medal": "🥉",
        "name": "@Em3rald",
        "tag": "Rank 3",
        "isTop": true
      },
      {
        "rank": 4,
        "medal": "🎖️",
        "name": "@JASMINE",
        "tag": "Rank 4",
        "isTop": false
      },
      {
        "rank": 5,
        "medal": "🎖️",
        "name": "@BitsyBae",
        "tag": "Rank 5",
        "isTop": false
      },
      {
        "rank": 6,
        "medal": "🎖️",
        "name": "@Iconic | Latch",
        "tag": "Rank 6",
        "isTop": false
      },
      {
        "rank": 7,
        "medal": "🎖️",
        "name": "@Lueguo",
        "tag": "Rank 7",
        "isTop": false
      },
      {
        "rank": 8,
        "medal": "🎖️",
        "name": "@shaking",
        "tag": "Rank 8",
        "isTop": false
      },
      {
        "rank": 9,
        "medal": "🎖️",
        "name": "@Ceejay",
        "tag": "Rank 9",
        "isTop": false
      },
      {
        "rank": 10,
        "medal": "🎖️",
        "name": "@GROWCHAIN",
        "tag": "Rank 10",
        "isTop": false
      }
    ]
  },
  {
    "date": "August 7, 2026",
    "attestedBy": "@Rollins in #quiz",
    "participants": "170+ Active Participants",
    "isLatest": false,
    "champions": [
      {
        "rank": 1,
        "medal": "🥇",
        "name": "@esek serhat",
        "tag": "Rank 1",
        "isTop": true
      },
      {
        "rank": 2,
        "medal": "🥈",
        "name": "@Nabori | Rialo💚",
        "tag": "Rank 2",
        "isTop": true
      },
      {
        "rank": 3,
        "medal": "🥉",
        "name": "@won",
        "tag": "Rank 3",
        "isTop": true
      },
      {
        "rank": 4,
        "medal": "🎖️",
        "name": "@Nayem",
        "tag": "Rank 4",
        "isTop": false
      },
      {
        "rank": 5,
        "medal": "🎖️",
        "name": "@alice-Rialo—未来可期",
        "tag": "Rank 5",
        "isTop": false
      },
      {
        "rank": 6,
        "medal": "🎖️",
        "name": "@vinhthui2005",
        "tag": "Rank 6",
        "isTop": false
      },
      {
        "rank": 7,
        "medal": "🎖️",
        "name": "@Koray-Rialo",
        "tag": "Rank 7",
        "isTop": false
      },
      {
        "rank": 8,
        "medal": "🎖️",
        "name": "@Baster",
        "tag": "Rank 8",
        "isTop": false
      },
      {
        "rank": 9,
        "medal": "🎖️",
        "name": "@CHEN",
        "tag": "Rank 9",
        "isTop": false
      },
      {
        "rank": 10,
        "medal": "🎖️",
        "name": "@haisen",
        "tag": "Rank 10",
        "isTop": false
      }
    ]
  },
  {
    "date": "July 31, 2026",
    "attestedBy": "@Rollins in #quiz",
    "participants": "165+ Active Participants",
    "isLatest": false,
    "champions": [
      {
        "rank": 1,
        "medal": "🥇",
        "name": "@白茶丨Rialo保安大队双花红棍",
        "tag": "Rank 1",
        "isTop": true
      },
      {
        "rank": 2,
        "medal": "🥈",
        "name": "@haisen",
        "tag": "Rank 2",
        "isTop": true
      },
      {
        "rank": 3,
        "medal": "🥉",
        "name": "@Ranjay",
        "tag": "Rank 3",
        "isTop": true
      },
      {
        "rank": 4,
        "medal": "🎖️",
        "name": "@Shizuka",
        "tag": "Rank 4",
        "isTop": false
      },
      {
        "rank": 5,
        "medal": "🎖️",
        "name": "@Fay",
        "tag": "Rank 5",
        "isTop": false
      },
      {
        "rank": 6,
        "medal": "🎖️",
        "name": "@Adᥱ́ᥕᥲ́ᥣᥱ́ 👑",
        "tag": "Rank 6",
        "isTop": false
      },
      {
        "rank": 7,
        "medal": "🎖️",
        "name": "@Lueguo",
        "tag": "Rank 7",
        "isTop": false
      },
      {
        "rank": 8,
        "medal": "🎖️",
        "name": "@CreativeCat",
        "tag": "Rank 8",
        "isTop": false
      },
      {
        "rank": 9,
        "medal": "🎖️",
        "name": "@BitsyBae",
        "tag": "Rank 9",
        "isTop": false
      },
      {
        "rank": 10,
        "medal": "🎖️",
        "name": "@Yash",
        "tag": "Rank 10",
        "isTop": false
      }
    ]
  },
  {
    "date": "July 24, 2026",
    "attestedBy": "@Rollins in #quiz",
    "participants": "160+ Active Participants",
    "isLatest": false,
    "champions": [
      {
        "rank": 1,
        "medal": "🥇",
        "name": "@JASMINE",
        "tag": "Rank 1",
        "isTop": true
      },
      {
        "rank": 2,
        "medal": "🥈",
        "name": "@Lueguo",
        "tag": "Rank 2",
        "isTop": true
      },
      {
        "rank": 3,
        "medal": "🥉",
        "name": "@vangle",
        "tag": "Rank 3",
        "isTop": true
      },
      {
        "rank": 4,
        "medal": "🎖️",
        "name": "@DebeliqM",
        "tag": "Rank 4",
        "isTop": false
      },
      {
        "rank": 5,
        "medal": "🎖️",
        "name": "@MeMe",
        "tag": "Rank 5",
        "isTop": false
      },
      {
        "rank": 6,
        "medal": "🎖️",
        "name": "@d",
        "tag": "Rank 6",
        "isTop": false
      },
      {
        "rank": 7,
        "medal": "🎖️",
        "name": "@Maharshi",
        "tag": "Rank 7",
        "isTop": false
      },
      {
        "rank": 8,
        "medal": "🎖️",
        "name": "@Grimm 2",
        "tag": "Rank 8",
        "isTop": false
      },
      {
        "rank": 9,
        "medal": "🎖️",
        "name": "@𝗠𝗔𝗛𝗘 | 🇧🇩",
        "tag": "Rank 9",
        "isTop": false
      },
      {
        "rank": 10,
        "medal": "🎖️",
        "name": "@Rahma",
        "tag": "Rank 10",
        "isTop": false
      }
    ]
  },
  {
    "date": "July 17, 2026",
    "attestedBy": "@Rollins in #quiz",
    "participants": "155+ Active Participants",
    "isLatest": false,
    "champions": [
      {
        "rank": 1,
        "medal": "🥇",
        "name": "@Rebirth",
        "tag": "Rank 1",
        "isTop": true
      },
      {
        "rank": 2,
        "medal": "🥈",
        "name": "@JASMINE",
        "tag": "Rank 2",
        "isTop": true
      },
      {
        "rank": 3,
        "medal": "🥉",
        "name": "@MeMe",
        "tag": "Rank 3",
        "isTop": true
      },
      {
        "rank": 4,
        "medal": "🎖️",
        "name": "@d",
        "tag": "Rank 4",
        "isTop": false
      },
      {
        "rank": 5,
        "medal": "🎖️",
        "name": "@Testnetnodes I RiaLo",
        "tag": "Rank 5",
        "isTop": false
      },
      {
        "rank": 6,
        "medal": "🎖️",
        "name": "@Kingsleypremus",
        "tag": "Rank 6",
        "isTop": false
      },
      {
        "rank": 7,
        "medal": "🎖️",
        "name": "@RitaCryptoTips",
        "tag": "Rank 7",
        "isTop": false
      },
      {
        "rank": 8,
        "medal": "🎖️",
        "name": "@yida/ Rialo保安大队之夜班保安",
        "tag": "Rank 8",
        "isTop": false
      },
      {
        "rank": 9,
        "medal": "🎖️",
        "name": "@Haykeenz",
        "tag": "Rank 9",
        "isTop": false
      },
      {
        "rank": 10,
        "medal": "🎖️",
        "name": "@KingCobra",
        "tag": "Rank 10",
        "isTop": false
      }
    ]
  },
  {
    "date": "July 10, 2026",
    "attestedBy": "@Rollins in #quiz",
    "participants": "150+ Active Participants",
    "isLatest": false,
    "champions": [
      {
        "rank": 1,
        "medal": "🥇",
        "name": "@Em3rald",
        "tag": "Rank 1",
        "isTop": true
      },
      {
        "rank": 2,
        "medal": "🥈",
        "name": "@midmintmick!!!🤐",
        "tag": "Rank 2",
        "isTop": true
      },
      {
        "rank": 3,
        "medal": "🥉",
        "name": "@rivale",
        "tag": "Rank 3",
        "isTop": true
      },
      {
        "rank": 4,
        "medal": "🎖️",
        "name": "@vita5000 | 리알로와 사는 비타",
        "tag": "Rank 4",
        "isTop": false
      },
      {
        "rank": 5,
        "medal": "🎖️",
        "name": "@atik.eth",
        "tag": "Rank 5",
        "isTop": false
      },
      {
        "rank": 6,
        "medal": "🎖️",
        "name": "@-Marsu  |  Rialo 🌿",
        "tag": "Rank 6",
        "isTop": false
      },
      {
        "rank": 7,
        "medal": "🎖️",
        "name": "@Testnetnodes I RiaLo",
        "tag": "Rank 7",
        "isTop": false
      },
      {
        "rank": 8,
        "medal": "🎖️",
        "name": "@JUST-ABDO",
        "tag": "Rank 8",
        "isTop": false
      },
      {
        "rank": 9,
        "medal": "🎖️",
        "name": "@!𝟘𝕩𝕍𝕚𝕜𝕒𝕁𝕠𝕖𝕤𝕥𝕒𝕣",
        "tag": "Rank 9",
        "isTop": false
      },
      {
        "rank": 10,
        "medal": "🎖️",
        "name": "@Adᥱ́ᥕᥲ́ᥣᥱ́ 👑",
        "tag": "Rank 10",
        "isTop": false
      }
    ]
  },
  {
    "date": "July 3, 2026",
    "attestedBy": "@Rollins in #quiz",
    "participants": "145+ Active Participants",
    "isLatest": false,
    "champions": [
      {
        "rank": 1,
        "medal": "🥇",
        "name": "@rivale",
        "tag": "Rank 1",
        "isTop": true
      },
      {
        "rank": 2,
        "medal": "🥈",
        "name": "@-Marsu  |  Rialo 🌿",
        "tag": "Rank 2",
        "isTop": true
      },
      {
        "rank": 3,
        "medal": "🥉",
        "name": "@JASMINE",
        "tag": "Rank 3",
        "isTop": true
      },
      {
        "rank": 4,
        "medal": "🎖️",
        "name": "@lite",
        "tag": "Rank 4",
        "isTop": false
      },
      {
        "rank": 5,
        "medal": "🎖️",
        "name": "@Li TEiNo",
        "tag": "Rank 5",
        "isTop": false
      },
      {
        "rank": 6,
        "medal": "🎖️",
        "name": "@vangle",
        "tag": "Rank 6",
        "isTop": false
      },
      {
        "rank": 7,
        "medal": "🎖️",
        "name": "@vita5000 | 리알로와 사는 비타",
        "tag": "Rank 7",
        "isTop": false
      },
      {
        "rank": 8,
        "medal": "🎖️",
        "name": "@0xwenwen | Rialo准时睡觉组组长",
        "tag": "Rank 8",
        "isTop": false
      },
      {
        "rank": 9,
        "medal": "🎖️",
        "name": "@Guynextdooooor",
        "tag": "Rank 9",
        "isTop": false
      },
      {
        "rank": 10,
        "medal": "🎖️",
        "name": "@NEO",
        "tag": "Rank 10",
        "isTop": false
      }
    ]
  },
  {
    "date": "June 26, 2026",
    "attestedBy": "@Rollins in #quiz",
    "participants": "140+ Active Participants",
    "isLatest": false,
    "champions": [
      {
        "rank": 1,
        "medal": "🥇",
        "name": "@won",
        "tag": "Rank 1",
        "isTop": true
      },
      {
        "rank": 2,
        "medal": "🥈",
        "name": "@alice-Rialo—未来可期",
        "tag": "Rank 2",
        "isTop": true
      },
      {
        "rank": 3,
        "medal": "🥉",
        "name": "@TinkyViki",
        "tag": "Rank 3",
        "isTop": true
      },
      {
        "rank": 4,
        "medal": "🎖️",
        "name": "@PAPITO",
        "tag": "Rank 4",
        "isTop": false
      },
      {
        "rank": 5,
        "medal": "🎖️",
        "name": "@Ohlamzz🫠",
        "tag": "Rank 5",
        "isTop": false
      },
      {
        "rank": 6,
        "medal": "🎖️",
        "name": "@nixx66",
        "tag": "Rank 6",
        "isTop": false
      },
      {
        "rank": 7,
        "medal": "🎖️",
        "name": "@开牌见朕",
        "tag": "Rank 7",
        "isTop": false
      },
      {
        "rank": 8,
        "medal": "🎖️",
        "name": "@Haykeenz",
        "tag": "Rank 8",
        "isTop": false
      },
      {
        "rank": 9,
        "medal": "🎖️",
        "name": "@LastExam",
        "tag": "Rank 9",
        "isTop": false
      },
      {
        "rank": 10,
        "medal": "🎖️",
        "name": "@Guynextdooooor",
        "tag": "Rank 10",
        "isTop": false
      }
    ]
  },
  {
    "date": "June 19, 2026",
    "attestedBy": "@Rollins in #quiz",
    "participants": "140+ Active Participants",
    "isLatest": false,
    "champions": [
      {
        "rank": 1,
        "medal": "🥇",
        "name": "@YiĞiT",
        "tag": "Rank 1",
        "isTop": true
      },
      {
        "rank": 2,
        "medal": "🥈",
        "name": "@Rialo Queen of Cheese.",
        "tag": "Rank 2",
        "isTop": true
      },
      {
        "rank": 3,
        "medal": "🥉",
        "name": "@MeMe",
        "tag": "Rank 3",
        "isTop": true
      },
      {
        "rank": 4,
        "medal": "🎖️",
        "name": "@JASMINE",
        "tag": "Rank 4",
        "isTop": false
      },
      {
        "rank": 5,
        "medal": "🎖️",
        "name": "@lite",
        "tag": "Rank 5",
        "isTop": false
      },
      {
        "rank": 6,
        "medal": "🎖️",
        "name": "@vita5000 | 리알로와 사는 비타",
        "tag": "Rank 6",
        "isTop": false
      },
      {
        "rank": 7,
        "medal": "🎖️",
        "name": "@0xwenwen | Rialo准时睡觉组组长",
        "tag": "Rank 7",
        "isTop": false
      },
      {
        "rank": 8,
        "medal": "🎖️",
        "name": "@Li TEiNo",
        "tag": "Rank 8",
        "isTop": false
      },
      {
        "rank": 9,
        "medal": "🎖️",
        "name": "@SpecialForces",
        "tag": "Rank 9",
        "isTop": false
      },
      {
        "rank": 10,
        "medal": "🎖️",
        "name": "@Grimm",
        "tag": "Rank 10",
        "isTop": false
      }
    ]
  },
  {
    "date": "June 12, 2026",
    "attestedBy": "@Rollins in #quiz",
    "participants": "135+ Active Participants",
    "isLatest": false,
    "champions": [
      {
        "rank": 1,
        "medal": "🥇",
        "name": "@SuperPio",
        "tag": "Rank 1",
        "isTop": true
      },
      {
        "rank": 2,
        "medal": "🥈",
        "name": "@🦋⃟Bluberrry (❖,❖)",
        "tag": "Rank 2",
        "isTop": true
      },
      {
        "rank": 3,
        "medal": "🥉",
        "name": "@Jeyromeeee",
        "tag": "Rank 3",
        "isTop": true
      },
      {
        "rank": 4,
        "medal": "🎖️",
        "name": "@Fay",
        "tag": "Rank 4",
        "isTop": false
      },
      {
        "rank": 5,
        "medal": "🎖️",
        "name": "@Seloly /ttkx",
        "tag": "Rank 5",
        "isTop": false
      },
      {
        "rank": 6,
        "medal": "🎖️",
        "name": "@Ishu | 🇵🇰",
        "tag": "Rank 6",
        "isTop": false
      },
      {
        "rank": 7,
        "medal": "🎖️",
        "name": "@I am тнє єи∂亗",
        "tag": "Rank 7",
        "isTop": false
      },
      {
        "rank": 8,
        "medal": "🎖️",
        "name": "@yida/ Rialo保安大队之夜班保安",
        "tag": "Rank 8",
        "isTop": false
      },
      {
        "rank": 9,
        "medal": "🎖️",
        "name": "@DoLuong",
        "tag": "Rank 9",
        "isTop": false
      },
      {
        "rank": 10,
        "medal": "🎖️",
        "name": "@Tendi",
        "tag": "Rank 10",
        "isTop": false
      }
    ]
  },
  {
    "date": "June 5, 2026",
    "attestedBy": "@Rollins in #quiz",
    "participants": "130+ Active Participants",
    "isLatest": false,
    "champions": [
      {
        "rank": 1,
        "medal": "🥇",
        "name": "@Nabori | Rialo💚",
        "tag": "Rank 1",
        "isTop": true
      },
      {
        "rank": 2,
        "medal": "🥈",
        "name": "@0xwenwen | Rialo准时睡觉组组长",
        "tag": "Rank 2",
        "isTop": true
      },
      {
        "rank": 3,
        "medal": "🥉",
        "name": "@moi",
        "tag": "Rank 3",
        "isTop": true
      },
      {
        "rank": 4,
        "medal": "🎖️",
        "name": "@Shin 🇻🇳",
        "tag": "Rank 4",
        "isTop": false
      },
      {
        "rank": 5,
        "medal": "🎖️",
        "name": "@lite",
        "tag": "Rank 5",
        "isTop": false
      },
      {
        "rank": 6,
        "medal": "🎖️",
        "name": "@YiĞiT",
        "tag": "Rank 6",
        "isTop": false
      },
      {
        "rank": 7,
        "medal": "🎖️",
        "name": "@JUST-ABDO",
        "tag": "Rank 7",
        "isTop": false
      },
      {
        "rank": 8,
        "medal": "🎖️",
        "name": "@Yuura",
        "tag": "Rank 8",
        "isTop": false
      },
      {
        "rank": 9,
        "medal": "🎖️",
        "name": "@!𝟘𝕩𝕍𝕚𝕜𝕒𝕁𝕠𝕖𝕤𝕥𝕒𝕣",
        "tag": "Rank 9",
        "isTop": false
      },
      {
        "rank": 10,
        "medal": "🎖️",
        "name": "@Lueguo",
        "tag": "Rank 10",
        "isTop": false
      }
    ]
  },
  {
    "date": "May 22, 2026",
    "attestedBy": "@Rollins in #quiz",
    "participants": "125+ Active Participants",
    "isLatest": false,
    "champions": [
      {
        "rank": 1,
        "medal": "🥇",
        "name": "@Vincen",
        "tag": "Rank 1",
        "isTop": true
      },
      {
        "rank": 2,
        "medal": "🥈",
        "name": "@YiĞiT",
        "tag": "Rank 2",
        "isTop": true
      },
      {
        "rank": 3,
        "medal": "🥉",
        "name": "@lite",
        "tag": "Rank 3",
        "isTop": true
      },
      {
        "rank": 4,
        "medal": "🎖️",
        "name": "@만담꾼 | Rialo",
        "tag": "Rank 4",
        "isTop": false
      },
      {
        "rank": 5,
        "medal": "🎖️",
        "name": "@Adᥱ́ᥕᥲ́ᥣᥱ́ 👑",
        "tag": "Rank 5",
        "isTop": false
      },
      {
        "rank": 6,
        "medal": "🎖️",
        "name": "@Normal",
        "tag": "Rank 6",
        "isTop": false
      },
      {
        "rank": 7,
        "medal": "🎖️",
        "name": "@Lueguo",
        "tag": "Rank 7",
        "isTop": false
      },
      {
        "rank": 8,
        "medal": "🎖️",
        "name": "@0xwenwen | Rialo准时睡觉组组长",
        "tag": "Rank 8",
        "isTop": false
      },
      {
        "rank": 9,
        "medal": "🎖️",
        "name": "@Sunney4557 l 쑤니 💛",
        "tag": "Rank 9",
        "isTop": false
      },
      {
        "rank": 10,
        "medal": "🎖️",
        "name": "@Wayne  丨Rialo 保安队健身监督员",
        "tag": "Rank 10",
        "isTop": false
      }
    ]
  },
  {
    "date": "May 15, 2026",
    "attestedBy": "@Rollins in #quiz",
    "participants": "120+ Active Participants",
    "isLatest": false,
    "champions": [
      {
        "rank": 1,
        "medal": "🥇",
        "name": "@shaking",
        "tag": "Rank 1",
        "isTop": true
      },
      {
        "rank": 2,
        "medal": "🥈",
        "name": "@jiek | 乐于助人的 jiek",
        "tag": "Rank 2",
        "isTop": true
      },
      {
        "rank": 3,
        "medal": "🥉",
        "name": "@77MC | Rialo",
        "tag": "Rank 3",
        "isTop": true
      },
      {
        "rank": 4,
        "medal": "🎖️",
        "name": "@nikky",
        "tag": "Rank 4",
        "isTop": false
      },
      {
        "rank": 5,
        "medal": "🎖️",
        "name": "@SpecialForces",
        "tag": "Rank 5",
        "isTop": false
      },
      {
        "rank": 6,
        "medal": "🎖️",
        "name": "@Fay",
        "tag": "Rank 6",
        "isTop": false
      },
      {
        "rank": 7,
        "medal": "🎖️",
        "name": "@S H Ξ N²⁶ |89|",
        "tag": "Rank 7",
        "isTop": false
      },
      {
        "rank": 8,
        "medal": "🎖️",
        "name": "@momo",
        "tag": "Rank 8",
        "isTop": false
      },
      {
        "rank": 9,
        "medal": "🎖️",
        "name": "@Nayem",
        "tag": "Rank 9",
        "isTop": false
      },
      {
        "rank": 10,
        "medal": "🎖️",
        "name": "@𝚔𝚑𝚊𝚕𝚒𝚍 | Rialo",
        "tag": "Rank 10",
        "isTop": false
      }
    ]
  },
  {
    "date": "May 8, 2026",
    "attestedBy": "@Rollins in #quiz",
    "participants": "120+ Active Participants",
    "isLatest": false,
    "champions": [
      {
        "rank": 1,
        "medal": "🥇",
        "name": "@sukanto",
        "tag": "Rank 1",
        "isTop": true
      },
      {
        "rank": 2,
        "medal": "🥈",
        "name": "@Heyve 🤍",
        "tag": "Rank 2",
        "isTop": true
      },
      {
        "rank": 3,
        "medal": "🥉",
        "name": "@Lueguo",
        "tag": "Rank 3",
        "isTop": true
      },
      {
        "rank": 4,
        "medal": "🎖️",
        "name": "@Catchy",
        "tag": "Rank 4",
        "isTop": false
      },
      {
        "rank": 5,
        "medal": "🎖️",
        "name": "@gyeouri",
        "tag": "Rank 5",
        "isTop": false
      },
      {
        "rank": 6,
        "medal": "🎖️",
        "name": "@POCKETSIZE_☘️",
        "tag": "Rank 6",
        "isTop": false
      },
      {
        "rank": 7,
        "medal": "🎖️",
        "name": "@!0xOyenJoestar",
        "tag": "Rank 7",
        "isTop": false
      },
      {
        "rank": 8,
        "medal": "🎖️",
        "name": "@Shin 🇻🇳",
        "tag": "Rank 8",
        "isTop": false
      },
      {
        "rank": 9,
        "medal": "🎖️",
        "name": "@Dp | 🇨🇳",
        "tag": "Rank 9",
        "isTop": false
      },
      {
        "rank": 10,
        "medal": "🎖️",
        "name": "@0xwenwen",
        "tag": "Rank 10",
        "isTop": false
      }
    ]
  },
  {
    "date": "May 1, 2026",
    "attestedBy": "@Rollins in #quiz",
    "participants": "115+ Active Participants",
    "isLatest": false,
    "champions": [
      {
        "rank": 1,
        "medal": "🥇",
        "name": "@cxxxv 135",
        "tag": "Rank 1",
        "isTop": true
      },
      {
        "rank": 2,
        "medal": "🥈",
        "name": "@Adᥱ́ᥕᥲ́ᥣᥱ́ 👑",
        "tag": "Rank 2",
        "isTop": true
      },
      {
        "rank": 3,
        "medal": "🥉",
        "name": "@mack",
        "tag": "Rank 3",
        "isTop": true
      },
      {
        "rank": 4,
        "medal": "🎖️",
        "name": "@SKS | Latch",
        "tag": "Rank 4",
        "isTop": false
      },
      {
        "rank": 5,
        "medal": "🎖️",
        "name": "@!𝟘𝕩𝕍𝕚𝕜𝕒𝕁𝕠𝕖𝕤𝕥𝕒𝕣",
        "tag": "Rank 5",
        "isTop": false
      },
      {
        "rank": 6,
        "medal": "🎖️",
        "name": "@Tasniya",
        "tag": "Rank 6",
        "isTop": false
      },
      {
        "rank": 7,
        "medal": "🎖️",
        "name": "@YiĞiT",
        "tag": "Rank 7",
        "isTop": false
      },
      {
        "rank": 8,
        "medal": "🎖️",
        "name": "@BadakBerenang",
        "tag": "Rank 8",
        "isTop": false
      },
      {
        "rank": 9,
        "medal": "🎖️",
        "name": "@Rayleigh",
        "tag": "Rank 9",
        "isTop": false
      },
      {
        "rank": 10,
        "medal": "🎖️",
        "name": "@Tanvir",
        "tag": "Rank 10",
        "isTop": false
      }
    ]
  },
  {
    "date": "April 24, 2026",
    "attestedBy": "@Rollins in #quiz",
    "participants": "110+ Active Participants",
    "isLatest": false,
    "champions": [
      {
        "rank": 1,
        "medal": "🥇",
        "name": "@Ken lee Lubi dubi Dau Chu Arc",
        "tag": "Rank 1",
        "isTop": true
      },
      {
        "rank": 2,
        "medal": "🥈",
        "name": "@SuperPio",
        "tag": "Rank 2",
        "isTop": true
      },
      {
        "rank": 3,
        "medal": "🥉",
        "name": "@esek serhat",
        "tag": "Rank 3",
        "isTop": true
      },
      {
        "rank": 4,
        "medal": "🎖️",
        "name": "@CC果汁 | Rialo无敌爆炸雷霆霹雳大长腿",
        "tag": "Rank 4",
        "isTop": false
      },
      {
        "rank": 5,
        "medal": "🎖️",
        "name": "@Lina(❤ ω ❤)Rialo 保安大队宣传部门(花瓶)",
        "tag": "Rank 5",
        "isTop": false
      },
      {
        "rank": 6,
        "medal": "🎖️",
        "name": "@0xrumora",
        "tag": "Rank 6",
        "isTop": false
      },
      {
        "rank": 7,
        "medal": "🎖️",
        "name": "@I am тнє єи∂亗",
        "tag": "Rank 7",
        "isTop": false
      },
      {
        "rank": 8,
        "medal": "🎖️",
        "name": "@Dp | 🇨🇳",
        "tag": "Rank 8",
        "isTop": false
      },
      {
        "rank": 9,
        "medal": "🎖️",
        "name": "@𝗻𝗼𝘃𝗮𝗽𝗶𝗻𝗼",
        "tag": "Rank 9",
        "isTop": false
      },
      {
        "rank": 10,
        "medal": "🎖️",
        "name": "@!Lolaaa💜",
        "tag": "Rank 10",
        "isTop": false
      }
    ]
  },
  {
    "date": "April 17, 2026",
    "attestedBy": "@Rollins in #quiz",
    "participants": "105+ Active Participants",
    "isLatest": false,
    "champions": [
      {
        "rank": 1,
        "medal": "🥇",
        "name": "@stfu '-'",
        "tag": "Rank 1",
        "isTop": true
      },
      {
        "rank": 2,
        "medal": "🥈",
        "name": "@? Daniel",
        "tag": "Rank 2",
        "isTop": true
      },
      {
        "rank": 3,
        "medal": "🥉",
        "name": "@『𝙹𝚒𝚜𝚊𝚗』 𝙻𝚊𝚝𝚌𝚑",
        "tag": "Rank 3",
        "isTop": true
      },
      {
        "rank": 4,
        "medal": "🎖️",
        "name": "@Lina(❤ ω ❤)Rialo 保安大队宣传部门(花瓶)",
        "tag": "Rank 4",
        "isTop": false
      },
      {
        "rank": 5,
        "medal": "🎖️",
        "name": "@SKS | Latch",
        "tag": "Rank 5",
        "isTop": false
      },
      {
        "rank": 6,
        "medal": "🎖️",
        "name": "@haisen",
        "tag": "Rank 6",
        "isTop": false
      },
      {
        "rank": 7,
        "medal": "🎖️",
        "name": "@Fahad | Ryve",
        "tag": "Rank 7",
        "isTop": false
      },
      {
        "rank": 8,
        "medal": "🎖️",
        "name": "@Fay",
        "tag": "Rank 8",
        "isTop": false
      },
      {
        "rank": 9,
        "medal": "🎖️",
        "name": "@moi",
        "tag": "Rank 9",
        "isTop": false
      },
      {
        "rank": 10,
        "medal": "🎖️",
        "name": "@MANNAN | Rialo 🇧🇩",
        "tag": "Rank 10",
        "isTop": false
      }
    ]
  },
  {
    "date": "April 10, 2026",
    "attestedBy": "@Rollins in #quiz",
    "participants": "100+ Active Participants",
    "isLatest": false,
    "champions": [
      {
        "rank": 1,
        "medal": "🥇",
        "name": "@Jahid",
        "tag": "Rank 1",
        "isTop": true
      },
      {
        "rank": 2,
        "medal": "🥈",
        "name": "@SKS | Latch",
        "tag": "Rank 2",
        "isTop": true
      },
      {
        "rank": 3,
        "medal": "🥉",
        "name": "@Fahad | Ryve",
        "tag": "Rank 3",
        "isTop": true
      },
      {
        "rank": 4,
        "medal": "🎖️",
        "name": "@『𝙹𝚒𝚜𝚊𝚗』 𝙻𝚊𝚝𝚌𝚑",
        "tag": "Rank 4",
        "isTop": false
      },
      {
        "rank": 5,
        "medal": "🎖️",
        "name": "@STEVEN | RIALO",
        "tag": "Rank 5",
        "isTop": false
      },
      {
        "rank": 6,
        "medal": "🎖️",
        "name": "@Saif",
        "tag": "Rank 6",
        "isTop": false
      },
      {
        "rank": 7,
        "medal": "🎖️",
        "name": "@MG",
        "tag": "Rank 7",
        "isTop": false
      },
      {
        "rank": 8,
        "medal": "🎖️",
        "name": "@KAMRUL",
        "tag": "Rank 8",
        "isTop": false
      },
      {
        "rank": 9,
        "medal": "🎖️",
        "name": "@vita5000 | 리알로와 사는 비타",
        "tag": "Rank 9",
        "isTop": false
      },
      {
        "rank": 10,
        "medal": "🎖️",
        "name": "@Brut🖤",
        "tag": "Rank 10",
        "isTop": false
      }
    ]
  },
  {
    "date": "April 3, 2026",
    "attestedBy": "@Rollins in #quiz",
    "participants": "95+ Active Participants",
    "isLatest": false,
    "champions": [
      {
        "rank": 1,
        "medal": "🥇",
        "name": "@UTA 👹 | ONI",
        "tag": "Rank 1",
        "isTop": true
      },
      {
        "rank": 2,
        "medal": "🥈",
        "name": "@!𝟘𝕩𝕍𝕚𝕜𝕒𝕁𝕠𝕖𝕤𝕥𝕒𝕣",
        "tag": "Rank 2",
        "isTop": true
      },
      {
        "rank": 3,
        "medal": "🥉",
        "name": "@Baster",
        "tag": "Rank 3",
        "isTop": true
      },
      {
        "rank": 4,
        "medal": "🎖️",
        "name": "@Nabori | Rialo💚",
        "tag": "Rank 4",
        "isTop": false
      },
      {
        "rank": 5,
        "medal": "🎖️",
        "name": "@0xwenwen | Rialo准时睡觉组组长",
        "tag": "Rank 5",
        "isTop": false
      },
      {
        "rank": 6,
        "medal": "🎖️",
        "name": "@KingJ |  🇨🇳",
        "tag": "Rank 6",
        "isTop": false
      },
      {
        "rank": 7,
        "medal": "🎖️",
        "name": "@Jahid",
        "tag": "Rank 7",
        "isTop": false
      },
      {
        "rank": 8,
        "medal": "🎖️",
        "name": "@vita5000 | 리알로와 사는 비타",
        "tag": "Rank 8",
        "isTop": false
      },
      {
        "rank": 9,
        "medal": "🎖️",
        "name": "@Wayne  丨Rialo 保安队健身监督员",
        "tag": "Rank 9",
        "isTop": false
      },
      {
        "rank": 10,
        "medal": "🎖️",
        "name": "@Caroline TT | Rialo",
        "tag": "Rank 10",
        "isTop": false
      }
    ]
  },
  {
    "date": "March 27, 2026",
    "attestedBy": "@Rollins in #quiz",
    "participants": "90+ Active Participants",
    "isLatest": false,
    "champions": [
      {
        "rank": 1,
        "medal": "🥇",
        "name": "@Smith",
        "tag": "Rank 1",
        "isTop": true
      },
      {
        "rank": 2,
        "medal": "🥈",
        "name": "@!𝟘𝕩𝕍𝕚𝕜𝕒𝕁𝕠𝕖𝕤𝕥𝕒𝕣",
        "tag": "Rank 2",
        "isTop": true
      },
      {
        "rank": 3,
        "medal": "🥉",
        "name": "@0ﾒㄒㄖKㄚㄖ",
        "tag": "Rank 3",
        "isTop": true
      },
      {
        "rank": 4,
        "medal": "🎖️",
        "name": "@Guynextdooooor",
        "tag": "Rank 4",
        "isTop": false
      },
      {
        "rank": 5,
        "medal": "🎖️",
        "name": "@Ceejay",
        "tag": "Rank 5",
        "isTop": false
      },
      {
        "rank": 6,
        "medal": "🎖️",
        "name": "@reinn.",
        "tag": "Rank 6",
        "isTop": false
      },
      {
        "rank": 7,
        "medal": "🎖️",
        "name": "@Loveress✨",
        "tag": "Rank 7",
        "isTop": false
      },
      {
        "rank": 8,
        "medal": "🎖️",
        "name": "@Future88",
        "tag": "Rank 8",
        "isTop": false
      },
      {
        "rank": 9,
        "medal": "🎖️",
        "name": "@Fay",
        "tag": "Rank 9",
        "isTop": false
      },
      {
        "rank": 10,
        "medal": "🎖️",
        "name": "@atik.eth",
        "tag": "Rank 10",
        "isTop": false
      }
    ]
  },
  {
    "date": "March 20, 2026",
    "attestedBy": "@Rollins in #quiz",
    "participants": "85+ Active Participants",
    "isLatest": false,
    "champions": [
      {
        "rank": 1,
        "medal": "🥇",
        "name": "@Smith",
        "tag": "Rank 1",
        "isTop": true
      },
      {
        "rank": 2,
        "medal": "🥈",
        "name": "@77MC | Rialo",
        "tag": "Rank 2",
        "isTop": true
      },
      {
        "rank": 3,
        "medal": "🥉",
        "name": "@Fahad | Ryve",
        "tag": "Rank 3",
        "isTop": true
      },
      {
        "rank": 4,
        "medal": "🎖️",
        "name": "@? Daniel",
        "tag": "Rank 4",
        "isTop": false
      },
      {
        "rank": 5,
        "medal": "🎖️",
        "name": "@TOBEL || PRIME",
        "tag": "Rank 5",
        "isTop": false
      },
      {
        "rank": 6,
        "medal": "🎖️",
        "name": "@illonash",
        "tag": "Rank 6",
        "isTop": false
      },
      {
        "rank": 7,
        "medal": "🎖️",
        "name": "@STEVEN | RIALO",
        "tag": "Rank 7",
        "isTop": false
      },
      {
        "rank": 8,
        "medal": "🎖️",
        "name": "@007",
        "tag": "Rank 8",
        "isTop": false
      },
      {
        "rank": 9,
        "medal": "🎖️",
        "name": "@Tasniya",
        "tag": "Rank 9",
        "isTop": false
      },
      {
        "rank": 10,
        "medal": "🎖️",
        "name": "@𝚔𝚑𝚊𝚕𝚒𝚍 | Rialo",
        "tag": "Rank 10",
        "isTop": false
      }
    ]
  },
  {
    "date": "February 13, 2026",
    "attestedBy": "@RialORCA in #quiz",
    "participants": "80+ Active Participants",
    "isLatest": false,
    "champions": [
      {
        "rank": 1,
        "medal": "🥇",
        "name": "@A Nas | 🦉",
        "tag": "Rank 1",
        "isTop": true
      },
      {
        "rank": 2,
        "medal": "🥈",
        "name": "@GRAYDENBOY",
        "tag": "Rank 2",
        "isTop": true
      },
      {
        "rank": 3,
        "medal": "🥉",
        "name": "@secondT",
        "tag": "Rank 3",
        "isTop": true
      },
      {
        "rank": 4,
        "medal": "🎖️",
        "name": "@SpecialistOG",
        "tag": "Rank 4",
        "isTop": false
      },
      {
        "rank": 5,
        "medal": "🎖️",
        "name": "@Nayem",
        "tag": "Rank 5",
        "isTop": false
      },
      {
        "rank": 6,
        "medal": "🎖️",
        "name": "@Lovezayoki",
        "tag": "Rank 6",
        "isTop": false
      },
      {
        "rank": 7,
        "medal": "🎖️",
        "name": "@Koushik Nir | 🇧🇩",
        "tag": "Rank 7",
        "isTop": false
      },
      {
        "rank": 8,
        "medal": "🎖️",
        "name": "@Dp | 🇨🇳",
        "tag": "Rank 8",
        "isTop": false
      },
      {
        "rank": 9,
        "medal": "🎖️",
        "name": "@TOBEL || PRIME",
        "tag": "Rank 9",
        "isTop": false
      },
      {
        "rank": 10,
        "medal": "🎖️",
        "name": "@Fenrir",
        "tag": "Rank 10",
        "isTop": false
      }
    ]
  },
  {
    "date": "February 6, 2026",
    "attestedBy": "@RialORCA in #quiz",
    "participants": "75+ Active Participants",
    "isLatest": false,
    "champions": [
      {
        "rank": 1,
        "medal": "🥇",
        "name": "@saltics1(❖,❖)",
        "tag": "Rank 1",
        "isTop": true
      },
      {
        "rank": 2,
        "medal": "🥈",
        "name": "@0xgokdeniz | Rialo",
        "tag": "Rank 2",
        "isTop": true
      },
      {
        "rank": 3,
        "medal": "🥉",
        "name": "@Tanvir",
        "tag": "Rank 3",
        "isTop": true
      },
      {
        "rank": 4,
        "medal": "🎖️",
        "name": "@Tanvir Nabil",
        "tag": "Rank 4",
        "isTop": false
      },
      {
        "rank": 5,
        "medal": "🎖️",
        "name": "@cxxxv 135",
        "tag": "Rank 5",
        "isTop": false
      },
      {
        "rank": 6,
        "medal": "🎖️",
        "name": "@ZOEFUNDS | BlockchainBard",
        "tag": "Rank 6",
        "isTop": false
      },
      {
        "rank": 7,
        "medal": "🎖️",
        "name": "@Mirel",
        "tag": "Rank 7",
        "isTop": false
      },
      {
        "rank": 8,
        "medal": "🎖️",
        "name": "@Mushfiq Hasan",
        "tag": "Rank 8",
        "isTop": false
      },
      {
        "rank": 9,
        "medal": "🎖️",
        "name": "@CRIMSON 💜",
        "tag": "Rank 9",
        "isTop": false
      },
      {
        "rank": 10,
        "medal": "🎖️",
        "name": "@Luzzy",
        "tag": "Rank 10",
        "isTop": false
      }
    ]
  },
  {
    "date": "January 30, 2026",
    "attestedBy": "@Nooble in #quiz",
    "participants": "70+ Active Participants",
    "isLatest": false,
    "champions": [
      {
        "rank": 1,
        "medal": "🥇",
        "name": "@Testnetnodes I RiaLo",
        "tag": "Rank 1",
        "isTop": true
      },
      {
        "rank": 2,
        "medal": "🥈",
        "name": "@JUST-ABDO",
        "tag": "Rank 2",
        "isTop": true
      },
      {
        "rank": 3,
        "medal": "🥉",
        "name": "@K.Gufran | 🇮🇩",
        "tag": "Rank 3",
        "isTop": true
      },
      {
        "rank": 4,
        "medal": "🎖️",
        "name": "@Damggu 🍈",
        "tag": "Rank 4",
        "isTop": false
      },
      {
        "rank": 5,
        "medal": "🎖️",
        "name": "@0xwenwen | Rialo准时睡觉组组长",
        "tag": "Rank 5",
        "isTop": false
      },
      {
        "rank": 6,
        "medal": "🎖️",
        "name": "@ADΞLKHATΞR | RIALO",
        "tag": "Rank 6",
        "isTop": false
      },
      {
        "rank": 7,
        "medal": "🎖️",
        "name": "@-Persic!",
        "tag": "Rank 7",
        "isTop": false
      },
      {
        "rank": 8,
        "medal": "🎖️",
        "name": "@Sytada",
        "tag": "Rank 8",
        "isTop": false
      },
      {
        "rank": 9,
        "medal": "🎖️",
        "name": "@JASMINE",
        "tag": "Rank 9",
        "isTop": false
      },
      {
        "rank": 10,
        "medal": "🎖️",
        "name": "@Den | Rialo",
        "tag": "Rank 10",
        "isTop": false
      }
    ]
  },
  {
    "date": "January 23, 2026",
    "attestedBy": "@Nooble in #quiz",
    "participants": "65+ Active Participants",
    "isLatest": false,
    "champions": [
      {
        "rank": 1,
        "medal": "🥇",
        "name": "@Cao Thần Quang",
        "tag": "Rank 1",
        "isTop": true
      },
      {
        "rank": 2,
        "medal": "🥈",
        "name": "@Tanvir Nabil",
        "tag": "Rank 2",
        "isTop": true
      },
      {
        "rank": 3,
        "medal": "🥉",
        "name": "@-Persic!",
        "tag": "Rank 3",
        "isTop": true
      },
      {
        "rank": 4,
        "medal": "🎖️",
        "name": "@Ritu - Rialo",
        "tag": "Rank 4",
        "isTop": false
      },
      {
        "rank": 5,
        "medal": "🎖️",
        "name": "@Subzero",
        "tag": "Rank 5",
        "isTop": false
      },
      {
        "rank": 6,
        "medal": "🎖️",
        "name": "@Ken lee Lubi dubi Dau Chu Arc",
        "tag": "Rank 6",
        "isTop": false
      },
      {
        "rank": 7,
        "medal": "🎖️",
        "name": "@Monir",
        "tag": "Rank 7",
        "isTop": false
      },
      {
        "rank": 8,
        "medal": "🎖️",
        "name": "@3c林林_xyz | Rialo 保安队队长",
        "tag": "Rank 8",
        "isTop": false
      },
      {
        "rank": 9,
        "medal": "🎖️",
        "name": "@KAMRUL",
        "tag": "Rank 9",
        "isTop": false
      },
      {
        "rank": 10,
        "medal": "🎖️",
        "name": "@2026ﺭﺭ | 🇨🇳 Rialo客服组长小R",
        "tag": "Rank 10",
        "isTop": false
      }
    ]
  },
  {
    "date": "January 16, 2026",
    "attestedBy": "@Nooble in #quiz",
    "participants": "60+ Active Participants",
    "isLatest": false,
    "champions": [
      {
        "rank": 1,
        "medal": "🥇",
        "name": "@musti7317",
        "tag": "Rank 1",
        "isTop": true
      },
      {
        "rank": 2,
        "medal": "🥈",
        "name": "@hieunguyen173",
        "tag": "Rank 2",
        "isTop": true
      },
      {
        "rank": 3,
        "medal": "🥉",
        "name": "@etobrutal",
        "tag": "Rank 3",
        "isTop": true
      },
      {
        "rank": 4,
        "medal": "🎖️",
        "name": "@just_abdo__",
        "tag": "Rank 4",
        "isTop": false
      },
      {
        "rank": 5,
        "medal": "🎖️",
        "name": "@dappy0070",
        "tag": "Rank 5",
        "isTop": false
      },
      {
        "rank": 6,
        "medal": "🎖️",
        "name": "@yigitaydin",
        "tag": "Rank 6",
        "isTop": false
      },
      {
        "rank": 7,
        "medal": "🎖️",
        "name": "@gofarhilman",
        "tag": "Rank 7",
        "isTop": false
      },
      {
        "rank": 8,
        "medal": "🎖️",
        "name": "@aryan346",
        "tag": "Rank 8",
        "isTop": false
      },
      {
        "rank": 9,
        "medal": "🎖️",
        "name": "@bubbl1k",
        "tag": "Rank 9",
        "isTop": false
      },
      {
        "rank": 10,
        "medal": "🎖️",
        "name": "@kris_bogachenko1",
        "tag": "Rank 10",
        "isTop": false
      }
    ]
  },
  {
    "date": "January 9, 2026",
    "attestedBy": "@Nooble in #quiz",
    "participants": "55+ Active Participants",
    "isLatest": false,
    "champions": [
      {
        "rank": 1,
        "medal": "🥇",
        "name": "@Floor.rialo | 悟空客服困难",
        "tag": "Rank 1",
        "isTop": true
      },
      {
        "rank": 2,
        "medal": "🥈",
        "name": "@CHEN",
        "tag": "Rank 2",
        "isTop": true
      },
      {
        "rank": 3,
        "medal": "🥉",
        "name": "@Scrooge | Rialo",
        "tag": "Rank 3",
        "isTop": true
      },
      {
        "rank": 4,
        "medal": "🎖️",
        "name": "@Yuura",
        "tag": "Rank 4",
        "isTop": false
      },
      {
        "rank": 5,
        "medal": "🎖️",
        "name": "@Rango :) 🦎",
        "tag": "Rank 5",
        "isTop": false
      },
      {
        "rank": 6,
        "medal": "🎖️",
        "name": "@illonash",
        "tag": "Rank 6",
        "isTop": false
      },
      {
        "rank": 7,
        "medal": "🎖️",
        "name": "@Dp | 🇨🇳",
        "tag": "Rank 7",
        "isTop": false
      },
      {
        "rank": 8,
        "medal": "🎖️",
        "name": "@SKS | Latch",
        "tag": "Rank 8",
        "isTop": false
      },
      {
        "rank": 9,
        "medal": "🎖️",
        "name": "@hannie",
        "tag": "Rank 9",
        "isTop": false
      },
      {
        "rank": 10,
        "medal": "🎖️",
        "name": "@Hisleten",
        "tag": "Rank 10",
        "isTop": false
      }
    ]
  },
  {
    "date": "January 2, 2026",
    "attestedBy": "@Nooble in #quiz",
    "participants": "50+ Active Participants",
    "isLatest": false,
    "champions": [
      {
        "rank": 1,
        "medal": "🥇",
        "name": "@Nafis Sadik",
        "tag": "Rank 1",
        "isTop": true
      },
      {
        "rank": 2,
        "medal": "🥈",
        "name": "@Nine👹| D.O.P.E",
        "tag": "Rank 2",
        "isTop": true
      },
      {
        "rank": 3,
        "medal": "🥉",
        "name": "@Aiolos",
        "tag": "Rank 3",
        "isTop": true
      },
      {
        "rank": 4,
        "medal": "🎖️",
        "name": "@blonerd",
        "tag": "Rank 4",
        "isTop": false
      },
      {
        "rank": 5,
        "medal": "🎖️",
        "name": "@TuLee-.-",
        "tag": "Rank 5",
        "isTop": false
      },
      {
        "rank": 6,
        "medal": "🎖️",
        "name": "@SKS | Latch",
        "tag": "Rank 6",
        "isTop": false
      },
      {
        "rank": 7,
        "medal": "🎖️",
        "name": "@illonash",
        "tag": "Rank 7",
        "isTop": false
      },
      {
        "rank": 8,
        "medal": "🎖️",
        "name": "@Fenrir",
        "tag": "Rank 8",
        "isTop": false
      },
      {
        "rank": 9,
        "medal": "🎖️",
        "name": "@Grimm",
        "tag": "Rank 9",
        "isTop": false
      },
      {
        "rank": 10,
        "medal": "🎖️",
        "name": "@𝐌𝐲𝐤𝐨𝐥𝐚𝐲",
        "tag": "Rank 10",
        "isTop": false
      }
    ]
  }
];

var currentQuizIndex = 0;

function renderQuizChampions() {
  var data = quizHistory[currentQuizIndex];
  var container = document.getElementById("quizWinnersContainer");
  if (!container) return;

  var isFirst = currentQuizIndex === 0;
  var isLast = currentQuizIndex === quizHistory.length - 1;

  var col1 = data.champions.slice(0, 5);
  var col2 = data.champions.slice(5, 10);

  container.innerHTML = 
    "<div class=\"flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/[0.08] pb-3.5\">" +
      "<div class=\"flex items-center gap-3\">" +
        "<div class=\"w-9 h-9 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center font-bold text-base shadow-sm\">🧠</div>" +
        "<div>" +
          "<div class=\"flex items-center gap-2\">" +
            "<h3 class=\"text-base font-extrabold text-brand-text\">Tech Quiz Champions</h3>" +
            "<span class=\"text-xs font-mono font-bold bg-purple-100/80 text-purple-900 px-2.5 py-0.5 rounded-full border border-purple-200/60\">📅 " + data.date + "</span>" +
            (data.isLatest ? "<span class=\"text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200\">LATEST</span>" : "") +
          "</div>" +
          "<p class=\"text-[11px] text-black/60 font-mono mt-0.5\">Official top 10 winners attested by " + data.attestedBy + "</p>" +
        "</div>" +
      "</div>" +
      "<div class=\"flex items-center gap-2 self-start sm:self-auto\">" +
        "<button onclick=\"prevQuizWeek()\" " + (isLast ? "disabled" : "") + " class=\"px-3 py-1.5 rounded-xl border border-black/10 flex items-center gap-1.5 text-xs font-mono font-bold transition-all " + (isLast ? "opacity-30 cursor-not-allowed bg-black/[0.02] text-black/40" : "bg-white hover:bg-black/5 active:scale-95 text-brand-text shadow-sm") + "\" title=\"Previous Quiz Date\">" +
          "<span>← Prev Date</span>" +
        "</button>" +
        "<span class=\"text-xs font-mono font-bold text-black/50 px-1\">" + (currentQuizIndex + 1) + " / " + quizHistory.length + "</span>" +
        "<button onclick=\"nextQuizWeek()\" " + (isFirst ? "disabled" : "") + " class=\"px-3 py-1.5 rounded-xl border border-black/10 flex items-center gap-1.5 text-xs font-mono font-bold transition-all " + (isFirst ? "opacity-30 cursor-not-allowed bg-black/[0.02] text-black/40" : "bg-white hover:bg-black/5 active:scale-95 text-brand-text shadow-sm") + "\" title=\"Next Quiz Date\">" +
          "<span>Next Date →</span>" +
        "</button>" +
      "</div>" +
    "</div>" +

    "<div class=\"grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1\">" +
      "<div class=\"space-y-2\">" +
        col1.map(function(c) {
          return "<div class=\"p-2.5 bg-[#F6F4EE] rounded-xl border border-black/[0.06] flex items-center justify-between shadow-sm cursor-default select-none\">" +
            "<span class=\"text-xs font-mono font-bold text-brand-text flex items-center gap-2\">" +
              "<span class=\"text-sm\">" + c.medal + "</span> <span>" + escapeHtml(c.name) + "</span>" +
            "</span>" +
            "<span class=\"text-[10px] font-mono " + (c.isTop ? "font-bold text-[#205446] bg-white border border-[#205446]/20" : "text-slate-600 bg-white border border-black/[0.06]") + " px-2 py-0.5 rounded-full\">" + c.tag + "</span>" +
          "</div>";
        }).join("") +
      "</div>" +
      "<div class=\"space-y-2\">" +
        col2.map(function(c) {
          return "<div class=\"p-2.5 bg-[#F6F4EE] rounded-xl border border-black/[0.06] flex items-center justify-between shadow-sm cursor-default select-none\">" +
            "<span class=\"text-xs font-mono font-bold text-brand-text flex items-center gap-2\">" +
              "<span class=\"text-sm\">" + c.medal + "</span> <span>" + escapeHtml(c.name) + "</span>" +
            "</span>" +
            "<span class=\"text-[10px] font-mono text-slate-600 px-2 py-0.5 bg-white rounded-full border border-black/[0.06]\">" + c.tag + "</span>" +
          "</div>";
        }).join("") +
      "</div>" +
    "</div>" +

    "<div class=\"text-[11px] font-mono text-black/60 pt-2 border-t border-black/[0.06] flex items-center justify-between\">" +
      "<span>Attested by " + data.attestedBy + "</span>" +
      "<span class=\"text-[#205446] font-bold\">" + data.participants + "</span>" +
    "</div>";
}

function prevQuizWeek() {
  if (currentQuizIndex < quizHistory.length - 1) {
    currentQuizIndex++;
    renderQuizChampions();
  }
}

function nextQuizWeek() {
  if (currentQuizIndex > 0) {
    currentQuizIndex--;
    renderQuizChampions();
  }
}


if (typeof document !== 'undefined') {
  document.addEventListener("DOMContentLoaded", function() {
    renderSharkTankCard();
    renderCommunitySpotlight();
    renderAiKeyControls();
    renderQuizChampions();
  });
}


// ══════════════════════════════════════════════════════
// COMMUNITY SPOTLIGHT HISTORICAL ENGINE
// ══════════════════════════════════════════════════════

var spotlightHistory = [
  {
    date: "August 24, 2026",
    isLatest: true,
    members: [
      { name: "unwordly_88", region: "CIS", avatar: "assets/avatars/unwordly_88.png" },
      { name: "amrita_143", region: "India", avatar: "assets/avatars/amrita_143.png" },
      { name: "nickybeo", region: "Vietnam", avatar: "assets/avatars/nickybeo.png" },
      { name: "power23315", region: "China", avatar: "assets/avatars/power23315.png" },
      { name: "burak33b", region: "Turkey", avatar: "assets/avatars/burak33b.png" },
      { name: "kamrulbroz", region: "Bangladesh", avatar: "assets/avatars/kamrulbroz.png" },
      { name: "keinnxbt", region: "Indonesia", avatar: "assets/avatars/keinnxbt.png" },
      { name: "vicxweb", region: "Africa", avatar: "assets/avatars/vicxweb.png" },
      { name: "wallets12", region: "South Korea", avatar: "assets/avatars/wallets12.png" },
      { name: "captain0s", region: "Pakistan", avatar: "assets/avatars/captain0s.png" },
      { name: "masinonline", region: "Arabic", avatar: "assets/avatars/masinonline.png" },
      { name: "jamesnanox", region: "Thailand", avatar: "assets/avatars/jamesnanox.png" },
      { name: "j0s3luiz", region: "Portuguese", avatar: "assets/avatars/j0s3luiz.png" },
      { name: "alexan74g", region: "Ukraine", avatar: "assets/avatars/alexan74g.png" },
      { name: "elenaa_68", region: "General", avatar: "assets/avatars/elenaa_68.png" }
    ]
  },
  {
    date: "August 17, 2026",
    isLatest: false,
    members: [
      { name: "azadsx3", region: "CIS", avatar: "assets/avatars/azadsx3.png" },
      { name: "drakon62", region: "India", avatar: "assets/avatars/drakon62.png" },
      { name: "jayson_4411", region: "Vietnam", avatar: "assets/avatars/jayson_4411.png" },
      { name: "astator18", region: "China", avatar: "assets/avatars/astator18.png" },
      { name: "burak33b", region: "Turkey", avatar: "assets/avatars/burak33b_aug17.png" },
      { name: "zingxoro", region: "Bangladesh", avatar: "assets/avatars/zingxoro.png" },
      { name: "feryrustandi_93944", region: "Indonesia", avatar: "assets/avatars/feryrustandi_93944.png" },
      { name: "heishazard", region: "Africa", avatar: "assets/avatars/heishazard.png" },
      { name: "_._mingyu_._", region: "South Korea", avatar: "assets/avatars/mingyu.png" },
      { name: "zara4299", region: "Pakistan", avatar: "assets/avatars/zara4299.png" },
      { name: "hala.madriid", region: "Arabic", avatar: "assets/avatars/hala_madriid.png" },
      { name: "jamesnanox", region: "Thailand", avatar: "assets/avatars/jamesnanox_aug17.png" },
      { name: "j0s3luiz", region: "Portuguese", avatar: "assets/avatars/j0s3luiz_aug17.png" },
      { name: "alexan74g", region: "Ukraine", avatar: "assets/avatars/alexan74g_aug17.png" },
      { name: "bedariz", region: "General", avatar: "assets/avatars/bedariz.png" }
    ]
  },
  {
    date: "August 10, 2026",
    isLatest: false,
    members: [
      { name: "unwordly_88", region: "CIS", avatar: "assets/avatars/unwordly_88_aug10.png" },
      { name: "sanuu_5", region: "India", avatar: "assets/avatars/sanuu_5.png" },
      { name: "gameismylife_", region: "Vietnam", avatar: "assets/avatars/gameismylife_.png" },
      { name: "luluhuishan", region: "China", avatar: "assets/avatars/luluhuishan.png" },
      { name: "burak33b", region: "Turkey", avatar: "assets/avatars/burak33b_aug10.png" },
      { name: "hasibulhasanm", region: "Bangladesh", avatar: "assets/avatars/hasibulhasanm_aug10.png" },
      { name: "keinnxbt", region: "Indonesia", avatar: "assets/avatars/keinnxbt_aug10.png" },
      { name: "cheff_eth", region: "Africa", avatar: "assets/avatars/cheff_eth.png" },
      { name: "liteaaa", region: "South Korea", avatar: "assets/avatars/liteaaa.png" },
      { name: "qaziharis1", region: "Pakistan", avatar: "assets/avatars/qaziharis1.png" },
      { name: "hosam_web3", region: "Arabic", avatar: "assets/avatars/hosam_web3.png" },
      { name: "dos4289", region: "Thailand", avatar: "assets/avatars/dos4289.png" },
      { name: "andrei0x45", region: "Portuguese", avatar: "assets/avatars/andrei0x45.png" },
      { name: "alexan74g", region: "Ukraine", avatar: "assets/avatars/alexan74g_aug10.png" },
      { name: "nguyen200102", region: "General", avatar: "assets/avatars/nguyen200102.png" }
    ]
  },
  {
    date: "August 3, 2026",
    isLatest: false,
    members: [
      { name: "unwordly_88", region: "CIS", avatar: "assets/avatars/unwordly_88_aug3.png" },
      { name: "krishna037092", region: "India", avatar: "assets/avatars/krishna037092.png" },
      { name: "ry0nx1", region: "Vietnam", avatar: "assets/avatars/ry0nx1.png" },
      { name: "oniy0419", region: "China", avatar: "assets/avatars/oniy0419.png" },
      { name: "rftd", region: "Turkey", avatar: "assets/avatars/rftd.png" },
      { name: "water_dealer1", region: "Bangladesh", avatar: "assets/avatars/water_dealer1.png" },
      { name: "nxrskyaa", region: "Indonesia", avatar: "assets/avatars/nxrskyaa.png" },
      { name: "cheff_eth", region: "Africa", avatar: "assets/avatars/cheff_eth_aug3.png" },
      { name: "☆☆_chz_H", region: "South Korea", avatar: "assets/avatars/chz_h.png" },
      { name: "melophile0646", region: "Pakistan", avatar: "assets/avatars/melophile0646.png" },
      { name: "adhamsrour", region: "Arabic", avatar: "assets/avatars/adhamsrour.png" },
      { name: "nocturnehq", region: "Thailand", avatar: "assets/avatars/nocturnehq.png" },
      { name: "mcidinha", region: "Portuguese", avatar: "assets/avatars/mcidinha.png" },
      { name: "toma_76947", region: "Ukraine", avatar: "assets/avatars/toma_76947.png" },
      { name: "0xvoid__", region: "General", avatar: "assets/avatars/0xvoid__.png" }
    ]
  },
  {
    date: "July 26, 2026",
    isLatest: false,
    members: [
      { name: "unwordly_88", region: "CIS", avatar: "assets/avatars/unwordly_88_jul26.png" },
      { name: "darkqueenhere", region: "India", avatar: "assets/avatars/darkqueenhere.png" },
      { name: "anhoai0055", region: "Vietnam", avatar: "assets/avatars/anhoai0055.png" },
      { name: "koi01020", region: "China", avatar: "assets/avatars/koi01020.png" },
      { name: "fuatacarfa", region: "Turkey", avatar: "assets/avatars/fuatacarfa.png" },
      { name: "hayxenxt", region: "Bangladesh", avatar: "assets/avatars/hayxenxt.png" },
      { name: "giselleafr", region: "Indonesia", avatar: "assets/avatars/giselleafr.png" },
      { name: "james_dominic", region: "Africa", avatar: "assets/avatars/james_dominic.png" },
      { name: "sunney4557", region: "South Korea", avatar: "assets/avatars/sunney4557.png" },
      { name: "fatima_1o1", region: "Pakistan", avatar: "assets/avatars/fatima_1o1.png" },
      { name: "hosam_web3", region: "Arabic", avatar: "assets/avatars/hosam_web3_jul26.png" },
      { name: "dos4289", region: "Thailand", avatar: "assets/avatars/dos4289_jul26.png" },
      { name: "j0s3luiz", region: "Portuguese", avatar: "assets/avatars/j0s3luiz_jul26.png" },
      { name: "alexan74g", region: "Ukraine", avatar: "assets/avatars/alexan74g_jul26.png" },
      { name: "bedariz", region: "General", avatar: "assets/avatars/bedariz_jul26.png" }
    ]
  },
  {
    date: "July 21, 2026",
    isLatest: false,
    members: [
      { name: "chekanza", region: "CIS", avatar: "assets/avatars/chekanza.png" },
      { name: "mak05892", region: "India", avatar: "assets/avatars/mak05892.png" },
      { name: "eliasskun", region: "Vietnam", avatar: "assets/avatars/eliasskun.png" },
      { name: "jiekle", region: "China", avatar: "assets/avatars/jiekle.png" },
      { name: "denislinetti", region: "Turkey", avatar: "assets/avatars/denislinetti.png" },
      { name: "dchakma6666", region: "Bangladesh", avatar: "assets/avatars/dchakma6666.png" },
      { name: "purwa412", region: "Indonesia", avatar: "assets/avatars/purwa412.png" },
      { name: "daves0657", region: "Africa", avatar: "assets/avatars/daves0657.png" },
      { name: "naborii", region: "South Korea", avatar: "assets/avatars/naborii.png" },
      { name: "qaziharis1", region: "Pakistan", avatar: "assets/avatars/qaziharis1_jul21.png" },
      { name: "adhamsrour", region: "Arabic", avatar: "assets/avatars/adhamsrour_jul21.png" },
      { name: "jamesnanox", region: "Thailand", avatar: "assets/avatars/jamesnanox_jul21.png" },
      { name: "mcidinha", region: "Portuguese", avatar: "assets/avatars/mcidinha_jul21.png" },
      { name: "toma_76947", region: "Ukraine", avatar: "assets/avatars/toma_76947_jul21.png" },
      { name: "cutemoon", region: "General", avatar: "assets/avatars/cutemoon.png" }
    ]
  },
  {
    date: "July 12, 2026",
    isLatest: false,
    members: [
      { name: "unwordly_88", region: "CIS", avatar: "assets/avatars/unwordly_88_jul12.png" },
      { name: "shubha072141", region: "India", avatar: "assets/avatars/shubha072141.png" },
      { name: "manhlouiss", region: "Vietnam", avatar: "assets/avatars/manhlouiss.png" },
      { name: "jasonkt532", region: "China", avatar: "assets/avatars/jasonkt532.png" },
      { name: "fuatacarfa", region: "Turkey", avatar: "assets/avatars/fuatacarfa_jul12.png" },
      { name: "sojibjaber1", region: "Bangladesh", avatar: "assets/avatars/sojibjaber1.png" },
      { name: "rakswp", region: "Indonesia", avatar: "assets/avatars/rakswp.png" },
      { name: "daves0657", region: "Africa", avatar: "assets/avatars/daves0657_jul12.png" },
      { name: "vita5000", region: "South Korea", avatar: "assets/avatars/vita5000.png" },
      { name: "melophile0646", region: "Pakistan", avatar: "assets/avatars/melophile0646_jul12.png" },
      { name: "hosam_web3", region: "Arabic", avatar: "assets/avatars/hosam_web3_jul12.png" },
      { name: "nocturnehq", region: "Thailand", avatar: "assets/avatars/nocturnehq_jul12.png" },
      { name: "j0s3luiz", region: "Portuguese", avatar: "assets/avatars/j0s3luiz_jul12.png" },
      { name: "toma_76947", region: "Ukraine", avatar: "assets/avatars/toma_76947_jul12.png" },
      { name: "hrx0005", region: "General", avatar: "assets/avatars/hrx0005.png" }
    ]
  },
  {
    date: "July 5, 2026",
    isLatest: false,
    members: [
      { name: "unwordly_88", region: "CIS", avatar: "assets/avatars/unwordly_88_jul5.png" },
      { name: "yamini_abc", region: "India", avatar: "assets/avatars/yamini_abc.png" },
      { name: "robin023681", region: "Vietnam", avatar: "assets/avatars/robin023681.png" },
      { name: "yimo092887", region: "China", avatar: "assets/avatars/yimo092887.png" },
      { name: "fuatacarfa", region: "Turkey", avatar: "assets/avatars/fuatacarfa_jul5.png" },
      { name: "ashweb32", region: "Bangladesh", avatar: "assets/avatars/ashweb32.png" },
      { name: "dossrawrr", region: "Indonesia", avatar: "assets/avatars/dossrawrr.png" },
      { name: "vicxweb", region: "Africa", avatar: "assets/avatars/vicxweb_jul5.png" },
      { name: "gyeouri2", region: "South Korea", avatar: "assets/avatars/gyeouri2.png" },
      { name: "dimpleicious", region: "Pakistan", avatar: "assets/avatars/dimpleicious.png" },
      { name: "adhamsrour", region: "Arabic", avatar: "assets/avatars/adhamsrour_jul5.png" },
      { name: "egon8", region: "Thailand", avatar: "assets/avatars/egon8.png" },
      { name: "andrei0x45", region: "Portuguese", avatar: "assets/avatars/andrei0x45_jul5.png" },
      { name: "iurii041965", region: "Ukraine", avatar: "assets/avatars/iurii041965.png" },
      { name: "nocturnehq", region: "General", avatar: "assets/avatars/nocturnehq_jul5.png" }
    ]
  },
  {
    date: "June 28, 2026",
    isLatest: false,
    members: [
      { name: "mars128", region: "CIS", avatar: "assets/avatars/mars128.png" },
      { name: "jackneverdmfirst", region: "India", avatar: "assets/avatars/jackneverdmfirst.png" },
      { name: "luongdo_84429", region: "Vietnam", avatar: "assets/avatars/luongdo_84429.png" },
      { name: "svagewow_", region: "China", avatar: "assets/avatars/svagewow_.png" },
      { name: "fuatacarfa", region: "Turkey", avatar: "assets/avatars/fuatacarfa_jun28.png" },
      { name: "web3kawser", region: "Bangladesh", avatar: "assets/avatars/web3kawser.png" },
      { name: "0xaella", region: "Indonesia", avatar: "assets/avatars/0xaella.png" },
      { name: "starlat007", region: "Africa", avatar: "assets/avatars/starlat007.png" },
      { name: "boomcrypto59", region: "South Korea", avatar: "assets/avatars/boomcrypto59.png" },
      { name: "0xshinzo_", region: "Pakistan", avatar: "assets/avatars/0xshinzo_.png" },
      { name: "hosam_web3", region: "Arabic", avatar: "assets/avatars/hosam_web3_jun28.png" },
      { name: "jamesnanox", region: "Thailand", avatar: "assets/avatars/jamesnanox_jun28.png" },
      { name: "j0s3luiz", region: "Portuguese", avatar: "assets/avatars/j0s3luiz_jun28.png" },
      { name: "printsessaintsesta", region: "Ukraine", avatar: "assets/avatars/printsessaintsesta.png" },
      { name: "ayushkumar0437", region: "General", avatar: "assets/avatars/ayushkumar0437.png" }
    ]
  }
];

var currentSpotlightIndex = 0;

function renderCommunitySpotlight() {
  var data = spotlightHistory[currentSpotlightIndex];
  var container = document.getElementById("communitySpotlightContainer");
  if (!container) return;

  var isFirst = currentSpotlightIndex === 0;
  var isLast = currentSpotlightIndex === spotlightHistory.length - 1;

  container.innerHTML = 
    "<div class=\"flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/[0.08] pb-3.5\">" +
      "<div class=\"flex items-center gap-3\">" +
        "<div class=\"w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-base shadow-sm\">🔦</div>" +
        "<div>" +
          "<div class=\"flex items-center gap-2\">" +
            "<h3 class=\"text-base font-extrabold text-brand-text\">Community Spotlight: Members of the Week</h3>" +
            "<span class=\"text-xs font-mono font-bold bg-amber-100/80 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-200/60\">📅 " + data.date + "</span>" +
            (data.isLatest ? "<span class=\"text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200\">LATEST</span>" : "") +
          "</div>" +
          "<p class=\"text-[11px] text-black/60 font-mono mt-0.5\">Recognizing 15 top regional contributors and community champions across the globe</p>" +
        "</div>" +
      "</div>" +
      "<div class=\"flex items-center gap-2 self-start sm:self-auto\">" +
        "<button onclick=\"prevSpotlightDate()\" " + (isLast ? "disabled" : "") + " class=\"px-3 py-1.5 rounded-xl border border-black/10 flex items-center gap-1.5 text-xs font-mono font-bold transition-all " + (isLast ? "opacity-30 cursor-not-allowed bg-black/[0.02] text-black/40" : "bg-white hover:bg-black/5 active:scale-95 text-brand-text shadow-sm") + "\" title=\"Previous Spotlight Date\">" +
          "<span>← Prev Date</span>" +
        "</button>" +
        "<span class=\"text-xs font-mono font-bold text-black/50 px-1\">" + (currentSpotlightIndex + 1) + " / " + spotlightHistory.length + "</span>" +
        "<button onclick=\"nextSpotlightDate()\" " + (isFirst ? "disabled" : "") + " class=\"px-3 py-1.5 rounded-xl border border-black/10 flex items-center gap-1.5 text-xs font-mono font-bold transition-all " + (isFirst ? "opacity-30 cursor-not-allowed bg-black/[0.02] text-black/40" : "bg-white hover:bg-black/5 active:scale-95 text-brand-text shadow-sm") + "\" title=\"Next Spotlight Date\">" +
          "<span>Next Date →</span>" +
        "</button>" +
      "</div>" +
    "</div>" +

    (data.image
      ? "<div class=\"pt-1 space-y-3\">" +
          "<img src=\"" + data.image + "\" alt=\"Members of the Week " + escapeHtml(data.date) + "\" class=\"w-full rounded-xl border border-black/[0.06] shadow-sm\" loading=\"lazy\" />" +
          ((data.members && data.members.length)
            ? "<div class=\"flex flex-wrap gap-1.5\">" + data.members.map(function(m) {
                return "<span class=\"text-[10px] font-mono font-semibold px-2 py-0.5 bg-[#F6F4EE] rounded-full border border-black/[0.06] text-slate-700\">" + escapeHtml(m.name) + "</span>";
              }).join("") + "</div>"
            : "") +
        "</div>"
      : "<div class=\"grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 pt-1\">" +
          data.members.map(function(m) {
            return "<div class=\"p-3.5 bg-[#F6F4EE] rounded-xl border border-black/[0.06] flex flex-col items-center text-center space-y-2 shadow-sm hover:border-[#205446] transition-all cursor-default select-none\">" +
              "<img src=\"" + m.avatar + "\" alt=\"" + escapeHtml(m.name) + "\" class=\"w-12 h-12 rounded-full border border-black/10 shadow-sm object-cover bg-slate-800\" onerror=\"this.src='https://api.dicebear.com/7.x/identicon/svg?seed=" + m.name + "'\" />" +
              "<div class=\"text-xs font-bold text-brand-text truncate w-full\">" + escapeHtml(m.name) + "</div>" +
              "<span class=\"text-[10px] font-mono font-semibold px-2 py-0.5 bg-white rounded-full border border-black/[0.06] text-slate-600\">" + escapeHtml(m.region) + "</span>" +
            "</div>";
          }).join("") +
        "</div>");
}

function prevSpotlightDate() {
  if (currentSpotlightIndex < spotlightHistory.length - 1) {
    currentSpotlightIndex++;
    renderCommunitySpotlight();
  }
}

function nextSpotlightDate() {
  if (currentSpotlightIndex > 0) {
    currentSpotlightIndex--;
    renderCommunitySpotlight();
  }
}

// ══════════════════════════════════════════════════════
// LIVE DATA LOADER — Verse Agent output is the source of truth
// ══════════════════════════════════════════════════════
// The Verse Agent (agent/sync.js) writes data/quiz.json and data/spotlight.json
// from Discord. On the live site those files win. When index.html is opened
// directly from disk (file://) fetch is blocked, so we silently keep the
// embedded arrays above as an offline fallback.
function loadLiveData() {
  if (typeof fetch !== "function") return;

  // Projects are the single source of truth. Adding an entry here makes the
  // count, analytics cards, charts, sector bars, and leaderboard all recompute.
  fetch("data/projects.json", { cache: "no-store" })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (list) {
      if (Array.isArray(list) && list.length) {
        allProjects = list;
        applyFilters(document.getElementById("dappSearchInput") ? document.getElementById("dappSearchInput").value : "");
        renderAllViews();
      }
    })
    .catch(function () { /* offline / file:// — keep embedded fallback */ });

  fetch("data/quiz.json", { cache: "no-store" })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (list) {
      if (Array.isArray(list) && list.length) {
        quizHistory = list;
        currentQuizIndex = 0;
        renderQuizChampions();
      }
    })
    .catch(function () { /* offline / file:// — keep embedded fallback */ });

  fetch("data/spotlight.json", { cache: "no-store" })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (list) {
      if (Array.isArray(list) && list.length) {
        spotlightHistory = list;
        currentSpotlightIndex = 0;
        renderCommunitySpotlight();
      }
    })
    .catch(function () { /* offline / file:// — keep embedded fallback */ });
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadLiveData);
  } else {
    loadLiveData();
  }
}

