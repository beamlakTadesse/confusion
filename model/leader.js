const mongoose = require('mongoose');
const schema = mongoose.Schema;


const leaderSchema = new schema({
    
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
    
    designation: {
        type: String,
        required: true
    },
    abbr:{
        type: String,
        required: true
    }
},
    {
        timestamps: true
    });

    var Leader = mongoose.model('Leader', leaderSchema);

module.exports = Leader;