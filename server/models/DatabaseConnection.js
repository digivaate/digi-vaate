const Sequelize = require("sequelize");
const config = require('../postgres');

const modules = [
    require('./materialModel'),
    require('./companyModel'),
    require('./colorModel'),
    require('./productModel'),
    require('./collectionModel'),
    require('./seasonModel'),
    require('./themeModel'),
    require('./sizeModel'),
    require('./orderModel'),
    require('./orderProductModel'),
    require('./imageModel'),
    require('./productGroupModel'),
    require('./userModel'),
];

class DatabaseConnection {
    constructor(dbName) {
        this.Sequelize = Sequelize;
        if (process.env.DATABASE_URL) {
            this.sequelize = new Sequelize(process.env.DATABASE_URL, {
                options: {
                    dialect: 'postgres',
                    protocol: 'postgres',
                    logging: false,
                    dialectOptions: {
                        ssl: true
                    }
                }
            });
        } else {
            this.sequelize = new Sequelize(
                dbName,
                config.username,
                config.password,
                config.options
            );
        }
        this.models = {
            MaterialProduct: this.sequelize.define('material_product', {
                consumption: {
                    type: Sequelize.FLOAT,
                    defaultValue: 0
                }
            }),
            OrderProductSize: this.sequelize.define('orderProduct_size', {
                amount:{
                    type: Sequelize.INTEGER,
                    defaultValue: 0
                }
            })
        };

        modules.forEach(module => {
            const model = module(this.sequelize, Sequelize);
            if (model.name === 'companies') {
                this.models['Company'] = model;
            } else {
                this.models[modifyName(model.name)] = model;
            }
        });

        Object.keys(this.models).forEach((modelName) => {
            if ('associate' in this.models[modelName]) {
                this.models[modelName].associate(this.models);
            }
        });


    }
    
}

function modifyName(string) {
    return string.charAt(0).toUpperCase() + string.slice(1, string.length - 1);
}

export default DatabaseConnection;
