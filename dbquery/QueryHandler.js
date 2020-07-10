const mongoose = require('mongoose')

const Registration = mongoose.model('registration')

module.exports = {
    async findUser(user){
        const response = await Registration.findOne({address: user})
        console.log(response)
        return response
    }
}