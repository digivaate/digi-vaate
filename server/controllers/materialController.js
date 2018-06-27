import models from '../models/models';
import Controller from './Controller';

class MaterialController extends Controller {
    constructor(model) { super(model); }
    setRelations(entity, jsonBody){
        entity.setProducts(jsonBody.products);
    }
}

export default new MaterialController(models.Material);