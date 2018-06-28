import models from '../models/models';
import Controller from './Controller';

class ColorController extends Controller {
    constructor() { super(models.Color); }
    setRelations(entity, jsonBody){
        if (jsonBody.products) entity.setProducts(jsonBody.products);
    }
    validateValue = (req, res, next) => {
        if (!req.body.value || req.body.value.match(/^#(?:[0-9a-f]{3}){1,2}$/i) ) {
            next();
        } else {
            res.status(500).json({error: 'value is not in correct hex format'});
        }
    };
}

export default new ColorController();