module.exports = (sequelize, DataTypes) => {
    const Theme = sequelize.define('themes', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        imagePaths: {
            type: DataTypes.ARRAY(DataTypes.STRING)
        },
        filePaths: {
            type: DataTypes.ARRAY(DataTypes.STRING)
        }
    });

    return Theme;
};
