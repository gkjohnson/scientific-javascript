const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const sjsparser = require('./scripts/scientific-javascript-parser.js')
//var mod = sweet.loadNodeModule(root, modulePath);
/*var out = sweet.compile(<contents>, {
    modules: [mod]
});*/

const step1 = fs.readFileSync(__dirname + '/scripts/sweetjs/wrapping.swt').toString();
const step2 = fs.readFileSync( __dirname + '/scripts/sweetjs/operatorOverload.swt').toString();


const port = 3000
const app = express();
app.use(bodyParser.json())

app.use('/', express.static(__dirname + '/'));
app.post('/compile', (req, res) => {
    const code = sjsparser.parse(req.body.text, step1, step2);
    res.send(code);
});
app.listen(port);
console.log(`listening on port ${port}`);