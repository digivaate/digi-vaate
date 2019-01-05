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

app.use('/login', (req, res, next) => {

});

getDatabaseNames()
    .then(connectToDatabases)
    .then(databaseRouting)
    .then(routes => {
        apiRoutes = routes;

        //Create connections for all databases
        app.use('/api', (req, res, next) => {
            if (!apiRoutes[req.headers.db])
                throw 'database with name' + req.headers.db + ' not found';

            //forward request to correct database route
            apiRoutes[req.headers.db](req, res, next);
        });

        //Error handling
        app.use((req, res, next) => {
            const error = new Error('Not found');
            error.status = 404;
            next(error);
        });

        app.use((err, req, res, next) => {
            console.error(err);
            res.status(500);
            res.send({ error: err });
        });

    });

module.exports = app;
