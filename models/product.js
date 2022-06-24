const mongoose = require('mongoose')
const {Schema} = require('mongoose')

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true,
        min: .99
    },
    category:{
        type: String,
        lowercase: true,
        enum: ['fruit','vegetable', 'diary']
    },
    farm:[
        {
        type: Schema.Types.ObjectId,
        ref: 'Farm'
        }
    ]
})

const Product = mongoose.model('Product',productSchema);

module.exports = Product;  // This is to export the model do it can be used elsewhere