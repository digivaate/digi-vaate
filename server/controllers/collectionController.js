import models from '../models/models';
import Controller from './Controller';

class CollectionController extends Controller {
    constructor(model) { super(model); }
}

export default new CollectionController(models.Collection);