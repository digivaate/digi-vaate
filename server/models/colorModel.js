export default (sequelize, DataTypes) => {
    const Color = sequelize.define('colors', {
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        value: {type: DataTypes.STRING}
    });

    Color.associate = (models) => {
        Color.belongsToMany(models.Product, {through: 'color_product'});
        Color.belongsToMany(models.Collection, {through: 'color_collection'});
    };
    return Color;
};

/*
const colorSchema = mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId},
    name: {type: String, required: true },
    value: {type: String,
        validate: {
            validator: (v) => {
                //Hexadecimal value
                return /^#(?:[0-9a-f]{3}){1,2}$/i.test(v);
            },
            message: '{VALUE} is not a valid phone number!'
        }
    },
});

module.exports = mongoose.model('Color', colorSchema);
*/