import models from '../models/models';
import Controller from './Controller';

class ProductController extends Controller {
    constructor(model) { super(model); }
    setRelations(entity, jsonBody){
        entity.setColors(jsonBody.colors);
        entity.setMaterials(jsonBody.materials);
    }
}

export default new ProductController(models.Product);