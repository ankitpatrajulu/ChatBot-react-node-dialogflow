const dfff = require('dialogflow-fulfillment')
const {WebhookClient} = require('dialogflow-fulfillment')
const {findUser} = require('../dbquery/QueryHandler')
const structjson = require('../chatbot/structjson')
const chatbot = require('../chatbot/chatbot')

module.exports = app => {
    app.post('/', async (req, res) => {
        const agent = new WebhookClient({
            request: req, 
            response: res
        })

        function CountIntent(agent) {
           
            agent.add('Welcome to the CountIntent fulfillment. ')

        }

        function customPayloadFunction(agent) {
                const count = "7890"
                var payloadData = {
                    "richContent": [
                          {
                            "type": "Invoice Count",
                            "title": "The sum total of all invoices",
                            "subtitle": "--AMS Team",
                            "image": {
                              "src": {
                                "rawUrl": "https://example.com/images/logo.png"
                              }
                            },
                            "text": count
                          }
                      ]
                }
    
                agent.add( new dfff.Payload(agent.UNSPECIFIED, payloadData, {sendAsMessage: true, rawPayload: true}))
        }

        function fallback(agent) {
            agent.add('I didn\'t understand!')
            agent.add('I\'m sorry, can you try again?')
        }

        let intentMap = new Map()

        intentMap.set('CountIntent', CountIntent)
        intentMap.set('Default Fallback Intent', fallback)
        intentMap.set('customPayloadFunction', customPayloadFunction)

        agent.handleRequest(intentMap)

    })
}