
module.exports = function ({ api, models, logAnthorName }) {
  const fs = require("fs");
  const axios = require("axios");
  const moment = require("moment-timezone");

  const Users = require("./controllers/users")({ models, api });
  const Threads = require("./controllers/threads")({ models, api });
  const Currencies = require("./controllers/currencies")({ models });

  const log = require("../utils/log.js");
  const silent = require("./silent");
  const power = require("./power");
  const solo = require("./solo");

  silent.guardApi(api);
  power.guardApi(api);
  solo.guardApi(api);

  var lastDay = moment.tz("Asia/Dhaka").day();

  const handleMention = async (api, event) => {
    try {
      const { threadID, body } = event;

      if (event.mentions && Object.keys(event.mentions).length > 0) return;

      if (event.messageReply && event.messageReply.senderID) {
        event.mentions = {
          [event.messageReply.senderID]: ""
        };
        return;
      }

      if (!body) return;

      const mentionMatch = body.match(/@([^\s]+)/);
      if (!mentionMatch) return;

      const searchName = mentionMatch[1].toLowerCase().trim();

      const threadInfo = await Promise.race([
        api.getThreadInfo(threadID),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("mention lookup timeout")), 3000)
        )
      ]);

      const userInfo = threadInfo.userInfo || [];
      const nicknames = threadInfo.nicknames || {};

      let matchedUserID = null;

      for (let userID in nicknames) {
        if (!nicknames[userID]) continue;

        if (
          nicknames[userID]
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(searchName.replace(/\s+/g, ""))
        ) {
          matchedUserID = userID;
          break;
        }
      }

      if (!matchedUserID) {
        for (let user of userInfo) {
          if (!user.name) continue;

          if (
            user.name
              .toLowerCase()
              .replace(/\s+/g, "")
              .includes(searchName.replace(/\s+/g, ""))
          ) {
            matchedUserID = user.id;
            break;
          }
        }
      }

      if (!matchedUserID) {
        for (let user of userInfo) {
          if (!user.name) continue;

          const nameParts = user.name.toLowerCase().split(/[\s._-]+/);

          if (nameParts.some(part => part.startsWith(searchName))) {
            matchedUserID = user.id;
            break;
          }
        }
      }

      if (!matchedUserID && searchName.length >= 2) {
        for (let user of userInfo) {
          if (!user.name) continue;

          if (
            user.name
              .toLowerCase()
              .replace(/\s+/g, "")
              .startsWith(searchName.replace(/\s+/g, ""))
          ) {
            matchedUserID = user.id;
            break;
          }
        }
      }

      if (matchedUserID) {
        event.mentions = {
          [matchedUserID]: ""
        };
      }
    } catch (error) {}
  };

  const msgOwner = global.__msgOwner = global.__msgOwner || new Map();
  const botMsgs = global.__botMsgs = global.__botMsgs || new Map();

  const remember = (map, key, value, max) => {
    if (!key) return;

    map.delete(key);
    map.set(key, value);

    while (map.size > max) {
      map.delete(map.keys().next().value);
    }
  };

  if (typeof api.sendMessage === "function" && !api.__sentTracked) {
    const send = api.sendMessage;

    api.sendMessage = function (...args) {
      const callbackIndex = args.findIndex(
        (arg, index) => index >= 2 && typeof arg === "function"
      );

      if (callbackIndex >= 0) {
        const callback = args[callbackIndex];

        args[callbackIndex] = function (error, info) {
          try {
            if (info && info.messageID) {
              remember(botMsgs, String(info.messageID), 1, 3000);
            }
          } catch (error) {}

          return callback.apply(this, arguments);
        };
      }

      const result = send.apply(this, args);

      if (result && typeof result.then === "function") {
        result
          .then(info => {
            if (info && info.messageID) {
              remember(botMsgs, String(info.messageID), 1, 3000);
            }
          })
          .catch(() => {});
      }

      return result;
    };

    Object.defineProperty(api, "__sentTracked", {
      value: true,
      enumerable: false
    });
  }

  const interactionDirectory =
    __dirname + "/../Script/commands/checktuongtac/";

  const makeFrame = (title, rows) => {
    return [
      "» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑",
      "───────────────",
      "» " + title,
      "───────────────",
      ...rows,
      "───────────────",
      "» 🧚‍♀️ 𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧"
    ].join("\n");
  };

  const toBold = value => {
    const normal = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const bold = "𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵";

    return String(value).split("").map(char => {
      const index = normal.indexOf(char);
      return index === -1 ? char : bold[index];
    }).join("");
  };

  setInterval(async () => {
    const currentDay = moment.tz("Asia/Dhaka").day();

    const allowedIDs = [
      ...(global.config.DEVELOPER || []),
      ...(global.config.ADMINBOT || []),
      ...(global.developers || [])
    ];

    try {
      if (lastDay != currentDay) {
        lastDay = currentDay;

        const files = fs.readdirSync(interactionDirectory).filter(file => {
          const id = file.replace(".json", "");

          return (
            allowedIDs.includes(id) ||
            global.data.allThreadID.includes(id)
          );
        });

        console.log(logAnthorName + " ");

        for (const file of files) {
          const data = JSON.parse(
            fs.readFileSync(interactionDirectory + file)
          );

          let dailyData = [];
          let rank = 1;

          for (const user of data.day) {
            const name =
              (await Users.getNameUser(user.id)) ||
              logAnthorName + " ";

            user.name = name;
            dailyData.push(user);
          }

          dailyData.sort((a, b) => {
            if (a.count > b.count) return -1;
            if (a.count < b.count) return 1;
            return a.name.localeCompare(b.name);
          });

          const rows = dailyData.slice(0, 10).map(user => {
            return "» " + toBold(rank++) +
              ". " + toBold(user.name) +
              " — " + toBold(user.count) + " 𝗺𝗲𝘀𝘀𝗮𝗴𝗲";
          });

          const message = makeFrame("📊 𝗗𝗔𝗜𝗟𝗬 𝗧𝗢𝗣 𝟭𝟬", rows);

          api.sendMessage(
            message,
            file.replace(".json", ""),
            error => error ? console.log(error) : ""
          );

          data.day.forEach(user => {
            user.count = 0;
          });

          data.time = currentDay;

          fs.writeFileSync(
            interactionDirectory + file,
            JSON.stringify(data, null, 4)
          );
        }

        if (currentDay == 1) {
          console.log(logAnthorName + " ");

          for (const file of files) {
            const data = JSON.parse(
              fs.readFileSync(interactionDirectory + file)
            );

            let weeklyData = [];
            let rank = 1;

            for (const user of data.week) {
              const name =
                (await Users.getNameUser(user.id)) ||
                "Sahu Hun Yar";

              user.name = name;
              weeklyData.push(user);
            }

            weeklyData.sort((a, b) => {
              if (a.count > b.count) return -1;
              if (a.count < b.count) return 1;
              return a.name.localeCompare(b.name);
            });

            const rows = weeklyData.slice(0, 10).map(user => {
              return "» " + toBold(rank++) +
                ". " + toBold(user.name) +
                " — " + toBold(user.count) + " 𝗺𝗲𝘀𝘀𝗮𝗴𝗲";
            });

            const message = makeFrame("🏆 𝗪𝗘𝗘𝗞𝗟𝗬 𝗧𝗢𝗣 𝟭𝟬", rows);

            api.sendMessage(
              message,
              file.replace(".json", ""),
              error => error ? console.log(error) : ""
            );

            data.week.forEach(user => {
              user.count = 0;
            });

            fs.writeFileSync(
              interactionDirectory + file,
              JSON.stringify(data, null, 4)
            );
          }
        }

        global.client.sending_top = false;
      }
    } catch (error) {
      console.error(error);
    }
  }, 10000);

  (async function () {
    try {
      log(
        global.getText("listen", "startLoadEnvironment"),
        "[ " + logAnthorName + " ]"
      );

      const threadList = await Threads.getAll();

      const userList = await Users.getAll([
        "userID",
        "name",
        "data"
      ]);

      const currencyList = await Currencies.getAll([
        "userID"
      ]);

      for (const thread of threadList) {
        const threadID = String(thread.threadID);

        global.data.allThreadID.push(threadID);

        global.data.threadData.set(
          threadID,
          thread.data || {}
        );

        global.data.threadInfo.set(
          threadID,
          thread.threadInfo || {}
        );

        if (thread.data && thread.data.banned == true) {
          global.data.threadBanned.set(threadID, {
            reason: thread.data.reason || "",
            dateAdded: thread.data.dateAdded || ""
          });
        }

        if (
          thread.data &&
          thread.data.commandBanned &&
          thread.data.commandBanned.length != 0
        ) {
          global.data.commandBanned.set(
            threadID,
            thread.data.commandBanned
          );
        }

        if (thread.data && thread.data.NSFW) {
          global.data.threadAllowNSFW.push(threadID);
        }
      }

      log.loader(
        global.getText("listen", "loadedEnvironmentThread")
      );

      for (const user of userList) {
        const userID = String(user.userID);

        global.data.allUserID.push(userID);

        if (user.name && user.name.length != 0) {
          global.data.userName.set(userID, user.name);
        }

        if (user.data && user.data.banned == 1) {
          global.data.userBanned.set(userID, {
            reason: user.data.reason || "",
            dateAdded: user.data.dateAdded || ""
          });
        }

        if (
          user.data &&
          user.data.commandBanned &&
          user.data.commandBanned.length != 0
        ) {
          global.data.commandBanned.set(
            userID,
            user.data.commandBanned
          );
        }
      }

      for (const currency of currencyList) {
        global.data.allCurrenciesID.push(
          String(currency.userID)
        );
      }

      log.loader(
        global.getText("listen", "loadedEnvironmentUser")
      );

      log(
        global.getText("listen", "successLoadEnvironment"),
        "[ Script ]"
      );
    } catch (error) {
      return log.loader(
        global.getText("listen", "failLoadEnvironment", error),
        "error"
      );
    }
  })();

  log(
    "[ " +
      global.config.PREFIX +
      " ] • " +
      (!global.config.BOTNAME ? "" : global.config.BOTNAME),
    "[ " + logAnthorName + " ]"
  );

  console.log("══════════════════════════════════════════════");
  console.log("» 👑 𝐒𝐈𝐘𝐀𝐌-𝐇𝐀𝐒𝐀𝐍 👑");
  console.log("» 🧚‍♀️ 𝗡𝗜𝗝𝗛𝗨𝗠 𝗖𝗛𝗔𝗧𝗕𝗢𝗧");
  console.log("══════════════════════════════════════════════");

  const handleCommand = require("./handle/handleCommand")({
    api,
    models,
    Users,
    Threads,
    Currencies
  });

  const handleCommandEvent = require("./handle/handleCommandEvent")({
    api,
    models,
    Users,
    Threads,
    Currencies
  });

  const handleReply = require("./handle/handleReply")({
    api,
    models,
    Users,
    Threads,
    Currencies
  });

  const handleReactionEvent = require("./handle/handleReaction")({
    api,
    models,
    Users,
    Threads,
    Currencies
  });

  const handleEvent = require("./handle/handleEvent")({
    api,
    models,
    Users,
    Threads,
    Currencies
  });

  const handleCreateDatabase = require("./handle/handleCreateDatabase")({
    api,
    Threads,
    Users,
    Currencies,
    models
  });

  const scheduleFile =
    __dirname + "/../Script/commands/cache/datlich.json";

  const monthMilliseconds = {
    1: 2678400000,
    2: 2419200000,
    3: 2678400000,
    4: 2592000000,
    5: 2678400000,
    6: 2592000000,
    7: 2678400000,
    8: 2678400000,
    9: 2592000000,
    10: 2678400000,
    11: 2592000000,
    12: 2678400000
  };

  const convertDateToMilliseconds = dateArray =>
    new Promise(resolve => {
      dateArray.forEach((value, index) => {
        dateArray[index] = parseInt(String(value).trim());
      });

      if (dateArray[1] > 12 || dateArray[1] < 1) {
        return resolve("Your month seems invalid");
      }

      if (
        dateArray[0] >
          (dateArray[1] == 2
            ? dateArray[2] % 4 == 0 ? 29 : 28
            : [1, 3, 5, 7, 8, 10, 12].includes(dateArray[1])
              ? 31
              : 30) ||
        dateArray[0] < 1
      ) {
        return resolve("Your date seems invalid");
      }

      if (dateArray[2] < 2022) {
        return resolve("What era do you live in?");
      }

      if (dateArray[3] > 23 || dateArray[3] < 0) {
        return resolve("Your time seems to be invalid");
      }

      if (dateArray[4] > 59 || dateArray[4] < 0) {
        return resolve("Your minute seems invalid");
      }

      if (dateArray[5] > 59 || dateArray[5] < 0) {
        return resolve("Your seconds seem invalid");
      }

      const year = dateArray[2] - 1970;

      let yearToMS =
        year * 365 * 24 * 60 * 60 * 1000;

      yearToMS +=
        Math.round((year - 2) / 4) *
        24 * 60 * 60 * 1000;

      let monthToMS = 0;

      for (let month = 1; month < dateArray[1]; month++) {
        monthToMS += monthMilliseconds[month];
      }

      if (dateArray[2] % 4 == 0 && dateArray[1] > 2) {
        monthToMS += 86400000;
      }

      const dayToMS = dateArray[0] * 24 * 60 * 60 * 1000;
      const hourToMS = dateArray[3] * 60 * 60 * 1000;
      const minuteToMS = dateArray[4] * 60 * 1000;
      const secondToMS = dateArray[5] * 1000;
      const oneDayToMS = 86400000;

      const timeMs =
        yearToMS +
        monthToMS +
        dayToMS +
        hourToMS +
        minuteToMS +
        secondToMS -
        oneDayToMS;

      resolve(timeMs);
    });

  const processScheduledMessages = async () => {
    if (!fs.existsSync(scheduleFile)) {
      fs.writeFileSync(scheduleFile, JSON.stringify({}, null, 4));
    }

    const schedules = JSON.parse(fs.readFileSync(scheduleFile));

    let currentDateTime = moment()
      .tz("Asia/Dhaka")
      .format("DD/MM/YYYY_HH:mm:ss");

    currentDateTime = currentDateTime.split("_");

    currentDateTime = [
      ...currentDateTime[0].split("/"),
      ...currentDateTime[1].split(":")
    ];

    const pendingMessages = [];

    const currentTime = await convertDateToMilliseconds(currentDateTime);

    const processSchedule = scheduleTime =>
      new Promise(async resolve => {
        const scheduleTimestamp = await convertDateToMilliseconds(
          scheduleTime.split("_")
        );

        if (typeof scheduleTimestamp !== "number") {
          delete schedules[boxID][scheduleTime];
          return resolve();
        }

        if (scheduleTimestamp < currentTime) {
          if (currentTime - scheduleTimestamp < 600000) {
            schedules[boxID][scheduleTime].TID = boxID;
            pendingMessages.push(schedules[boxID][scheduleTime]);
          }

          delete schedules[boxID][scheduleTime];

          fs.writeFileSync(
            scheduleFile,
            JSON.stringify(schedules, null, 4)
          );
        }

        resolve();
      });

    for (const boxID of Object.keys(schedules)) {
      for (const scheduleTime of Object.keys(schedules[boxID])) {
        await processSchedule(scheduleTime);
      }
    }

    for (const el of pendingMessages) {
      try {
        const participantIDs = (
          await Threads.getInfo(el.TID)
        ).participantIDs;

        participantIDs.splice(
          participantIDs.indexOf(api.getCurrentUserID()),
          1
        );

        let reason = el.REASON || "🥰🥰🥰";
        const mentions = [];

        for (let index = 0; index < participantIDs.length; index++) {
          if (index == reason.length) {
            reason += " \u200D ";
          }

          mentions.push({
            tag: reason[index],
            id: participantIDs[index],
            fromIndex: index - 1
          });
        }

        const message = {
          body: reason,
          mentions
        };

        if ("ATTACHMENT" in el) {
          message.attachment = [];

          for (const attachment of el.ATTACHMENT) {
            const attachmentData = (
              await axios.get(encodeURI(attachment.url), {
                responseType: "arraybuffer"
              })
            ).data;

            const cachePath =
              __dirname +
              "/../Script/commands/cache/" +
              attachment.fileName;

            fs.writeFileSync(
              cachePath,
              Buffer.from(attachmentData)
            );

            message.attachment.push(
              fs.createReadStream(cachePath)
            );
          }
        }

        console.log(message);

        if ("BOX" in el) {
          await api.setTitle(el.BOX, el.TID);
        }

        api.sendMessage(message, el.TID, () => {
          if ("ATTACHMENT" in el) {
            el.ATTACHMENT.forEach(attachment => {
              const cachePath =
                __dirname +
                "/../Script/commands/cache/" +
                attachment.fileName;

              if (fs.existsSync(cachePath)) {
                fs.unlinkSync(cachePath);
              }
            });
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  setInterval(processScheduledMessages, 60000);

  const processedEventIDs = new Map();
  const EVENT_DEDUPE_TTL = 10 * 60 * 1000;
  const EVENT_DEDUPE_MAX = 5000;
  let lastDedupeSweep = Date.now();

  const getEventDedupeKey = event => {
    switch (event.type) {
      case "message":
      case "message_reply":
      case "message_unsend":
        return event.messageID
          ? event.type + "|" + event.messageID
          : null;

      case "message_reaction":
        return event.messageID
          ? [
              event.type,
              event.messageID,
              event.userID,
              event.reaction
            ].join("|")
          : null;

      case "event":
        return event.logMessageId
          ? event.type + "|" + event.logMessageId
          : null;

      default:
        return null;
    }
  };

  const isDuplicateEvent = event => {
    const key = getEventDedupeKey(event);
    if (!key) return false;

    const now = Date.now();
    const seenAt = processedEventIDs.get(key);

    if (seenAt !== undefined && now - seenAt < EVENT_DEDUPE_TTL) {
      return true;
    }

    processedEventIDs.set(key, now);

    while (processedEventIDs.size > EVENT_DEDUPE_MAX) {
      const oldestKey = processedEventIDs.keys().next().value;
      processedEventIDs.delete(oldestKey);
    }

    if (now - lastDedupeSweep >= EVENT_DEDUPE_TTL) {
      for (const [eventKey, timestamp] of processedEventIDs) {
        if (now - timestamp >= EVENT_DEDUPE_TTL) {
          processedEventIDs.delete(eventKey);
        }
      }

      lastDedupeSweep = now;
    }

    return false;
  };

  const processEvent = async event => {
    switch (event.type) {
      case "message":
      case "message_reply":
      case "message_unsend":
        if (event.messageID && event.senderID) {
          remember(
            msgOwner,
            String(event.messageID),
            String(event.senderID),
            5000
          );
        }

        await handleMention(api, event);

        Promise.resolve(handleCreateDatabase({ event })).catch(error =>
          console.log("[handleCreateDatabase ERROR]", error)
        );

        Promise.resolve(handleCommand({ event })).catch(error =>
          console.log("[handleCommand ERROR]", error)
        );

        Promise.resolve(handleReply({ event })).catch(error =>
          console.log("[handleReply ERROR]", error)
        );

        Promise.resolve(handleCommandEvent({ event })).catch(error =>
          console.log("[handleCommandEvent ERROR]", error)
        );

        break;

      case "event":
        handleEvent({ event });
        break;

      case "message_reaction":
        handleReactionEvent({ event });
        break;

      default:
        break;
    }
  };

  return async event => {
    if (isDuplicateEvent(event)) return;

    if (solo.gate(api, event)) return;

    if (power.gate(api, event)) return;

    if (silent.isActive(event.threadID)) {
      const actor =
        event.type === "message_reaction"
          ? event.userID
          : event.type === "event"
            ? event.author || event.senderID
            : event.senderID;

      if (!silent.isAdmin(actor)) return;

      return silent.runAsAdmin(() => processEvent(event));
    }

    return processEvent(event);
  };
};
