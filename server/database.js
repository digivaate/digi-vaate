import DatabaseConnection from "./models/DatabaseConnection";
import routes from "./routes/routes";
const Sequelize = require('sequelize');
const config = require('./postgres');

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config.options
);

export async function getDatabaseNames() {
    if (!config) throw 'Postgres config missing';

    const result = await sequelize.query('SELECT datname FROM pg_database WHERE datistemplate = false;')
        .spread(res => {
            return res
        });

    const dbNames = [];
    result.forEach(db => dbNames.push(db.datname));
    return dbNames;
}

export async function connectToDatabases(dbNames) {
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

export async function databaseRouting(dbConnections) {
    const dbRoutes = {};
    for (let c in dbConnections) {
        if (dbConnections.hasOwnProperty(c)) {
            dbRoutes[c] = routes(dbConnections[c]);
        }
    }
    return function (req, res, next) {
        if (!dbRoutes[req.headers.db])
            throw 'database with name' + req.headers.db + ' not found';

        dbRoutes[req.headers.db](req, res, next);
    }
}

export async function createDatabase(name) {
    const dbNames = await getDatabaseNames();
    if (dbNames.includes('digivaate_' + name)) throw 'Digivaate database with name ' + name + ' already exists';

    await sequelize.query('CREATE DATABASE digivaate_' + name);
    return connectToDatabases(['digivaate_' + name]);
}