const jwt = require('jsonwebtoken');

export function auth(req, res, next) {
    try {
        if (!req.cookies.adminToken && !req.cookies.userToken) throw 'Token missing from cookies';
        if (!process.env.JWT_KEY) throw 'JWT_KEY missing from environment variables';

        if(req.cookies.adminToken)
            req.adminAuth = jwt.verify(req.cookies.adminToken, process.env.JWT_KEY);
        if(req.cookies.userToken)
            req.userAuth = jwt.verify(req.cookies.userToken, process.env.JWT_KEY);
        next();
    } catch (e) {
        console.error(e);
        res.status(401).json({ error: 'Unauthorized'});
    }
}

export function adminAuth(req, res, next) {
    auth(req, res, () => {
        if (!req.adminAuth) throw 'No admin privileges';
        next();
    });
}