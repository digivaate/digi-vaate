const express = require('express');
const UserController = require('../controllers/UserController');

module.exports = function (dbConnection) {
    const router = express.Router();
    const userController = new UserController(dbConnection);

    router.get('/', userController.find_by_attribute);
    router.post('/', userController.create);
    router.patch('/', userController.update);
    router.delete('/', userController.delete);

    return router;
}
