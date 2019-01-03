import {connectToDatabases, createDatabase, databaseRouting, getDatabaseNames} from "./database";

const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');

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

let ROUTES;

app.post('/db', async (req, res, next) => {
    if (!req.body.name) throw 'name missing';

    let newDbs = await createDatabase(req.body.name);
    let newRoutes = await databaseRouting(newDbs);
    //UPDATE ROUTING KESKEN
    ROUTES.push(newRoutes[0]);
});

//Create connections for all databases
getDatabaseNames()
    .then(names => {
        return connectToDatabases(names);
    })
    .then(dbConnections => {
        return databaseRouting(dbConnections);
    })
    .then(routes => {
        ROUTES = routes;

        app.use('/api', ROUTES);

        //Error handling
        app.use((req, res, next) => {
            const error = new Error('Not found');
            error.status = 404;
            next(error);
        });

        app.use((error, req, res) => {
            console.error(error);
            res.json({
                error: {
                    message: error.message
                }
            });
        });
    });

module.exports = app;
