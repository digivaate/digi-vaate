import DatabaseConnection from "./models/DatabaseConnection";
import createApiRoutes from "./routes/createApiRoutes";
const Sequelize = require('sequelize');
const config = require('./postgres');

let sequelize = null;

if (process.env.DATABASE_URL) {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
        options: {
            dialect: 'postgres',
            protocol: 'postgres',
            logging: false,
            dialectOptions: {
                ssl: true
            }
        }
    });
} else {
    sequelize = new Sequelize(
        config.database,
        config.username,
        config.password,
        config.options
    );
}
/*
export async function getDatabaseNames() {
    if (!config) throw 'Postgres config missing';

    const result = await sequelize.query('SELECT datname FROM pg_database WHERE datistemplate = false;')
        .spread(res => {
            return res
        });

    const dbNames = [];
    result.forEach(db => {
        if (/^digivaate_.*$/.test(db.datname))
            dbNames.push(db.datname);
    });
    return dbNames;
}
*/
/*
export async function connectToDatabases(dbNames) {
    const connections = [];
    for (let i = 0; i < dbNames.length; i++) {
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
*/
/*
export async function createDatabase(name) {
    const dbNames = await getDatabaseNames();
    if (dbNames.includes(name)) throw 'Digivaate database with name ' + name + ' already exists';

    await sequelize.query('CREATE DATABASE ' + name)
        .catch(err => console.error(err) );

    return name;
}
*/

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

export async function deleteCompany(name, dbConnections, apiRoutes) {
    if (!(name in apiRoutes) || !(name in dbConnections))
        return false;
    try {
        await sequelize.query(
            `SELECT pg_terminate_backend(pg_stat_activity.pid)
            FROM pg_stat_activity
            WHERE pg_stat_activity.datname = '${name}';`
        )
        await sequelize.query('DROP DATABASE ' + name)
            .then(() => {
                delete apiRoutes[name];
                delete dbConnections[name];
            })
    } catch(error) {
        console.error(error);
        return false;
    };
    return true;
}