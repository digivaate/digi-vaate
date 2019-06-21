import {
    deleteCompany,
    getDatabaseNames,
    createDatabase,
    connectToDatabase
} from "./database";

const express = require('express');
const adminCred = require('../admin');
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

            res.cookie('adminToken', token, {maxAge: 3600000});
            res.send({
                status: 'Logged in'
            });
        }
    });

    router.get('/company', adminAuth, async (req, res, next) => {
        const names = await getDatabaseNames();
        const compPromises = [];
        
        names.forEach(n => {
            compPromises.push(dbConnections[n].models.companies.find({raw: true}));
        });
        const compList = await Promise.all(compPromises);
        
        for (let i = 0; i < compList.length; i++) {
            compList[i].dbName = names[i];
        }
        res.send(compList);
        
    });

    router.post('/company', adminAuth, async (req, res, next) => {
        const companyName = req.body.name.trim().replace(/ /g,"_");
        req.body.name = companyName;
        let dbName = null;
        let dbConn = null;
        try {
            if (!companyName) throw 'Name missing';
            if (!req.body.password) throw 'Password missing';

            dbName = await createDatabase('digivaate_' + companyName);
            dbConn = await connectToDatabase(dbName);
            dbConnections[dbName] = dbConn;
            apiRoutes[dbName] = await createApiRoutes(dbConn);
            apiRoutes[dbName](req, res, next);
            //res.send({success: req.body.name + ' company created'});
        } catch (e) {
            await deleteCompany(dbName, dbConnections, apiRoutes);
            console.error('Error in creating company: ', e);
            res.status(500).json({
                error: e
            });
        }
    });

    router.delete('/company', adminAuth, (req, res, next) => {
        console.log('DELETE');
        deleteCompany(req.query.name, dbConnections, apiRoutes)
        .then(() => {
            res.send({
                success: req.query.name + ' deleted'
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({
                error: err
            });
        })
    });

    router.use('/:dbName', adminAuth, async (req, res, next) => {
        try {
            const name = req.params.dbName;

            if (!name)
                throw 'Company name missing';
            if (!Object.keys(apiRoutes).includes(name))
                throw 'Routes for ' + name + ' not found in routes: ' + Object.keys(apiRoutes);
            
            apiRoutes[name](req, res, next);
        } catch (e) {
            console.error('Failed to redirect admin reqest:', e)
            res.status(500).send(e)
        }
    });

    return router;
};