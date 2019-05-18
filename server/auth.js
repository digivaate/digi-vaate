const jwt = require('jsonwebtoken');

export function auth(req, res, next) {
    try {
        if (!req.cookies.compToken) throw 'Company token missing from cookies';
        if (!process.env.JWT_KEY) throw 'JWT_KEY missing from environment variables';

        req.compAuth = jwt.verify(req.cookies.compToken, process.env.JWT_KEY);
        
        //Refresh token if about to expire
        if(req.compAuth.exp - Date.now()/Math.pow(10,3) < 1800) {
            console.log('Refreshed company token for: ', req.compAuth.name);
            const token = jwt.sign({
                company: req.compAuth.company
            },process.env.JWT_KEY,{
                expiresIn: '1h'
            });
            res.cookie('compToken', token, {maxAge: 3600000});    
        }
        
        next();
    } catch (e) {
        console.error(e);
        res.status(401).json({ error: 'Unauthorized', level: 'comp' });
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
            res.cookie('compToken', token, {maxAge: 3600000});    
        }

        next();
    } catch (e) {
        console.error(e);
        res.status(401).json({ error: 'Unauthorized', level: 'admin' });
    }
}