const chatbot = require('../chatbot/chatbot')
const axios = require('axios')
const path = require('path')
    

module.exports = app => {
    // app.get('/', (req, res) => {
    //     res.send({
    //         hello : 'Kaiser'
    //     })
    // })
    
    app.post('/api/df_text_query', async (req, res) => {
        
        let responses = await chatbot.textQuery(req.body.text, req.body.userID, req.body.parameters)
        
        //console.log(responses[0].queryResult)
        
        res.send(responses[0].queryResult)
    })
    
    app.post('/api/df_event_query', async (req, res) => {
        let responses = await chatbot.eventQuery(req.body.event, req.body.userID, req.body.parameters)
        
        //console.log(responses[0].queryResult)
        
        res.send(responses[0].queryResult)
    })

    app.post('/api/powerbi', async (req, res) => {
        let res2 = res
        axios.get('localhost:5300/powerbi/fetch').then((res) => {
            res2.render(res)
        })
        //console.log('dialogflow call')
        //res.send(responses)
    })
    
    
}