const mongoose = require('mongoose');

const colorSchema = mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId},
    name: {type: String, required},
    value: {type: String,
        validate: {
            validator: (v) => {
                //Hexadecimal value
                return /^#(?:[0-9a-f]{3}){1,2}$/i.test(v);
            },
            message: '{VALUE} is not a valid phone number!'
        }
    },
});

module.exports = mongoose.model('Color', colorSchema);
