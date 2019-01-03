import DatabaseConnection from "./models/DatabaseConnection";

const Sequelize = require('sequelize');
const config = require('./postgres');

export async function getDatabaseNames() {
    if (!config) throw 'Postgres config missing';

    const sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        config.options
    );

    const result = await sequelize.query('SELECT datname FROM pg_database WHERE datistemplate = false;')
        .spread(res => {
            return res
        });

    const dbnames = [];
    result.forEach(db => dbnames.push(db.datname));
    sequelize.close();
    return dbnames;
}

/**
 * Create database connections for all databases
 * @returns {Promise<Sequelize[]>}
 */
export async function connectToDatabases() {
    const dbNames = await getDatabaseNames();
    const connections = [];
    for (let i = 1; i < dbNames.length; i++) {
        let db = new DatabaseConnection(dbNames[i]);
        connections.push(
            db.sequelize.sync()
                .catch(err => console.error('Unable to connect database. ', err))
        )
    }
    return Promise.all(connections)
        .then((res) => {
            const databases = {};
            res.forEach(db => databases[db.config.database] = db);
            return databases;
        });
}