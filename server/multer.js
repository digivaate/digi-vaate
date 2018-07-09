import multer from 'multer';
import path from 'path';

//initialize multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, + req.query.id + '-' + Date.now() + path.extname(file.originalname));
    }
});

export default multer({ storage: storage });
