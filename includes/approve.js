
const fs = require("fs");
const path = require("path");

const CREDITS = "𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍";

const FILE = path.join(
  __dirname,
  "..",
  "Script",
  "commands",
  "cache",
  "approvedThreads.json"
);

const CONFIG_FILE = path.join(
  __dirname,
  "..",
  "config.json"
);

let state = {
  seeded: false,
  threads: {},
  pending: {}
};

try {
  if (fs.existsSync(FILE)) {
    const s = JSON.parse(fs.readFileSync(FILE, "utf8"));

    if (s && typeof s.threads === "object") {
      state = {
        seeded: !!s.seeded,
        threads: s.threads,
        pending:
          s.pending && typeof s.pending === "object"
            ? s.pending
            : {}
      };
    }
  }
} catch (_) {}

function save() {
  try {
    fs.mkdirSync(path.dirname(FILE), { recursive: true });
    fs.writeFileSync(FILE, JSON.stringify(state, null, 2));
  } catch (e) {
    console.log("[𝐀𝐏𝐏𝐑𝐎𝐕𝐀𝐋] 𝐒𝐚𝐯𝐞 𝐄𝐫𝐫𝐨𝐫:", e.message);
  }
}

const isApproved = id => !!state.threads[String(id)];
const isPending = id => !!state.pending[String(id)];

function approve(id, by) {
  const k = String(id);

  state.threads[k] = {
    by: by ? String(by) : null,
    at: new Date().toISOString()
  };

  delete state.pending[k];
  save();
}

function addPending(id, by) {
  const k = String(id);

  if (state.threads[k]) return;

  state.pending[k] = {
    by: by ? String(by) : null,
    at: new Date().toISOString()
  };

  save();
}

function remove(id) {
  const k = String(id);
  let changed = false;

  if (state.threads[k]) {
    delete state.threads[k];
    changed = true;
  }

  if (state.pending[k]) {
    delete state.pending[k];
    changed = true;
  }

  if (changed) save();
}

const list = () => Object.keys(state.threads);
const pendingList = () => Object.keys(state.pending);
const getPendingInfo = id => state.pending[String(id)] || null;

async function approveById(api, tid, by) {
  approve(tid, by);
  return true;
}

function readConfig() {
  try {
    return JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));
  } catch (_) {
    return global.config || {};
  }
}

function getAdminBots() {
  const cfg = readConfig();
  const g = global.config || {};

  return [
    ...new Set([
      ...(cfg.ADMINBOT || []),
      ...(g.ADMINBOT || [])
    ].map(String))
  ];
}

function isAdmin(id) {
  const cfg = readConfig();
  const g = global.config || {};

  const all = [
    ...(cfg.ADMINBOT || []),
    ...(cfg.DEVELOPER || []),
    ...(g.ADMINBOT || []),
    ...(g.DEVELOPER || [])
  ].map(String);

  return all.includes(String(id));
}

function getPrefix() {
  const cfg = readConfig();

  return (
    cfg.PREFIX ||
    (global.config && global.config.PREFIX) ||
    "/"
  );
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function notifyAdmins(api, tid, adderID) {
  try {
    let groupName = "নামহীন গ্রুপ";
    let members = "?";

    try {
      const info = await api.getThreadInfo(tid);

      groupName = info.threadName || info.name || groupName;
      members = (info.participantIDs || []).length || "?";
    } catch (_) {}

    let adderName = "অজানা";

    try {
      const u = await api.getUserInfo(adderID);

      adderName =
        (u && u[adderID] && u[adderID].name) ||
        "অজানা";
    } catch (_) {}

    let time;

    try {
      time = require("moment-timezone")
        .tz("Asia/Dhaka")
        .format("DD/MM/YYYY hh:mm:ss A");
    } catch (_) {
      time = new Date().toLocaleString();
    }

    const msg =
`» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑
───────────────
» 🔔 𝗡𝗘𝗪 𝗚𝗥𝗢𝗨𝗣 𝗔𝗗𝗗𝗘𝗗

» 🏠 𝗚𝗥𝗢𝗨𝗣: ${groupName}
» 🆔 𝗚𝗥𝗢𝗨𝗣 𝗜𝗗: ${tid}
» 👥 𝗠𝗘𝗠𝗕𝗘𝗥𝗦: ${members}

» 👤 𝗔𝗗𝗗𝗘𝗗 𝗕𝗬: ${adderName}
» 🆔 𝗨𝗦𝗘𝗥 𝗜𝗗: ${adderID}
» 🔗 𝗣𝗥𝗢𝗙𝗜𝗟𝗘: https://www.facebook.com/${adderID}

» 🕒 𝗧𝗜𝗠𝗘: ${time}
» 📌 𝗦𝗧𝗔𝗧𝗨𝗦: ⏳ 𝗣𝗘𝗡𝗗𝗜𝗡𝗚

» 👉 𝗨𝗦𝗘: ${getPrefix()}pending
───────────────
» 🧚‍♀️ 𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧`;

    for (const adminID of getAdminBots()) {
      try {
        await api.sendMessage(msg, adminID);
      } catch (e) {
        console.log(
          "[𝐀𝐏𝐏𝐑𝐎𝐕𝐀𝐋] 𝐀𝐝𝐦𝐢𝐧 𝐍𝐨𝐭𝐢𝐟𝐢𝐜𝐚𝐭𝐢𝐨𝐧 𝐅𝐚𝐢𝐥𝐞𝐝:",
          adminID
        );
      }
    }
  } catch (e) {
    console.log("[𝐀𝐏𝐏𝐑𝐎𝐕𝐀𝐋] 𝐍𝐨𝐭𝐢𝐟𝐲 𝐄𝐫𝐫𝐨𝐫:", e.message);
  }
}

function seedOnce() {
  if (state.seeded) return true;

  const ids = (global.data && global.data.allThreadID) || [];

  if (ids.length === 0 && process.uptime() < 120) {
    return false;
  }

  ids.forEach(id => {
    state.threads[String(id)] = {
      by: "seed",
      at: new Date().toISOString()
    };
  });

  state.seeded = true;
  save();

  console.log(
    `[𝐀𝐏𝐏𝐑𝐎𝐕𝐀𝐋] ${ids.length} টি আগের 𝐓𝐡𝐫𝐞𝐚𝐝 অনুমোদিত তালিকায় যোগ করা হয়েছে`
  );

  return true;
}

const warned = new Map();

function warnOnce(tid) {
  const now = Date.now();

  if (now - (warned.get(tid) || 0) > 10 * 60 * 1000) {
    warned.set(tid, now);

    console.log(
      `[𝐀𝐏𝐏𝐑𝐎𝐕𝐀𝐋] ${tid} অনুমোদিত নয় — 𝐄𝐯𝐞𝐧𝐭 𝐈𝐠𝐧𝐨𝐫𝐞𝐝`
    );
  }
}

function allow(event, api) {
  const tid = String(event.threadID || "");

  if (!tid) return true;
  if (!seedOnce()) return true;

  const actor = String(
    event.type === "message_reaction"
      ? event.userID
      : event.type === "event"
        ? event.author || event.senderID
        : event.senderID
  );

  const isGroup =
    event.isGroup === true ||
    (event.isGroup === undefined && actor !== tid);

  if (!isGroup) return true;

  let botID = "";

  try {
    botID = String(api.getCurrentUserID());
  } catch (_) {}

  if (
    event.type === "event" &&
    event.logMessageType === "log:unsubscribe" &&
    String(
      event.logMessageData &&
      event.logMessageData.leftParticipantFbId
    ) === botID
  ) {
    remove(tid);
    return false;
  }

  if (
    event.type === "event" &&
    event.logMessageType === "log:subscribe"
  ) {
    const d = event.logMessageData || {};

    const added = (d.addedParticipants || []).map(
      p => String(p.userFbId)
    );

    if (added.includes(botID)) {
      if (isAdmin(actor)) {
        approve(tid, actor);
        return true;
      }

      addPending(tid, actor);
      notifyAdmins(api, tid, actor);
      warnOnce(tid);

      return false;
    }
  }

  if (isApproved(tid)) return true;

  const isMsg =
    event.type === "message" ||
    event.type === "message_reply";

  if (
    isMsg &&
    isAdmin(actor) &&
    typeof event.body === "string"
  ) {
    const prefix = escapeRegex(getPrefix());

    const re = new RegExp(
      "^\\s*(?:" +
        prefix +
        ")?\\s*(approve|pending|out)\\b",
      "i"
    );

    if (re.test(event.body)) return true;
  }

  if (!isPending(tid)) {
    addPending(tid, null);
  }

  warnOnce(tid);

  return false;
}

module.exports = {
  allow,
  approve,
  approveById,
  remove,
  isApproved,
  isPending,
  list,
  pendingList,
  getPendingInfo,
  isAdmin,
  credits: CREDITS
};
