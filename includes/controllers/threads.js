// Credit : Siyam Hasan
module.exports = function ({ models, api }) {
    const Threads = models.use("Threads");

    async function getInfo(threadID) {
        const isLikelyGroup = String(threadID).length > 16;
        let result = null;

        try {
            result = await api.getThreadInfo(threadID);
        } catch (error) {
            console.log(error);

            if (isLikelyGroup) throw new Error(error);
            result = null;
        }

        if (!result || typeof result !== "object") result = {};

        let botID = "";

        try {
            botID = String(api.getCurrentUserID());
        } catch (error) {}

        if (!Array.isArray(result.adminIDs)) result.adminIDs = [];

        if (
            !Array.isArray(result.participantIDs) ||
            result.participantIDs.length === 0
        ) {
            result.participantIDs = [
                ...new Set([String(threadID), botID].filter(Boolean))
            ];
        }

        if (!Array.isArray(result.userInfo)) result.userInfo = [];

        if (!result.nicknames || typeof result.nicknames !== "object") {
            result.nicknames = {};
        }

        if (result.threadName === undefined || result.threadName === null) {
            result.threadName = "";
        }

        if (result.isGroup === undefined) {
            result.isGroup = isLikelyGroup;
        }

        return result;
    }

    async function getAll(...data) {
        let where, attributes;

        for (const i of data) {
            if (typeof i !== "object" || i === null) {
                throw global.getText("threads", "needObjectOrArray");
            }

            if (Array.isArray(i)) attributes = i;
            else where = i;
        }

        try {
            return (await Threads.findAll({ where, attributes }))
                .map(e => e.get({ plain: true }));
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async function getData(threadID) {
        try {
            const data = await Threads.findOne({
                where: { threadID }
            });

            return data ? data.get({ plain: true }) : false;
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async function setData(threadID, options = {}) {
        if (
            typeof options !== "object" ||
            options === null ||
            Array.isArray(options)
        ) {
            throw global.getText("threads", "needObject");
        }

        try {
            const thread = await Threads.findOne({
                where: { threadID }
            });

            if (thread) {
                await thread.update(options);
            } else {
                await this.createData(threadID, options);
            }

            return true;
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async function delData(threadID) {
        try {
            const thread = await Threads.findOne({
                where: { threadID }
            });

            if (!thread) return false;

            await thread.destroy();
            return true;
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async function createData(threadID, defaults = {}) {
        if (
            typeof defaults !== "object" ||
            defaults === null ||
            Array.isArray(defaults)
        ) {
            throw global.getText("threads", "needObject");
        }

        try {
            await Threads.findOrCreate({
                where: { threadID },
                defaults
            });

            return true;
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }

    return {
        getInfo,
        getAll,
        getData,
        setData,
        delData,
        createData
    };
};
