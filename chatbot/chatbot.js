'use strict'

// Instantiating the DialogFlow Client
const dialogFlow = require('dialogflow')
const config = require('../config/keys')
const structjson = require('./structjson')
const mongoose = require('mongoose');

const projectID = config.googleProjectID

const credentials = {
    client_email: config.googleClientEmail,
    private_key: config.googlePrivateKey
}

const sessionsClient = new dialogFlow.SessionsClient({
    projectID,
    credentials
})

// Define Session path

const Registration = mongoose.model('registration')
const Find = mongoose.model('find')

module.exports = {
    textQuery : async function(text, userID,  parameters = {}) {
        let sessionPath = sessionsClient.sessionPath(config.googleProjectID, config.dialogFlowSessionID + userID)
        let self = module.exports
        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    text,
                    languageCode: config.dialogFlowSessionLanguageCode
                }
            },
            queryParams: {
                payload: {
                    data: parameters
                }
            }
        }

        let responses = await sessionsClient
            .detectIntent(request)
            .catch((e) => {
                console.log('Error ', e)
            })
    
        responses = await self.handleAction(responses)

        return responses
    },
    eventQuery : async function(event, userID, parameters = {}) {
        let sessionPath = sessionsClient.sessionPath(config.googleProjectID, config.dialogFlowSessionID + userID)
        let self = module.exports
        const request = {
            session: sessionPath,
            queryInput: {
                event: {
                    name: event,
                    parameters: structjson.jsonToStructProto(parameters),
                    languageCode: config.dialogFlowSessionLanguageCode
                }
            },
            
        }

        let responses = await sessionsClient
            .detectIntent(request)
            .catch((e) => {
                console.log('Error ', e)
            })
    
        responses = await self.handleAction(responses)

        return responses
    },

    handleAction: function(responses) {
        let self = module.exports
        let queryResult = responses[0].queryResult

        switch (queryResult.action) {
            case 'recommendactions-yes' :
                if(queryResult.allRequiredParamsPresent) {
                    self.saveRegistration(queryResult.parameters.fields)
                }
            break;
            case 'CountIntent' :
                if(queryResult.allRequiredParamsPresent) {
                    self.saveFindData(queryResult.parameters.fields)
                }
            break;
        }

        // console.log(queryResult.action)
        // console.log(queryResult.allRequiredParamsPresent)
        // console.log(queryResult.fulfillmentMessages)
        // console.log(queryResult.parameters.fields)
        // console.log(queryResult.parameters.fields.name.stringValue)

        return responses
    },

    saveRegistration: async function(fields) {
        const registration = new Registration({
            name: fields.name.stringValue,
            address: fields.address.stringValue,
            phone: fields.phone.stringValue,
            email: fields.email.stringValue,
            registerDate: Date.now()
        })

        try{
            let req = await registration.save()
            console.log(req)
        } catch(e) {
            console.log(err)
        }
        
    },

    saveFindData: async function(fields) {
        //console.log(fields)
        //console.log(fields.date)
        const findData = new Find({
            invoiceType: fields.InvoiceType.stringValue,
            requiredDate: fields.date.stringValue
        })

        try{
            let req = await findData.save()
            console.log(req)
        } catch(e) {
            console.log(err)
        }
    },

    fetchData: async function () {
        //let user = await Find.findOne({invoiceType: fields.InvoiceType.stringValue, requiredDate: fields.date.Date})
        let user = Find.find().sort({ _id: -1 }).limit(1)
        console.log(user)
        console.log('fetchdata call')
        return user
    }
}