const express = require('express')
var cors = require('cors')
const app = express()
const router = express.Router();
const request = require('superagent');
var http = require('http');
app.use(cors())
router.get('/', (req, rres, next) => {
    let link = req.query.link;
    console.log('link: ', link);

    http.request(link, function (response) {
        if (response.statusCode != 200) {
            rres.sendStatus(response.statusCode);
            return;
        }
        response.on('data', function (chunk) {
            console.log('chunk: ', chunk);
            rres.setHeader('Content-Type', 'application/json');
            rres.send(chunk);
        });
    }).on('error', function (e) {
        rres.status(500);
        rres.send(e);
    }).end();

});

app.use('/livemon', router);
app.listen(3000, () => console.log('Example app listening on port 3000!'));
