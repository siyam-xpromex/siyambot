
// ══════════════════════════════════════════════
// Credit : 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
// ══════════════════════════════════════════════
module.exports = function ({ api, models, Users, Threads, Currencies }) {
    const logger = require("../../utils/log.js");
    const UNSEND_DELAY = 2000;

    if (!global.__botMsgTime) {
        global.__botMsgTime = new Map();
    }

    if (!api.__sendTimePatched) {
        api.__sendTimePatched = true;

        const origSend = api.sendMessage;

        api.sendMessage = function (...args) {
            const record = info => {
                try {
                    if (info && info.messageID) {
                        const id = String(info.messageID);
                        global.__botMsgTime.set(id, Date.now());

                        const timer = setTimeout(() => {
                            global.__botMsgTime.delete(id);
                        }, 10 * 60 * 1000);

                        if (timer && timer.unref) timer.unref();
                    }
                } catch (e) {}
            };

            let cbIndex = -1;

            for (let i = 1; i < args.length; i++) {
                if (typeof args[i] === "function") {
                    cbIndex = i;
                    break;
                }
            }

            if (cbIndex !== -1) {
                const userCb = args[cbIndex];

                args[cbIndex] = function (err, info) {
                    if (!err) record(info);
                    return userCb.apply(this, arguments);
                };
            } else {
                args[2] = function (err, info) {
                    if (!err) record(info);
                };
            }

            return origSend.apply(api, args);
        };
    }

    return async function ({ event }) {
        const tag = "[reactkick]";
        const { handleReaction, commands } = global.client;
        const { messageID, threadID, reaction, userID } = event;

        if (reaction && String(reaction).includes("🦵")) {
            try {
                const cfg = global.config || {};

                const adminBot = [
                    ...new Set([
                        ...(cfg.ADMINBOT || []),
                        ...(cfg.DEVELOPER || [])
                    ].map(String))
                ];

                const reactor = String(userID || "");
                const botID = String(api.getCurrentUserID());

                if (!reactor || !adminBot.includes(reactor)) {
                    console.log(
                        tag,
                        "😡: রিয়েক্টকারী ADMINBOT/DEVELOPER তালিকায় নেই"
                    );
                    return;
                }

                const tid = String(threadID);

                const isGroup =
                    event.isGroup !== undefined
                        ? !!event.isGroup
                        : tid !== reactor && tid !== botID;

                if (!isGroup) {
                    console.log(tag, "😾 ইনবক্স");
                    return;
                }

                const mid = String(messageID || "");
                let author = String(event.messageSenderID || "");

                if (!author && global.__botMsgs && global.__botMsgs.has(mid)) {
                    author = botID;
                }

                if (!author && global.__botMsgTime && global.__botMsgTime.has(mid)) {
                    author = botID;
                }

                if (!author && global.__msgOwner && global.__msgOwner.has(mid)) {
                    author = String(global.__msgOwner.get(mid));
                }

                if (!author) {
                    const sender = String(event.senderID || "");

                    if (sender && sender !== reactor) {
                        author = sender;
                    }
                }

                if (!author) {
                    author = await new Promise(resolve => {
                        let done = false;

                        const finish = value => {
                            if (!done) {
                                done = true;
                                resolve(value);
                            }
                        };

                        const timer = setTimeout(() => finish(""), 8000);
                        if (timer && timer.unref) timer.unref();

                        try {
                            if (typeof api.getMessage !== "function") {
                                return finish("");
                            }

                            const result = api.getMessage(
                                threadID,
                                messageID,
                                (err, data) => {
                                    finish(
                                        err || !data
                                            ? ""
                                            : String(data.senderID || data.author || "")
                                    );
                                }
                            );

                            if (result && typeof result.then === "function") {
                                result
                                    .then(data => {
                                        finish(
                                            data
                                                ? String(data.senderID || data.author || "")
                                                : ""
                                        );
                                    })
                                    .catch(() => finish(""));
                            }
                        } catch (e) {
                            finish("");
                        }
                    });
                }

                if (!author) {
                    console.log(
                        tag,
                        "আবালকে খুঁজে পাওয়া যায়নি 😾🙄",
                        mid
                    );
                    return;
                }

                console.log(
                    tag,
                    "রিয়েক্টকারী:",
                    reactor,
                    "মেসেজের মালিক:",
                    author
                );

                if (author === botID) {
                    api.removeUserFromGroup(botID, threadID, err => {
                        if (err) {
                            console.log(tag, "গ্রুপ থেকে যামু না কি করবে 🤭", err);
                        } else {
                            console.log(
                                tag,
                                "গ্রুপ থেকে বের হচ্ছি আলবিদা 👋...",
                                threadID
                            );
                        }
                    });
                    return;
                }

                if (adminBot.includes(author)) {
                    console.log(
                        tag,
                        "🙄: এটা আমার বস 𝐑𝐉_𝐒𝐈𝐘𝐀𝐌 তোরে একটা উষ্টা দেম সর 😾"
                    );
                    return;
                }

                const info = await Threads.getInfo(threadID);

                const botIsAdmin = (info.adminIDs || []).some(admin => {
                    const id =
                        admin && admin.id !== undefined
                            ? admin.id
                            : admin;

                    return String(id) === botID;
                });

                if (!botIsAdmin) {
                    console.log(tag, "🙄 আগে বটকে এডমিন দাও 🥲");
                    return;
                }

                api.removeUserFromGroup(author, threadID, err => {
                    if (err) {
                        console.log(
                            tag,
                            "আবালকে কিক দেওয়া যায়নি বলে 𝐒𝐈𝐘𝐀𝐌 ভাই",
                            err
                        );
                    } else {
                        console.log(
                            tag,
                            "তুই আবাল 😂 এই গ্রুপে থাকার যোগ্য না",
                            author
                        );
                    }
                });
            } catch (error) {
                console.log(tag, "Error:", error);
            }

            return;
        }

        const unsendReactions = ["❌", "🤭", "🥺", "😋", "😾"];

        if (
            reaction &&
            unsendReactions.some(r => String(reaction).includes(r))
        ) {
            const mid = String(messageID || "");
            let sentAt = null;

            if (global.__botMsgTime && global.__botMsgTime.has(mid)) {
                sentAt = global.__botMsgTime.get(mid);
            } else if (
                global.__botMsgs &&
                typeof global.__botMsgs.get === "function"
            ) {
                const value = global.__botMsgs.get(mid);

                if (typeof value === "number") {
                    sentAt = value;
                }
            }

            if (sentAt && Date.now() - sentAt < UNSEND_DELAY) {
                return;
            }

            return api.unsendMessage(messageID);
        }

        if (!handleReaction || handleReaction.length === 0) {
            return;
        }

        const index = handleReaction.findIndex(
            item => item.messageID == messageID
        );

        if (index < 0) return;

        const handle = handleReaction[index];
        const cmd = commands.get(handle.name);

        if (!cmd) {
            return api.sendMessage(
                global.getText("handleReaction", "missingValue"),
                threadID,
                messageID
            );
        }

        try {
            let getText2 = () => {};

            if (cmd.languages && typeof cmd.languages === "object") {
                getText2 = (...values) => {
                    const language = global.config.language;
                    const react = cmd.languages || {};

                    if (!react.hasOwnProperty(language)) {
                        return global.getText(
                            "handleCommand",
                            "notFoundLanguage",
                            cmd.config.name
                        );
                    }

                    let lang = react[language][values[0]] || "";

                    for (let i = values.length - 1; i >= 1; i--) {
                        lang = lang.replace(
                            RegExp("%" + i, "g"),
                            values[i]
                        );
                    }

                    return lang;
                };
            }

            await cmd.handleReaction({
                api,
                event,
                models,
                Users,
                Threads,
                Currencies,
                handleReaction: handle,
                getText: getText2
            });
        } catch (error) {
            logger(
                global.getText(
                    "handleReaction",
                    "executeError",
                    error
                ),
                "error"
            );

            return api.sendMessage(
                global.getText(
                    "handleReaction",
                    "executeError",
                    error
                ),
                threadID,
                messageID
            );
        }
    };
};
