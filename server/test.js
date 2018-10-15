const Models = require('./models/models');
const fs = require('fs');

const imageData = fs.readFileSync('uploads/img.jpg');

Models.Image.create({
    data: imageData
})
    .then(res => {
        try {
            fs.writeFileSync('uploads/saved/img.jpg', res.data);
        } catch (e) {
            console.log(e);
        }
        Models.sequelize.close();
        process.exit();
    })
    .catch(err => console.error(err));
