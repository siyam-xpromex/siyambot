
module.exports = function ({ api, models, Users, Threads, Currencies }) {
    return function ({ event }) {
        if (!event.messageReply) return;

        const { handleReply, commands } = global.client;
        const { messageID, threadID, messageReply } = event;
        const senderID = String(event.senderID);

        const ADMINBOT = global.config.ADMINBOT || [];
        const DEVELOPER = global.config.DEVELOPER || [];
        const adminbot = require("./../../config.json");

        const isDeveloper = global.isDeveloper
            ? global.isDeveloper(senderID)
            : DEVELOPER.includes(senderID);

        const isBotAdmin = ADMINBOT.includes(senderID);
        const isDevOnly =
            adminbot.developerOnly === true ||
            global.config.developerOnly === true;

        const isAdminOnly =
            adminbot.adminOnly === true ||
            global.config.adminOnly === true;

        if (isDevOnly && !isDeveloper) return;
        if (isAdminOnly && !isDeveloper && !isBotAdmin) return;

        if (!handleReply || handleReply.length === 0) return;

        const indexOfHandle = handleReply.findIndex(
            e => e.messageID == messageReply.messageID
        );

        if (indexOfHandle < 0) return;

        const indexOfMessage = handleReply[indexOfHandle];
        const handleNeedExec = commands.get(indexOfMessage.name);

        if (!handleNeedExec) {
            return api.sendMessage(
                global.getText("handleReply", "missingValue"),
                threadID,
                messageID
            );
        }

        try {
            let getText2;

            if (
                handleNeedExec.languages &&
                typeof handleNeedExec.languages === "object"
            ) {
                getText2 = (...value) => {
                    const reply = handleNeedExec.languages || {};
                    const language = global.config.language;

                    if (!reply.hasOwnProperty(language)) {
                        return api.sendMessage(
                            global.getText(
                                "handleCommand",
                                "notFoundLanguage",
                                handleNeedExec.config.name
                            ),
                            threadID,
                            messageID
                        );
                    }

                    let lang =
                        handleNeedExec.languages[language][value[0]] || "";

                    for (let i = 1; i < value.length; i++) {
                        const expReg = new RegExp("%" + i, "g");
                        lang = lang.replace(expReg, value[i]);
                    }

                    return lang;
                };
            } else {
                getText2 = () => "";
            }

            const Obj = {
                api,
                event,
                models,
                Users,
                Threads,
                Currencies,
                handleReply: indexOfMessage,
                getText: getText2
            };

            handleNeedExec.handleReply(Obj);
            return;

        } catch (error) {
            return api.sendMessage(
                global.getText("handleReply", "executeError", error),
                threadID,
                messageID
            );
        }
    };
};
