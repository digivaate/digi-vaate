import models from '../models/models';
import Controller from './Controller';

class ColorController extends Controller {
    constructor() { super(models.Color); }
    setRelations(entity, jsonBody){
        if (jsonBody.products) entity.setProducts(jsonBody.products);
    }
}

export default new ColorController();