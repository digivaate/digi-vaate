const Controller = require("./Controller");
const Models = require("../models/models");

class SizeController extends Controller {
    constructor() { super(Models.Product); }

}

module.exports = SizeController;