const mongoose = require('mongoose')
const { Schema } = mongoose

const messagesSchema = new Schema({
    cookieID: String,
    date: Date,
    messages: Array
})

mongoose.model('messages', messagesSchema)