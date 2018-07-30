import Sequelize from "sequelize";

const sequelize = new Sequelize(
    'digivaate',
    'digivaate',
    'digivaate',
    {
        host: 'localhost',
        dialect: 'postgres',
        operatorsAliases: false,
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        // disable logging; default: console.log
        logging: false
    });

const models = {
    Material: sequelize.import('./materialModel'),
    Color: sequelize.import('./colorModel'),
    Product: sequelize.import('./productModel'),
    Collection: sequelize.import('./collectionModel'),
    Season: sequelize.import('./seasonModel'),
    Company: sequelize.import('./companyModel'),
    Theme: sequelize.import('./themeModel'),
    Size: sequelize.import('./sizeModel'),
    MaterialProduct: sequelize.define('material_product', {
        consumption: {
            type: Sequelize.FLOAT,
            defaultValue: 0
        }
    })
};

Object.keys(models).forEach((modelName) => {
    if ('associate' in models[modelName]) {
        models[modelName].associate(models);
    }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;
export default models;

