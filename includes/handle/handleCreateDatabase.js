
// ══════════════════════════════════════════════
// Credit : 𝐒𝐈𝐘𝐀𝐌 𝐇𝐀𝐒𝐀𝐍
// ══════════════════════════════════════════════
module.exports = function ({ Users, Threads, Currencies }) {
    const logger = require("../../utils/log.js");

    return async function ({ event }) {
        const {
            allUserID,
            allCurrenciesID,
            allThreadID,
            userName,
            threadInfo
        } = global.data;

        const { autoCreateDB } = global.config;

        if (autoCreateDB === false) return;

        const senderID = String(event.senderID);
        const threadID = String(event.threadID);

        try {
            if (!allThreadID.includes(threadID) && event.isGroup === true) {
                const threadIn4 = await Threads.getInfo(threadID);

                const dataThread = {
                    threadName: threadIn4.threadName,
                    adminIDs: threadIn4.adminIDs,
                    nicknames: threadIn4.nicknames
                };

                allThreadID.push(threadID);
                threadInfo.set(threadID, dataThread);

                await Threads.setData(threadID, {
                    threadInfo: dataThread,
                    data: {}
                });

                for (const singleData of threadIn4.userInfo || []) {
                    const userID = String(singleData.id);
                    userName.set(userID, singleData.name);

                    try {
                        if (allUserID.includes(userID)) {
                            await Users.setData(userID, {
                                name: singleData.name
                            });
                        } else {
                            await Users.createData(userID, {
                                name: singleData.name,
                                data: {}
                            });

                            allUserID.push(userID);

                            logger(
                                global.getText(
                                    'handleCreateDatabase',
                                    'newUser',
                                    userID
                                ),
                                '[ DATABASE ]'
                            );
                        }
                    } catch (e) {
                        console.log(e);
                    }
                }

                logger(
                    global.getText(
                        'handleCreateDatabase',
                        'newThread',
                        threadID
                    ),
                    '[ DATABASE ]'
                );
            }

            if (!allThreadID.includes(threadID) && event.isGroup !== true) {
                try {
                    const inboxInfo = {
                        threadName: '',
                        adminIDs: [],
                        nicknames: {}
                    };

                    allThreadID.push(threadID);
                    threadInfo.set(threadID, inboxInfo);

                    await Threads.setData(threadID, {
                        threadInfo: inboxInfo,
                        data: {}
                    });

                    logger(
                        global.getText(
                            'handleCreateDatabase',
                            'newThread',
                            threadID
                        ),
                        '[ DATABASE ]'
                    );
                } catch (e) {
                    console.log(e);
                }
            }

            if (!allUserID.includes(senderID) || !userName.has(senderID)) {
                const infoUsers = await Users.getInfo(senderID);

                if (allUserID.includes(senderID)) {
                    await Users.setData(senderID, {
                        name: infoUsers.name
                    });
                } else {
                    await Users.createData(senderID, {
                        name: infoUsers.name,
                        data: {}
                    });

                    allUserID.push(senderID);
                }

                userName.set(senderID, infoUsers.name);

                logger(
                    global.getText(
                        'handleCreateDatabase',
                        'newUser',
                        senderID
                    ),
                    '[ DATABASE ]'
                );
            }

            if (!allCurrenciesID.includes(senderID)) {
                await Currencies.createData(senderID, {
                    data: {}
                });

                allCurrenciesID.push(senderID);
            }

            return;
        } catch (err) {
            return console.log(err);
        }
    };
};
