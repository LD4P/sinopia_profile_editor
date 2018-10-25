
const port = 8000;
// const host = '127.0.0.1'

var express = require('express');
var app = express();

app.use(express.static('dist'));
app.use(express.static('source'));
app.use(express.static('node_modules'));

const versoSpoof = require('./source/versoSpoof.js')
app.all("/verso*", function (req, res) {
  if (req.query.filter.where.configType === 'profile') {
    res.json(versoSpoof.profiles)
  } else if (req.query.filter.where.configType === 'ontology') {
    res.json(versoSpoof.ontologies)
  } else if (req.query.filter.where.configType === 'vocabulary') {
    res.json(versoSpoof.vocabularies)
  } else {
    res.send(`Verso not enabled -- app made request ${req}`)
  }
})
// app.listen(port, host);
app.listen(port);

// console.log(`Sinopia Profile Editor running on http://${host}:${port}`);
console.log(`Sinopia Profile Editor running on localhost:${port}`);
console.log('Press Ctrl + C to stop.');
