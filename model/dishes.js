const mongoose = require('mongoose');
const schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency; 

const commentSchema = new schema({
    ratting: {
        type: Number,
        max: 5,
        min: 1,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    });
const dishSchema = new schema({
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
    catagory: {
        type: String,
        required: true
    },
    lable: {
        type: String,
        default: ''
    },
    featured: {
        type: Boolean,
        default: true
    },
    price: {
        type: Currency,
        required: true,
        min: 0
    },
    comment:[ commentSchema ]
}, {
    timestamps: true
});
var Dishes = mongoose.model('Dish', dishSchema);

module.exports = Dishes;