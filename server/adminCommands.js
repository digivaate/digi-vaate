import {deleteCompany, getDatabaseNames, setupDatabase} from "./database";

const express = require('express');
const adminCred = require('./admin');
const jwt = require('jsonwebtoken');

import {adminAuth} from './auth';

module.exports = (apiRoutes, dbConnections) => {
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

            res.cookie('adminToken', token);
            res.send({status: 'Logged in'});
        }
    });

    router.get('/company', adminAuth, async (req, res, next) => {
        const names = await getDatabaseNames();
        res.send(names);
    });

    router.post('/company', adminAuth, async (req, res, next) => {
        const company = req.body.name;
        try {
            if (!company) throw 'Name missing';
            apiRoutes['digivaate_' + company] = await setupDatabase('digivaate_' + company);
            res.send({success: req.body.name + ' company created'});
        } catch (e) {
            console.error('Error in creating company: ', e);
            res.status(500).json({error: e});
        }
    });

    router.delete('/company', adminAuth, async (req, res, next) => {
        if (await deleteCompany(req.body.name, dbConnections, apiRoutes))
            res.send({success: req.body.name + ' deleted'});
        else
            res.status(500).json({error: req.body.name + ' not found'});
    });

    return router;
};