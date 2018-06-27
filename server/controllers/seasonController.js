import models from '../models/models';
import Controller from './Controller';

class SeasonController extends Controller {
    constructor(model) { super(model); }
}


export default new SeasonController(models.Season);