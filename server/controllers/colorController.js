import models from '../models/models';
import Controller from './Controller';

class ColorController extends Controller {
    constructor(model) { super(model); }
    setRelations(entity, jsonBody){
        entity.setProducts(jsonBody.products);
    }
}

export default new ColorController(models.Color);