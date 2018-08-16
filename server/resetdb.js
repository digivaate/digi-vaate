const models = require('./models/models');

const db = models.sequelize;
let products = [];
let materials = [];
let colors = [];
let collections = [];
let seasons = [];
let companies = [];
let themes = [];
let sizes = [];
let orders = [];
let orderProducts = [];

let promises = [];

db.sync({force: true})
    .then(createEntities)
    .then(addRelations)
    .then(close)
    .catch(err => console.error(err));

function createEntities() {
    promises = [
        models.Color.create({
            name: 'white',
            value: '#ffffff'
        }).then(res => colors.push(res)),

        models.Color.create({
            name: 'red',
            value: '#c12c2c'
        }).then(res => colors.push(res)),

        models.Color.create({
            name: 'blue',
            value: '#2d44ff'
        }).then(res => colors.push(res)),

        models.Material.create({
            name: 'leather',
            consumption: 2,
            unitPrice: 5,
            freight: 3,
            weight: 200,
            width: 0.5,
            minQuality: 4,
            instructions: 'instructions',
            manufacturer: 'manufacturer name',
            composition: 'composition description'
        }).then(res => materials.push(res)),

        models.Material.create({
            name: 'wool',
            consumption: 4,
            unitPrice: 2,
            freight: 1,
            weight: 100,
            width: 0.8,
            minQuality: 3,
            instructions: 'instructions',
            manufacturer: 'manufacturer name',
            composition: 'composition description'
        }).then(res => materials.push(res)),

        models.Product.create({
            name: 'Jacket',
            coverPercent: 30.5,
            resellerProfitPercent: 25.5,
            sellingPrice: 0,
            subcCostTotal: 20
        }).then(res => products.push(res)),

        models.Product.create({
            name: 'T-shirt',
            coverPercent: 20.5,
            resellerProfitPercent: 20.5,
            sellingPrice: 60,
            subcCostTotal: 10
        }).then(res => products.push(res)),

        models.Product.create({
            name: 'Hoodie',
            coverPercent: 10.5,
            resellerProfitPercent: 50.5,
            sellingPrice: 120,
            subcCostTotal: 30
        }).then(res => products.push(res)),

        models.Company.create({
            name: 'Demo company',
            taxPercent: 24
        }).then(res => companies.push(res)),

        models.Season.create({
            name: 'winter',
            budget: 200000
        }).then(res => seasons.push(res)),

        models.Collection.create({
            name: 'winter sports'
        }).then(res => collections.push(res)),

        models.Theme.create({
            name: 'winter themes'
        }).then(res => themes.push(res)),

        models.Size.create({
            value: 'M'
        }).then(res => sizes.push(res)),

        models.Size.create({
            value: 'L'
        }).then(res => sizes.push(res)),

        models.Order.create({
            date: Date.now(),
            price: 2000,
            deliveryCosts: 200,
            taxPercent: 24
        }).then(res => orders.push(res)),

        models.OrderProduct.create({
            orderId: 1,
            productId: 1,
        })
            .then(res => orderProducts.push(res))
    ];

    return Promise.all(promises);
}

function addRelations() {
    promises = [
        products[0].setColors([1,2]),
        products[0].addMaterial(1, {through: {consumption: 20}}),
        products[1].addMaterial(1, {through: {consumption: 10}}),
        collections[0].updateAttributes({ seasonId: 1}),
        collections[0].setTheme(1),
        collections[0].addProduct(products[0]),
        collections[0].addColor(colors[1]),
        seasons[0].updateAttributes({ companyId: 1}),
        seasons[0].addProduct(products[1]),
        seasons[0].addColor(colors[2]),
        companies[0].addProduct(products[2]),
        companies[0].addColor(colors[0]),
        products[0].addSize(1),
        products[1].addSize(2),
        orderProducts[0].addSize(1, {through: {amount: 10} }),
    ];
    return Promise.all(promises);
}


function close() {
    db.close();
    process.exit();
}