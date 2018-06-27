import models from '../models/models';
import Controller from './Controller';

class CollectionController extends Controller {
    constructor() { super(models.Collection); }
}

export default new CollectionController();