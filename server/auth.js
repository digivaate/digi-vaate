const jwt = require('jsonwebtoken');

export function auth(req, res, next) {
    try {
        if (!req.cookies.userToken) throw 'User token missing from cookies';
        if (!process.env.JWT_KEY) throw 'JWT_KEY missing from environment variables';

        req.userAuth = jwt.verify(req.cookies.userToken, process.env.JWT_KEY);
        
        //Refresh token if about to expire
        if(req.userAuth.exp - Date.now()/Math.pow(10,3) < 1800) {
            console.log('Refreshed user token for: ', req.userAuth.name);
            const token = jwt.sign({
                userId: req.userAuth.userId,
                name: req.userAuth.name,
                company: req.userAuth.company
            },process.env.JWT_KEY,{
                expiresIn: '1h'
            });
            res.cookie('userToken', token, {maxAge: 3600000});    
        }
        
        next();
    } catch (e) {
        console.error(e);
        res.status(401).json({ error: 'Unauthorized', level: 'user' });
    }
}

export function adminAuth(req, res, next) {
    try {
        if (!req.cookies.adminToken) throw 'Admin token missing from cookies';
        if (!process.env.JWT_KEY) throw 'JWT_KEY missing from environment variables';

        req.adminAuth = jwt.verify(req.cookies.adminToken, process.env.JWT_KEY);

        //Refresh token if about to expire
        if(req.adminAuth.exp - Date.now()/Math.pow(10,3) < 1800) {
            console.log('Refreshed admin token');
            const token = jwt.sign({
                name: req.adminAuth.name
            },
            process.env.JWT_KEY, {
                expiresIn: '1h'
            });
            res.cookie('userToken', token, {maxAge: 3600000});    
        }

        next();
    } catch (e) {
        console.error(e);
        res.status(401).json({ error: 'Unauthorized', level: 'admin' });
    }
}