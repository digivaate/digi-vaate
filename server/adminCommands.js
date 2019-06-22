const express = require('express');
const adminCred = require('../admin');
const jwt = require('jsonwebtoken');

import {
    adminAuth
} from './auth';

module.exports = (apiRoutes, dbConnection) => {
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
        try {
            const compList = await dbConnection.models.companies.findAll({raw: true});
        
        /*
        for (let i = 0; i < compList.length; i++) {
            compList[i].dbName = names[i];
        }
        */
            res.send(compList);
        } catch (e) {
            console.error(e);
            res.status(500).send();
        }
    });

    router.post('/company', adminAuth, async (req, res, next) => {
        try {
            if (!req.body.name) throw 'Name missing';
            if (!req.body.password) throw 'Password missing';
            
            apiRoutes(req, res, next);
            
        } catch (e) {
            console.error('Error in creating company: ', e);
            res.status(500).json({
                error: e
            });
        }
    });

    router.delete('/company', adminAuth, (req, res, next) => {
        console.log('DELETE');
        dbConnection.models.companies.findOne({ where: { id: req.query.id } })
            .then(ent => {
                return ent.destroy();
            })
            .then(() => res.send('deleted'))
            .catch(err => {
                console.error('Error: ' + err);
                res.status(500).json({ error: err });
            });
    });

    /*
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
    */
    return router;
};