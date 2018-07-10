import multer from 'multer';
import path from 'path';

//initialize multer for file storing
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        console.log(req.query.name);
        cb(null, req.query.name + path.extname(file.originalname));
    }
});

export default multer({ storage: storage });
