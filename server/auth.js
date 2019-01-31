const jwt = require('jsonwebtoken');

export function userAuth(req, res, next) {
    try {
        if (!req.cookies.token) throw 'Token missing from cookies';
        if (!process.env.JWT_KEY) throw 'JWT_KEY missing from environment variables';

        req.auth = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        next();
    } catch (e) {
        console.error(e);
        res.status(401).json({ error: 'Unauthorized'});
    }
}

export function adminAuth(req, res, next) {
    try {
        if (!req.cookies.adminToken) throw 'Token missing from cookies';
        if (!process.env.JWT_KEY) throw 'JWT_KEY missing from environment variables';

        req.adminAuth = jwt.verify(req.cookies.adminToken, process.env.JWT_KEY);
        next();
    } catch (e) {
        console.error(e);
        res.status(401).json({ error: 'Unauthorized'});
    }
};
