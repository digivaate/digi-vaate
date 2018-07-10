import Models from '../models/models';
import Controller from './Controller';
import fs from 'fs';

class ThemeController extends Controller {
    constructor() { super(Models.Theme); }

    uploadImage(req, res, next) {
        if (!req.file) throw 'File not send';

        Models.Theme.findById(req.params.id)
            .then(ent => {
                if (ent.imagePaths === null) {
                    ent.imagePaths = [req.file.filename];
                } else {
                    let newArr = ent.imagePaths.concat(req.file.filename);
                    ent.set('imagePaths', newArr);
                }
                return ent.save();
            })
            .then(ent => res.send(ent))
            .catch(err => {
                if (fs.existsSync('./uploads/' + req.file.path)) {
                    fs.unlinkSync('./uploads/' + req.file.path);
                }
                res.status(500).json(err);
            });
    }

    deleteImage(req, res, next) {
        Models.Theme.findById(req.params.id)
            .then(ent => {
                if (ent.imagePaths.includes(req.params.imageName)) {
                    if (fs.existsSync('./uploads/' + req.params.imageName)) {
                        fs.unlinkSync('./uploads/' + req.params.imageName);
                    }
                    const index = ent.imagePaths.indexOf(req.params.imageName);
                    if (index > -1) {
                        ent.imagePaths.splice(index, 1);
                    }
                }
                return ent.save();
            })
            .then(ent => {
                res.send(ent);
            })
            .catch(err => {
                res.status(500).json(err);
            });
    }
}

export default new ThemeController();