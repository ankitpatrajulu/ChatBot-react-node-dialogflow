'use strict'

// Instantiating the DialogFlow Client
const dialogFlow = require('dialogflow')
const config = require('../config/keys')
const structjson = require('./structjson')

const projectID = config.googleProjectID

const credentials = {
    client_mail: config.googleClientMail,
    private_key: config.googlePrivateKey
}

const sessionsClient = new dialogFlow.SessionsClient({
    projectID,
    credentials
})

// Define Session path
const sessionPath = sessionsClient.sessionPath(config.googleProjectID, config.dialogFlowSessionID)

module.exports = {
    textQuery : async function(text, parameters = {}) {
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
    eventQuery : async function(event, parameters = {}) {
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
        return responses
    }
}