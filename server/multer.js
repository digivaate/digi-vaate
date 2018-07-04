import multer from 'multer';

//initialize multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });


//file upload
app.post('/upload',upload.single('image'), (req, res, next) => {
    if (err) { console.error('File upload error: ' + err); }

    console.log(req.file);
    res.send('test');
});