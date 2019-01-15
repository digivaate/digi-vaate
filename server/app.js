import {
    connectToDatabase,
    connectToDatabases,
    createDatabase,
    databaseRouting,
    getDatabaseNames
} from "./database";
import createApiRoutes from "./routes/createApiRoutes";

const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

//Holds all api routes for different databases
let apiRoutes;
let databaseConnections;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Log requests
if (process.env.NODE_ENV === 'production') {
    app.use(morgan('common'));
} else {
    app.use(morgan('dev'));
}

//Serve front end
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, '../dist/client/')));
    app.use('*', express.static(path.resolve(__dirname, '../dist/client/')));
}

app.use('/db', async (req, res, next) => {
    try {
        if (!req.body.name) throw 'name missing';
        if (!req.body.user) throw 'user info missing';
        if (!req.body.user.name || !req.body.user.password) throw 'user info missing';

        let dbName = await createDatabase(req.body.name);
        let dbConnection = await connectToDatabase(dbName);
        apiRoutes[dbName] = await createApiRoutes(dbConnection);

        dbConnection.models.users.create(req.body.user)
            .then(response => res.send(response));

    } catch (e) {
        next(e);
    }
});

app.use('/login', async (req, res, next) => {
    const promises = [];
    for (let key in databaseConnections) {
        if (databaseConnections.hasOwnProperty(key)) {
            promises.push(
                databaseConnections[key].models.users.findOne({
                    where: {
                        name: req.body.name,
                        password: req.body.password
                    }
                })
            )
        }
    }

    let index = null;
    const users = await Promise.all(promises);
    for (let i = 0; i < users.length; i++) {
        if (users[i]) index = i;
    }
    if (!index) {
        res.status(401).json({error: 'login failed'});
        return;
    }
    const dbName = Object.keys(databaseConnections)[index];
    res.json({ dbName: dbName });
});

getDatabaseNames()
    .then(connectToDatabases)
    .then(dbConnections => {
        databaseConnections = dbConnections;
        console.log('MODELS', dbConnections.digivaate.models);
        return databaseRouting(dbConnections);
    })
    .then(routes => {
        apiRoutes = routes;

        //Create connections for all databases
        app.use('/api', (req, res, next) => {
            if (!req.headers.authorization){
                res.status(401).json({ error: 'Unauthorized'});
                return;
            }

            const dbName = req.headers.authorization.split(' ')[1];
            if (!apiRoutes[dbName])
                throw 'database with name ' + dbName + ' not found';

            //forward request to correct database route
            apiRoutes[dbName](req, res, next);
        });

        //Error handling
        app.use((req, res, next) => {
            const error = new Error('Not found');
            error.status = 404;
            next(error);
        });

        app.use((err, req, res, next) => {
            if (res.headersSent) return next(err);

            console.error(err);
            res.status(500);
            res.send({ error: err });
        });

        console.log('Routes open');
    });

module.exports = app;
