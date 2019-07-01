const jwt = require('jsonwebtoken');

module.exports = (databaseConnection) => {
    return async (req, res, next) => {

        let company = await databaseConnection.models.companies.findOne({
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
