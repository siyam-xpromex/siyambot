module.exports = function({ sequelize, Sequelize }) {
	let Currencies = sequelize.define('Currencies', {
		num: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true
		},//।      সিয়াম।      %
		userID: {
			type: Sequelize.BIGINT,
			unique: true
		},
		money: {
			type: Sequelize.BIGINT,
			defaultValue: 0
		},
        exp: {
            type: Sequelize.BIGINT,
            defaultValue: 0
        },
		data: {
			type: Sequelize.JSON
		}
	});

	return Currencies;
}
