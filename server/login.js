const jwt = require('jsonwebtoken');

export default (databaseConnections) => {
    return async (req, res, next) => {
        const promises = [];
        // Query all databases for the credentials
        for (let key in databaseConnections) {
            if (databaseConnections.hasOwnProperty(key)) {
                promises.push(
                    databaseConnections[key].models.users.findOne({
                        where: {
                            name: req.body.name,
                            password: req.body.password
                        }
                    })
                )
            }
        }
        const users = await Promise.all(promises);
        if (!users[0]) {
            res.status(401).json({error: 'login failed'});
            return;
        }
        const token = jwt.sign({
            userId: users[0].id,
            name: users[0].name,
            company: Object.keys(databaseConnections)[0]
        },process.env.JWT_KEY,{
            expiresIn: '1h'
        });

        res.cookie('userToken', token, {maxAge: 3600000});
        res.send({status: 'Logged in'});
    }
}
