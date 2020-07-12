let path = require('path');
let embedToken = require(__dirname + '/embedTokenGenerationService.js');
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const axios = require('axios')

// Prepare server for Bootstrap, jQuery and PowerBI files
app.use('/js', express.static('./node_modules/bootstrap/dist/js/')); // Redirect bootstrap JS
app.use('/js', express.static('./node_modules/jquery/dist/')); // Redirect JS jQuery
app.use('/js', express.static('./node_modules/powerbi-client/dist/')) // Redirect JS PowerBI
app.use('/css', express.static('./node_modules/bootstrap/dist/css/')); // Redirect CSS bootstrap
app.use('/public', express.static('./public/')); // Use custom JS and CSS files

const port = process.env.PORT || 5300;

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/../views/index.html'));
});

app.get('/powerbi', function(req, res) {
    //res.sendFile(path.join(__dirname + '/../views/index.html'));
    res.render(path.join(__dirname + '/../views/index.html'))
});

app.get('/powerbi/getEmbedToken', async function(req, res) {

    // Get the details like Embed URL, Access token and Expiry
    let result = await embedToken.generateEmbedToken();

    // result.status specified the statusCode that will be sent along with the result object
    res.status(result.status).send(result);
});


// if (process.env.NODE_ENV === 'production') {
//     // js and css files
//     app.use(express.static('client/build'))
//     // index.html for all page routes
//     const path = require('path')
//     app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
//     })
// }



app.listen(port, () => console.log(`Listening on port ${port}`));