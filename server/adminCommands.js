import {
    deleteCompany,
    getDatabaseNames,
    setupDatabase
} from "./database";

const express = require('express');
const adminCred = require('./admin');
const jwt = require('jsonwebtoken');

import {
    adminAuth
} from './auth';

module.exports = (apiRoutes, dbConnections) => {
    const router = express.Router();

    router.use('/login', (req, res, next) => {
        if (!req.body.name || !req.body.password)
            next();
        else if (req.body.name !== adminCred.name || req.body.password !== adminCred.password)
            next();
        else {
            const token = jwt.sign({
                    name: adminCred.name
                },
                process.env.JWT_KEY, {
                    expiresIn: '1h'
                });

            res.cookie('adminToken', token, {maxAge: 3600000, httpOnly: true});
            res.send({
                status: 'Logged in'
            });
        }
    });

    router.get('/company', adminAuth, async (req, res, next) => {
        const names = await getDatabaseNames();
        res.send(names);
    });

    router.post('/company', adminAuth, async (req, res, next) => {
        const companyName = req.body.name;
        try {
            if (!companyName) throw 'Name missing';
            apiRoutes['digivaate_' + companyName] = await setupDatabase('digivaate_' + companyName);
            apiRoutes['digivaate_' + companyName](req, res, next);
            //res.send({success: req.body.name + ' company created'});
        } catch (e) {
            console.error('Error in creating company: ', e);
            res.status(500).json({
                error: e
            });
        }
    });

    router.delete('/company', adminAuth, async (req, res, next) => {
        if (await deleteCompany(req.body.name, dbConnections, apiRoutes))
            res.send({
                success: req.body.name + ' deleted'
            });
        else
            res.status(500).json({
                error: req.body.name + ' not found'
            });
    });

    router.use('/', adminAuth, async (req, res, next) => {
        try {
            const companyName = req.body.companyName;

            if (!companyName)
                throw 'Company name missing';
            if (!Object.keys(apiRoutes).includes(companyName))
                throw 'Routes for ' + companyName + ' not found';
            
            req.body = req.body.content;
            apiRoutes[companyName](req, res, next);
        } catch (e) {
            console.error('Failed to redirect admin reqest:', e)
            res.status(500).send(e)
        }
    });

    return router;
};