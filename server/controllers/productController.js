import models from '../models/models';
import Controller from './Controller';

class ProductController extends Controller {
    constructor() { super(models.Product); }
    setRelations(entity, jsonBody){
        if (jsonBody.colors) { entity.setColors(jsonBody.colors); }
        if (jsonBody.materials) { entity.setMaterials(jsonBody.materials); }
    }
}

export default new ProductController();