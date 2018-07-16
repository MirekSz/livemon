const express = require('express')
var cors = require('cors')
const app = express()
const router = express.Router();
const request = require('superagent');
var http = require('http');
var https = require('https');
app.use(cors())
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
router.get('/', (req, rres, next) => {
    let link = req.query.link;
    console.log('link: ', link);
    let requester = link.startsWith('https') ? https : http;
    requester.request(link, function (response) {
        let str = '';
        if (response.statusCode != 200) {
            rres.sendStatus(response.statusCode);
            return;
        }

        response.on('data', function (chunk) {
            str += chunk;
        });
        response.on('end', function () {
            rres.setHeader('Content-Type', 'application/json');
            rres.send(str);
        });
    }).on('error', function (e) {
        rres.status(500);
        rres.send(e);
    }).end();

});

app.use('/livemon', router);
app.listen(3000, () => console.log('Example app listening on port 3000!'));
