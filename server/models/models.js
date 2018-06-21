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
    });

const models = {
    Collection: sequelize.import('./collectionModel'),
    Season: sequelize.import('./seasonModel')
};

Object.keys(models).forEach((modelName) => {
    if ('associate' in models[modelName]) {
        models[modelName].associate(models);
    }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;
export default models;
