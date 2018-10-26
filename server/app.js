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
models.sequelize.sync({force: true})
    .catch(err => console.error('Postgre sync error: ' + err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
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
