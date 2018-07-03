import models from '../models/models';
import Controller from './Controller';

class MaterialController extends Controller {
    constructor() { super(models.Material); }
    setRelations(entity, jsonBody){
        if (jsonBody.products) entity.setProducts(jsonBody.products);
        if (jsonBody.collections) entity.setCollections(jsonBody.collections);
    }
}

export default new MaterialController();