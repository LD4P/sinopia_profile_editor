var port = 8000;
var express = require('express');

var app = express();

app.use(express.static(__dirname + '/'));
app.listen(port);

console.log('Sinopia Profile Editor running on ' + port);
console.log('Press Ctrl + C to stop.');
