
module.exports = function ({ models, api }) {
    const Users = models.use("Users");

    async function getInfo(id) {
        return (await api.getUserInfo(id))[id];
    }

    async function getNameUser(id) {
        try {
            if (global.data.userName.has(id)) {
                return global.data.userName.get(id);
            } else if (global.data.allUserID.includes(id)) {
                const nameUser = (await this.getData(id))?.name;
                if (nameUser) return nameUser;
                return "Facebook users";
            } else {
                return "Facebook users";
            }
        } catch (error) {
            return "Facebook users";
        }
    }

    async function getAll(...data) {
        let where, attributes;

        for (const i of data) {
            if (typeof i !== "object" || i === null) {
                throw global.getText("users", "needObjectOrArray");
            }

            if (Array.isArray(i)) attributes = i;
            else where = i;
        }

        try {
            return (await Users.findAll({ where, attributes }))
                .map(e => e.get({ plain: true }));
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async function getData(userID) {
        try {
            const data = await Users.findOne({ where: { userID } });
            return data ? data.get({ plain: true }) : false;
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async function setData(userID, options = {}) {
        if (typeof options !== "object" || options === null || Array.isArray(options)) {
            throw global.getText("users", "needObject");
        }

        try {
            const user = await Users.findOne({ where: { userID } });

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
            const user = await Users.findOne({ where: { userID } });

            if (!user) return false;

            await user.destroy();
            return true;
        } catch (error) {
            console.error(error);
            throw new Error(error);
        }
    }

    async function createData(userID, defaults = {}) {
        if (typeof defaults !== "object" || defaults === null || Array.isArray(defaults)) {
            throw global.getText("users", "needObject");
        }

        try {
            await Users.findOrCreate({
                where: { userID },
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
        getNameUser,
        getAll,
        getData,
        setData,
        delData,
        createData
    };
};
