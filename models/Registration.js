const mongoose = require('mongoose')
const { Schema } = mongoose

const registrationSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true
    },
    userType: {
        type: String,
        required: true,
        trim: true
    },
    registerDate: Date
})

mongoose.model('registration', registrationSchema)