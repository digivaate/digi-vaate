const Sequelize = require('sequelize');
const config = require('./postgres');

const getDatabaseNames = async () => {
    if (!config) throw 'Postgres config missing';

    const sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        config.options
    );

    const result = await sequelize.query('SELECT datname FROM pg_database WHERE datistemplate = false;')
        .spread(res => { return res });

    const dbnames = [];
    result.forEach(db => dbnames.push(db.datname));
    sequelize.close();
    return dbnames;
};
