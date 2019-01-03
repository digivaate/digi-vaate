const Controller = require('./Controller');

class UserController extends Controller {
    constructor(dbConnection) { super(dbConnection, dbConnection.models.users) }

}

module.exports = UserController;