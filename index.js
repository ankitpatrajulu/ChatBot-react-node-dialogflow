const express = require('express')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

require('./routes/dialogFlowRoutes')(app)



if (process.env.NODE_ENV === 'production') {
    // js and css files
    app.use(express.static('client/build'))
    // index.html for all page routes
    const path = require('path')
    app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    })
}


const port = process.env.PORT || 5000

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})