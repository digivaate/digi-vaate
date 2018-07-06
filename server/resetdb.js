import Models from './models/models';

const db = Models.sequelize;
let products = [];
let materials = [];
let colors = [];
let collections = [];
let seasons = [];
let companies = [];

let promises = [];

db.sync({force: true})
    .then(createEntices)
    .then(addRelations)
    .then(close)
    .catch(err => console.error(err));

function createEntices() {
    promises = [
        Models.Color.create({
            name: 'white',
            value: '#ffffff'
        }).then(res => colors.push(res)),

        Models.Color.create({
            name: 'red',
            value: '#c12c2c'
        }).then(res => colors.push(res)),

        Models.Material.create({
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

        Models.Product.create({
            name: 'Jacket',
            coverPercent: 30.5,
            resellerProfitPercent: 25.5,
            taxPercent: 24,
            subcCostTotal: 20
        }).then(res => products.push(res)),

        Models.Company.create({
            name: 'Lumi',
            taxPercent: 24
        }).then(res => companies.push(res)),

        Models.Season.create({
            name: 'winter',
            budget: 200000
        }).then(res => seasons.push(res)),

        Models.Collection.create({
            name: 'winter sports'
        }).then(res => collections.push(res))
    ];

    return Promise.all(promises);
}

function addRelations() {
    promises = [
        products[0].setColors([1,2]),
        products[0].setMaterials(1),
        products[0].updateAttributes({ collectionId: 1 }),
        collections[0].updateAttributes({ seasonId: 1}),
        seasons[0].updateAttributes({ companyId: 1})
    ];
    return Promise.all(promises);
}


function close() {
    db.close();
    process.exit();
}