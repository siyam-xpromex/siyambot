
// ══════════════════════════════════════════════
// Credit : 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
// ══════════════════════════════════════════════
module.exports = function ({ api, models, Users, Threads, Currencies }) {
    const logger = require("../../utils/log.js");
    const moment = require("moment-timezone");

    return function ({ event }) {
        const timeStart = Date.now();
        const time = moment.tz("Asia/Dhaka").format("HH:mm:ss L");

        const { userBanned, threadBanned } = global.data;
        const { events } = global.client;
        const { allowInbox, DeveloperMode } = global.config;

        const senderID = String(event.senderID);
        const threadID = String(event.threadID);

        if (
            userBanned.has(senderID) ||
            threadBanned.has(threadID) ||
            (allowInbox === false && senderID === threadID)
        ) return;

        if (event.type === "change_thread_image") {
            event.logMessageType = "change_thread_image";
        }

        for (const [key, value] of events.entries()) {
            if (
                !value.config ||
                !Array.isArray(value.config.eventType) ||
                !value.config.eventType.includes(event.logMessageType)
            ) continue;

            const eventRun = events.get(key);

            try {
                const Obj = {};

                Obj.api = api;
                Obj.event = event;
                Obj.models = models;
                Obj.Users = Users;
                Obj.Threads = Threads;
                Obj.Currencies = Currencies;

                eventRun.run(Obj);

                if (DeveloperMode === true) {
                    logger(
                        global.getText(
                            'handleEvent',
                            'executeEvent',
                            time,
                            eventRun.config.name,
                            threadID,
                            Date.now() - timeStart
                        ),
                        '[ Event ]'
                    );
                }
            } catch (error) {
                logger(
                    global.getText(
                        'handleEvent',
                        'eventError',
                        eventRun.config.name,
                        JSON.stringify(error)
                    ),
                    'error'
                );
            }
        }

        return;
    };
};
