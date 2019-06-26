module.exports = (sequelize, DataTypes) => {
    const Theme = sequelize.define('themes', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        images: {
            type: DataTypes.ARRAY(DataTypes.ARRAY(DataTypes.CHAR))
        },
        filePaths: {
            type: DataTypes.ARRAY(DataTypes.STRING)
        },
        ownerCompany: {
            type: DataTypes.INTEGER
        }
    });

    return Theme;
};
