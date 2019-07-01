const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const {auth} = require('./auth');
const adminCommands = require('./adminCommands');
const login = require('./login');
const createApiRoutes = require("./routes/createApiRoutes");
const DatabaseConnection = require("./models/DatabaseConnection");

const db = new DatabaseConnection('digivaate');
let apiRoutes = null;
const dbConnection = db.sequelize.sync()
    .then(() => {
        apiRoutes = createApiRoutes(db);
        
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
        app.use('/api/admin', adminCommands(apiRoutes, db));

        app.use('/api/login', login(db));

        app.use('/api', auth);
        
        //Create connections for all databases
        app.use('/api', (req, res, next) => {
            if (!req.compAuth.companyId)
                throw 'Incorrect company name in req.compAuth. Name: ' + req.compAuth.companyId;
            //forward request to correct database route
            next();
        });

        app.use('/api', apiRoutes);
        
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
