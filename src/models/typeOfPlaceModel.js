const mongoose = require('mongoose')

const typeOfPlaceSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        subtitle: {
            type: String,
            required: true
        },
        icon: {
            type: String,
            required: true
        },  
    },
    {
      timestamps: true,
    }
);

module.exports = mongoose.model('TypeOfPlace', typeOfPlaceSchema);