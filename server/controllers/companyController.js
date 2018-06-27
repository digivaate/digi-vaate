import models from '../models/models';
import Controller from './Controller';

class CompanyController extends Controller {
    constructor(model) { super(model); }
}

export default new CompanyController(models.Company);