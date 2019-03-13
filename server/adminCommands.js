import {
    deleteCompany,
    getDatabaseNames,
    createDatabase,
    connectToDatabase
} from "./database";

const express = require('express');
const adminCred = require('./admin');
const jwt = require('jsonwebtoken');

import {
    adminAuth
} from './auth';
import createApiRoutes from "./routes/createApiRoutes";

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
        const compPromises = [];
        const userPromises = [];
        
        names.forEach(n => {
            compPromises.push(dbConnections[n].models.companies.find({raw: true}));
            userPromises.push(dbConnections[n].models.users.findAll());
        });
        const compList = await Promise.all(compPromises);
        const userList = await Promise.all(userPromises);
        
        for (let i = 0; i < compList.length; i++) {
            compList[i].users = userList[i];
            compList[i].dbName = names[i];
        }
        res.send(compList);
        
    });

    router.post('/company', adminAuth, async (req, res, next) => {
        const companyName = req.body.name;
        try {
            if (!companyName) throw 'Name missing';
            const dbName = await createDatabase('digivaate_' + companyName);
            const dbConn = await connectToDatabase(dbName);
            dbConnections[dbName] = dbConn;
            apiRoutes[dbName] = await createApiRoutes(dbConn);
            apiRoutes[dbName](req, res, next);
            //res.send({success: req.body.name + ' company created'});
        } catch (e) {
            console.error('Error in creating company: ', e);
            res.status(500).json({
                error: e
            });
        }
    });

    router.delete('/company', adminAuth, async (req, res, next) => {
        if (await deleteCompany(req.query.name, dbConnections, apiRoutes))
            res.send({
                success: req.query.name + ' deleted'
            });
        else
            res.status(500).json({
                error: req.query.name + ' not found'
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