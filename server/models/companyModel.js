export default (sequelize, DataTypes) => {
    const Company = sequelize.define('companies', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        taxPercent: DataTypes.INTEGER
    });

    Company.associate = (models) => {
        Company.hasMany(models.Season, {
            as: 'seasons'
        });
    };
    return Company;
};