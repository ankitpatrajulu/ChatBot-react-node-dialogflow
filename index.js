const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

require('./routes/dialogFlowRoutes')(app)



const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})