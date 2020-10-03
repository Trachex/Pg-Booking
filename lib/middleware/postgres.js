const { Sequelize } = require('sequelize');
const config = require('../../config');
const { db, user, password, host } = config.database;

const sequelize = new Sequelize(db, user, password, {
    host,
    dialect: 'postgres'
});

sequelize.sync();

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
