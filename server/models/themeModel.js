module.exports = (sequelize, DataTypes) => {
    const Theme = sequelize.define('themes', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        images: {
            type: DataTypes.ARRAY(DataTypes.BLOB('long'))
        },
        filePaths: {
            type: DataTypes.ARRAY(DataTypes.STRING)
        }
    });

    return Theme;
};
