const express = require('express');
const MaterialController = require('../controllers/MaterialController');
const multer = require('../multer');

module.exports = (dbConnection) => {
    const router = express.Router();
    const materialController = new MaterialController(dbConnection);

    router.get('/', materialController.find_by_attribute);
    router.get('/image', materialController.getImage);
    router.post('/', materialController.create);
    router.patch('/', materialController.update);
    router.patch('/image', multer.single('image'), materialController.uploadImage);
    router.delete('/', materialController.delete);

    return router;
};
