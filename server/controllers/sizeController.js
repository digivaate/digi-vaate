const Controller = require("./Controller");
const Models = require("../models/models");

class SizeController extends Controller {
    constructor() { super(Models.Size); }

}

module.exports = SizeController;