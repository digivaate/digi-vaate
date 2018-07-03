import models from '../models/models';
import Controller from './Controller';

class CollectionController extends Controller {
    constructor() { super(models.Collection); }

    setRelations(entity, jsonBody){
        if (jsonBody.materials) entity.setMaterials(jsonBody.materials);
        if (jsonBody.colors) entity.setColors(jsonBody.colors);
    }
}

export default new CollectionController();