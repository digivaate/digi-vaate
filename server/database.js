import DatabaseConnection from "./models/DatabaseConnection";
import createApiRoutes from "./routes/createApiRoutes";
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


export async function connectToDatabase(dbName) {
        let db = new DatabaseConnection(dbName);
        return db.sequelize.sync();
}

export function databaseRouting(dbConnections) {
    const apiRoutes = {};
    for (let c in dbConnections) {
        if (dbConnections.hasOwnProperty(c)) {
            apiRoutes[c] = createApiRoutes(dbConnections[c]);
        }
    }
    return apiRoutes;
}

export async function createDatabase(name) {
    const dbNames = await getDatabaseNames();
    if (dbNames.includes('digivaate_' + name)) throw 'Digivaate database with name ' + name + ' already exists';

    await sequelize.query('CREATE DATABASE digivaate_' + name)
        .catch(err => console.error(err) );

    return 'digivaate_' + name;
}

/**
 * Creates, connects and adds routing to database
 * @param {string} name - company name
 * @return {express.router} router
 */
export async function setupDatabase(name) {
    const dbName = await createDatabase(name);
    const dbConnection = await connectToDatabase(dbName);
    return await createApiRoutes(dbConnection);
}