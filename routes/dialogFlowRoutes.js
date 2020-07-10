const chatbot = require('../chatbot/chatbot')

module.exports = app => {
    app.get('/', (req, res) => {
        res.send({
            hello : 'Kaiser'
        })
    })
    
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

    app.post('/api/node_query_fetch', async (req, res) => {
        console.log('Reached backend from react' + req.body.cookieID )
        let responses = await chatbot.fetchData()
        //console.log(responses)
        console.log('dialogflow call')
        //res.send(responses)
    })
    
    
}