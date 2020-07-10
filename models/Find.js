const mongoose = require('mongoose')
const { Schema } = mongoose

const findSchema = new Schema({
    invoiceType: String,
    requiredDate: Date
})

mongoose.model('find', findSchema)