const chalk = require("chalk");
const moment = require("moment-timezone");

let consoleName = "BOT";

const CREDIT = "𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑";

const colors = [
  "FF9900", "FFFF33", "33FFFF", "FF99FF",
  "FF3366", "FFFF66", "FF00FF", "66FF99",
  "00CCFF", "FF0099", "FF0066", "7900FF",
  "93FFD8", "CFFFDC", "FF5B00", "3B44F6",
  "A6D1E6", "7F5283", "A66CFF", "F05454",
  "FCF8E8", "94B49F", "47B5FF", "B8FFF9",
  "42C2FF", "FF7396"
];

const randomColor = () =>
  "#" + colors[Math.floor(Math.random() * colors.length)];

const rainbow = (text) =>
  Array.from(text)
    .map((ch) => chalk.hex(randomColor()).bold(ch))
    .join("");

function init(name) {
  consoleName = name || consoleName;
}

const line = (text) =>
  chalk.hex(randomColor())("» ") + text;

const field = (icon, label, value) =>
  line(
    chalk.hex(randomColor()).bold(`${icon} ${label}`) +
      chalk.gray(" ➜ ") +
      chalk.hex(randomColor())(value)
  );

const border = () =>
  chalk.hex(randomColor())("───────────────");

function log({
  groupName = "Name does not exist",
  threadID = "Unknown",
  userName = "Unknown User",
  senderID = "Unknown",
  content = "Photos, videos or special characters"
} = {}) {
  const time = moment
    .tz("Asia/Dhaka")
    .format("dddd, DD MMMM YYYY • hh:mm:ss A");

  const out = [
    "",
    line(chalk.bold.hex("FFD700")(`👑 ${CREDIT}`)),
    border(),
    line(rainbow(`${consoleName} LOGGER`)),
    border(),
    field("🔰", "Group", groupName),
    field("🆔", "Group ID", threadID),
    field("👤", "User", userName),
    field("🤗", "User ID", senderID),
    field("🙄", "Message", content),
    border(),
    line(chalk.hex(randomColor())(`🕒 ${time}`)),
    border(),
    line(chalk.hex(randomColor()).italic("🧚‍♀️ 𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧")),
    ""
  ];

  console.log(out.join("\n"));
}

module.exports = { init, log };
