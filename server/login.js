
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
        //TODO: Fix login fail
        let index = null;
        const users = await Promise.all(promises);
        for (let i = 0; i < users.length; i++) {
            if (users[i]) index = i;
        }
        
        if (!index) {
            res.status(401).json({error: 'login failed'});
            return;
        }
        
        const token = jwt.sign({
            name: 'böö'
        },process.env.JWT_KEY,{
            expiresIn: '1h'
        });

        res.cookie('token', token);
        res.send({status: 'Logged in'});
    }
}
