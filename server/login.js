const jwt = require('jsonwebtoken');

export default (databaseConnections) => {
    return async (req, res, next) => {
        const promises = [];
        
        let keys = Object.keys(databaseConnections);
        if (!keys.includes('digivaate_' + req.body.name)) {
            res.status(400).json({error: 'login failed'});
            return;
        }
        
        let company = await databaseConnections['digivaate_' + req.body.name].models.companies.findOne({
            where: {
                name: req.body.name,
                password: req.body.password
            }
        })

        if (company == null) {
            res.status(400).json({error: 'login failed'});
            return;
        }

        const token = jwt.sign({
            company: 'digivaate_' + company.name,
            companyName: company.name,
            companyId: company.id,
            companyTaxPercent: company.taxPercent

        },process.env.JWT_KEY,{
            expiresIn: '1h'
        });

        res.cookie('compToken', token, {maxAge: 3600000});
        res.send({
            status: 'Logged in',
        });
    }
}
