const express = require('express');
const adminCred = require('./admin');
const jwt = require('jsonwebtoken');

import auth from './auth';

module.exports = (apiRoutes) => {
    const router = express.Router();

    router.use('/login', (req, res, next) => {
        if (!req.body.name || !req.body.password)
            next();
        else if(req.body.name !== adminCred.name || req.body.password !== adminCred.password)
            next();
        else {
            const token = jwt.sign({
                admin: {
                    name: adminCred.name
                }
            }, process.env.JWT_KEY, { expiresIn: '1h' });

            res.cookie('token', token);
            res.send({status: 'Logged in'});
        }
    });

    router.get('/company', auth, (req, res, next) => {
        res.send({list: 'of companies'});
    });

    router.post('/company', auth, (req, res, next) => {
        const company = req.body.name;
        if (!company) throw 'Name missing';


    });

    return router;
};