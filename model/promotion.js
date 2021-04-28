const mongoose = require('mongoose');
const schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency; 

const promotionSchema = new schema({
    
    name: {
        type: String,
        unique: true,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Currency,
        required: true,
        min: 0
    },
    lable: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    });

    var Promotion = mongoose.model('Promotion', promotionSchema);

module.exports = Promotion;