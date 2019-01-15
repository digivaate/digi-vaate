module.exports = (sequelize, DataTypes) => {
    const Image = sequelize.define('images', {
        fieldname: DataTypes.STRING,
        originalname: DataTypes.STRING,
        encoding: DataTypes.STRING,
        mimetype: DataTypes.STRING,
        buffer: DataTypes.BLOB,
    });

    Image.associate = (models) => {
        Image.hasOne(models.materials);
        Image.hasOne(models.products);
    };
    return Image;
};