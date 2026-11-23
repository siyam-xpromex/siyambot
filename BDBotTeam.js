"use strict";

const fs = require("fs");
const os = require("os");
const path = require("path");
const v8 = require("v8");

const FILE = __filename;
const MB = 1024 * 1024;
const ROOT = path.dirname(FILE);

const num = (v, d) => {
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : d;
};

const numZ = (v, d) => {
  const n = Number(v);
  return v !== undefined && v !== "" && Number.isFinite(n) && n >= 0 ? n : d;
};

const round = (n) => Math.round(n * 10) / 10;

function readLimit(p) {
  try {
    const s = fs.readFileSync(p, "utf8").trim();
    if (s === "max") return null;
    const n = Number(s);
    return Number.isFinite(n) && n > 0 ? n : null;
  } catch (_) {
    return null;
  }
}

function detectLimit() {
  const forced = num(process.env.BOT_MEMORY_LIMIT_MB, 0);
  if (forced) return { mb: forced, source: "env BOT_MEMORY_LIMIT_MB" };

  const total = os.totalmem() / MB;
  const cg = readLimit("/sys/fs/cgroup/memory.max") || readLimit("/sys/fs/cgroup/memory/memory.limit_in_bytes");

  if (cg && cg / MB < total * 0.98) {
    return { mb: Math.floor(cg / MB), source: "container limit" };
  }

  return { mb: Math.floor(total), source: "system RAM" };
}

function launcherArgs() {
  if (String(process.env.SIYAM_MEMGUARD).toLowerCase() === "off") return [];

  const { mb } = detectLimit();
  const pct = Math.min(Math.max(num(process.env.SIYAM_HEAP_PERCENT, 65), 30), 90);
  const heap = Math.max(128, Math.floor((mb * pct) / 100));
  const args = ["--expose-gc", "--max-old-space-size=" + heap];

  if (mb <= 768 && process.env.SIYAM_OPTIMIZE_FOR_SIZE !== "0") {
    args.push("--optimize-for-size");
  }

  return args;
}

function start() {
  if (global.__bdBotTeamGuard) return;
  if (String(process.env.SIYAM_MEMGUARD).toLowerCase() === "off") return;

  global.__bdBotTeamGuard = true;

  const limit = detectLimit();
  const limitMB = limit.mb;
  const heapLimitMB = v8.getHeapStatistics().heap_size_limit / MB;

  const SOFT = num(process.env.SIYAM_MEM_SOFT, 70) / 100;
  const HARD = num(process.env.SIYAM_MEM_HARD, 88) / 100;
  const INTERVAL = num(process.env.SIYAM_MEM_INTERVAL_MS, 30 * 1000);
  const MIN_UPTIME_RESTART = numZ(process.env.SIYAM_MEM_MIN_UPTIME_MS, 10 * 60 * 1000);
  const CACHE_MAX_AGE = 30 * 60 * 1000;
  const SUMMARY_EVERY = 30 * 60 * 1000;
  const LEAK_EVERY = 10 * 60 * 1000;

  const MEDIA = /\.(mp3|mp4|m4a|wav|ogg|webm|mov|mkv|png|jpe?g|gif|webp|bmp|tmp)$/i;

  const CACHE_DIRS = [
    path.join(ROOT, "Script", "commands", "cache"),
    path.join(ROOT, "Script", "events", "cache")
  ];

  const log = (m) => console.log("[BD Bot Team] " + m);

  const RESTART_FILE = path.join(ROOT, ".bdbotteam-restarts.json");
  const MAX_RESTARTS = numZ(process.env.SIYAM_MEM_MAX_RESTARTS, 0);
  const RESTART_WINDOW = 6 * 60 * 60 * 1000;

  function recentRestarts() {
    try {
      const arr = JSON.parse(fs.readFileSync(RESTART_FILE, "utf8"));
      return Array.isArray(arr) ? arr.filter((x) => Date.now() - x < RESTART_WINDOW) : [];
    } catch (_) {
      return [];
    }
  }

  function noteRestart() {
    try {
      fs.writeFileSync(RESTART_FILE, JSON.stringify([...recentRestarts(), Date.now()]));
    } catch (_) {}
  }

  function stats() {
    const m = process.memoryUsage();

    const s = {
      rssMB: round(m.rss / MB),
      heapUsedMB: round(m.heapUsed / MB),
      heapTotalMB: round(m.heapTotal / MB),
      externalMB: round((m.external || 0) / MB),
      buffersMB: round((m.arrayBuffers || 0) / MB),
      limitMB,
      heapLimitMB: Math.round(heapLimitMB),
      source: limit.source
    };

    s.pressure = Math.max(s.rssMB / limitMB, s.heapUsedMB / heapLimitMB);
    s.percent = Math.round(s.pressure * 100);

    return s;
  }

  function format() {
    const s = stats();

    return (
      `RAM ${s.rssMB}MB / ${s.limitMB}MB (${Math.round((s.rssMB / s.limitMB) * 100)}%) | ` +
      `Heap ${s.heapUsedMB}/${s.heapLimitMB}MB (${Math.round((s.heapUsedMB / s.heapLimitMB) * 100)}%) | ` +
      `External ${s.externalMB}MB | সীমার উৎস: ${s.source}`
    );
  }

  function cleanup(reason) {
    const before = process.memoryUsage().rss / MB;
    const done = [];

    try {
      const c = global.client;

      if (c) {
        for (const key of ["handleReply", "handleReaction"]) {
          const arr = c[key];

          if (Array.isArray(arr) && arr.length > 200) {
            const removed = arr.length - 100;
            arr.splice(0, removed);
            done.push(`${key} -${removed}`);
          }
        }

        if (c.cooldowns instanceof Map) {
          let removed = 0;
          const now = Date.now();

          for (const [cmd, users] of c.cooldowns) {
            if (!(users instanceof Map)) continue;

            for (const [uid, ts] of users) {
              if (typeof ts === "number" && now - ts > 60 * 60 * 1000) {
                users.delete(uid);
                removed++;
              }
            }

            if (users.size === 0) c.cooldowns.delete(cmd);
          }

          if (removed) done.push(`cooldown -${removed}`);
        }
      }
    } catch (_) {}

    try {
      let files = 0;
      let bytes = 0;
      const now = Date.now();

      for (const dir of CACHE_DIRS) {
        if (!fs.existsSync(dir)) continue;

        for (const f of fs.readdirSync(dir)) {
          if (!MEDIA.test(f)) continue;

          const p = path.join(dir, f);

          try {
            const st = fs.statSync(p);

            if (st.isFile() && now - st.mtimeMs > CACHE_MAX_AGE) {
              fs.unlinkSync(p);
              files++;
              bytes += st.size;
            }
          } catch (_) {}
        }
      }

      if (files) done.push(`cache ফাইল -${files} (${round(bytes / MB)}MB ডিস্ক)`);
    } catch (_) {}

    try {
      if (typeof global.gc === "function") {
        global.gc();
        done.push("GC");
      }
    } catch (_) {}

    const after = process.memoryUsage().rss / MB;

    log(`ক্লিনআপ (${reason}): ${done.join(", ") || "কিছু পাওয়া যায়নি"} | RSS ${round(before)} → ${round(after)}MB`);

    return {
      before: round(before),
      after: round(after),
      done
    };
  }

  const startedAt = Date.now();

  let lastCleanup = 0;
  let hardStrikes = 0;
  let restarting = false;
  let restartBlockedLogged = false;
  let lastSummary = Date.now();
  let lastLeakCheck = Date.now();

  const leakSamples = [];

  function check() {
    const now = Date.now();
    let s = stats();

    if (s.pressure >= SOFT && now - lastCleanup > 60 * 1000) {
      lastCleanup = now;
      cleanup(`মেমোরি ${s.percent}%`);
      s = stats();
    }

    if (s.pressure >= HARD) {
      hardStrikes++;

      if (hardStrikes === 1 || hardStrikes % 20 === 0) {
        log(`⚠️ মেমোরি খুব বেশি: ${s.percent}% (${format()})`);
      }

      if (hardStrikes >= 2 && !restarting) {
        if (now - startedAt >= MIN_UPTIME_RESTART && recentRestarts().length >= MAX_RESTARTS) {
          if (!restartBlockedLogged) {
            restartBlockedLogged = true;
            log(`🛑 মেমোরি বেশি, কিন্তু রিস্টার্ট বন্ধ (সীমা ${MAX_RESTARTS})। হোস্টের RAM বাড়ান বা অপ্রয়োজনীয় কমান্ড বন্ধ করুন।`);
          }
        } else if (now - startedAt >= MIN_UPTIME_RESTART) {
          restarting = true;
          noteRestart();
          log(`🔁 OOM ক্র্যাশের আগেই নিরাপদে রিস্টার্ট দিচ্ছি। ${format()}`);
          setTimeout(() => process.exit(75), 1500);
        } else if (!restartBlockedLogged) {
          restartBlockedLogged = true;
          log("ℹ️ বট সবে চালু হয়েছে, তাই এখনই রিস্টার্ট দিচ্ছি না।");
        }
      }
    } else {
      hardStrikes = 0;
      restartBlockedLogged = false;
    }

    if (now - lastLeakCheck >= LEAK_EVERY && typeof global.gc === "function") {
      lastLeakCheck = now;
      global.gc();

      leakSamples.push(process.memoryUsage().heapUsed / MB);

      if (leakSamples.length > 6) leakSamples.shift();

      if (leakSamples.length >= 4) {
        const rising = leakSamples.every((v, i) => i === 0 || v >= leakSamples[i - 1] - 1);
        const growth = leakSamples[leakSamples.length - 1] - leakSamples[0];

        if (rising && growth > 40) {
          log(`🔍 সম্ভাব্য মেমোরি লিক: GC-র পরেও heap ${round(growth)}MB বেড়েছে (${leakSamples.map(round).join(" → ")})`);
        }
      }
    }

    if (now - lastSummary >= SUMMARY_EVERY) {
      lastSummary = now;
      log(format());
    }
  }

  let lastPreClean = "";

  const nightTimer = setInterval(() => {
    try {
      const t = new Date().toLocaleTimeString("en-GB", {
        timeZone: "Asia/Dhaka",
        hour12: false
      }).slice(0, 5);

      const day = new Date().toLocaleDateString("en-CA", {
        timeZone: "Asia/Dhaka"
      });

      if ((t === "23:55" || t === "00:10") && lastPreClean !== day + t) {
        lastPreClean = day + t;
        cleanup("রাতের আগাম ক্লিনআপ " + t);
      }
    } catch (_) {}
  }, 20 * 1000);

  if (nightTimer.unref) nightTimer.unref();

  const timer = setInterval(check, INTERVAL);

  if (timer.unref) timer.unref();

  global.siyamMemory = {
    stats,
    format,
    cleanup: () => cleanup("ম্যানুয়াল"),
    limitMB,
    heapLimitMB
  };

  log(`চালু ✅ | Credit: Siyam Hasan | Nijhum Chat Bot | বিডি বট টিম\n[BD Bot Team] ${format()} | সফট ${Math.round(SOFT * 100)}% / হার্ড ${Math.round(HARD * 100)}%` +
    (typeof global.gc === "function" ? "" : " | ⚠️ --expose-gc নেই (GC ক্লিন সীমিত)"));
}

if (process.env.SIYAM_MEMGUARD_CHILD === "1") start();

module.exports = {
  FILE,
  launcherArgs,
  detectLimit,
  start
};
