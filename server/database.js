const DatabaseConnection = require("./models/DatabaseConnection");
const createApiRoutes = require("./routes/createApiRoutes");
const Sequelize = require('sequelize');
const config = require('../databaseConfig');

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

module.exports = async function connectToDatabase(dbName) {
        let db = new DatabaseConnection(dbName);
        return db.sequelize.sync();
}

module.exports = function databaseRouting(dbConnections) {
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
module.exports = async function setupDatabase(name) {
    const dbName = await createDatabase(name);
    const dbConnection = await connectToDatabase(dbName);
    return await createApiRoutes(dbConnection);
}

module.exports = async function deleteCompany(name, dbConnections, apiRoutes) {
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