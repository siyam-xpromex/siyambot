
module.exports = function ({ models }) {
    const Currencies = models.use("Currencies");

    async function getAll(...data) {
        let where, attributes;

        for (const i of data) {
            if (typeof i !== "object" || i === null) {
                throw global.getText("currencies", "needObjectOrArray");
            }

            if (Array.isArray(i)) attributes = i;
            else where = i;
        }

        try {
            return (await Currencies.findAll({ where, attributes }))
                .map(e => e.get({ plain: true }));
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async function getData(userID) {
        try {
            const data = await Currencies.findOne({
                where: { userID }
            });

            return data ? data.get({ plain: true }) : false;
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async function setData(userID, options = {}) {
        if (
            typeof options !== "object" ||
            options === null ||
            Array.isArray(options)
        ) {
            throw global.getText("currencies", "needObject");
        }

        try {
            const user = await Currencies.findOne({
                where: { userID }
            });

            if (user) {
                await user.update(options);
            } else {
                await this.createData(userID, options);
            }

            return true;
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async function delData(userID) {
        try {
            const user = await Currencies.findOne({
                where: { userID }
            });

            if (!user) return false;

            await user.destroy();
            return true;
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async function createData(userID, defaults = {}) {
        if (
            typeof defaults !== "object" ||
            defaults === null ||
            Array.isArray(defaults)
        ) {
            throw global.getText("currencies", "needObject");
        }

        try {
            await Currencies.findOrCreate({
                where: { userID },
                defaults
            });

            return true;
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async function increaseMoney(userID, money) {
        if (typeof money !== "number" || !Number.isFinite(money)) {
            throw global.getText("currencies", "needNumber");
        }

        try {
            const data = await getData(userID);

            if (!data) {
                await createData(userID, { money: 0 });
            }

            const balance = Number((await getData(userID)).money) || 0;

            await setData(userID, {
                money: balance + money
            });

            return true;
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async function decreaseMoney(userID, money) {
        if (typeof money !== "number" || !Number.isFinite(money) || money < 0) {
            throw global.getText("currencies", "needNumber");
        }

        try {
            const data = await getData(userID);

            if (!data) return false;

            const balance = Number(data.money) || 0;

            if (balance < money) return false;

            await setData(userID, {
                money: balance - money
            });

            return true;
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }

    return {
        getAll,
        getData,
        setData,
        delData,
        createData,
        increaseMoney,
        decreaseMoney
    };
};
