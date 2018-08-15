const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const models = require('./models/models');
const fs = require('fs');

//create image uploads folder
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}
//synchronise sequelize models with database
models.sequelize.sync()
    .catch(err => console.error('Postgre sync error: ' + err));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
//Log requests
if (process.env.NODE_ENV === 'production') {
    app.use(morgan('common'));
} else {
    app.use(morgan('dev'));
}
//serve uploaded images
app.use('/api', express.static(path.resolve(__dirname, '../uploads/')));

//Back-end routes
app.use('/api', require('./routes/api'));

//Serve front end
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, '../dist/client/')));
    app.use('*', express.static(path.resolve(__dirname, '../dist/client/')));
}
//Error handling
app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res) => {
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;

//handle cross origin requests
/*
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE');
        return res.status(200).json({});
    }
    next();
});
*/
