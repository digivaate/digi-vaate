import {
    connectToDatabases,
    databaseRouting,
    getDatabaseNames
} from "./database";

const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

import {auth} from './auth';
import adminCommands from './adminCommands';
import login from './login';

//Holds all api routes for different databases
const apiRoutes = {};
const databaseConnections = {};

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Log requests
if (process.env.NODE_ENV === 'production') {
    app.use(morgan('common'));
} else {
    app.use(morgan('dev'));
}

//Serve front end
const staticPath = express.static(path.resolve(__dirname, '../dist/client/'));
if (process.env.NODE_ENV === 'production') {
    app.use(staticPath);
    app.use('/login', staticPath);
    app.use('/admin', staticPath);
    app.use('/admin/login', staticPath);
}
app.use('/api/admin', adminCommands(apiRoutes, databaseConnections));

app.use('/api/login', login(databaseConnections));

app.use('/api', auth);

getDatabaseNames()
    .then(connectToDatabases)
    .then(dbConnections => {
        for (let dbConnKey in dbConnections) {
            if (dbConnections.hasOwnProperty(dbConnKey))
                databaseConnections[dbConnKey] = dbConnections[dbConnKey];
        }
        //databaseConnections = dbConnections;
        return databaseRouting(dbConnections);
    })
    .then(routes => {
        for (let routeKey in routes) {
            if (routes.hasOwnProperty(routeKey))
                apiRoutes[routeKey] = routes[routeKey];
        }
        //apiRoutes = routes;

        //Create connections for all databases
        app.use('/api', (req, res, next) => {
            if (!apiRoutes[req.compAuth.company])
                throw 'Incorrect company name in req.compAuth. Name: ' + req.compAuth.company;

            //forward request to correct database route
            apiRoutes[req.compAuth.company](req, res, next);
        });

        app.use('*', staticPath);
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
