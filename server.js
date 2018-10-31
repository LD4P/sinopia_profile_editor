
const port = 8000;
// const host = '127.0.0.1'

var express = require('express');
var app = express();

app.use(express.static('dist'));
app.use(express.static('source'));
app.use(express.static('node_modules'));

const versoSpoof = require('./source/versoSpoof.js')

app.all("/verso*", function (req, res, next) {
  if (req.query.filter.where.configType === 'profile') {
    res.json(versoSpoof.profiles)
  } else if (req.query.filter.where.configType === 'ontology') {
    res.json(versoSpoof.ontologies)
  } else if (req.query.filter.where.configType === 'vocabulary') {
    res.json(versoSpoof.vocabularies)
  } else {
    res.send(`Verso not enabled -- app made request ${req}`)
  }
  next()
})

const ontologyUrls = []
loadOntologyUrls()
app.all("/server/whichrt", function (req, res) {
  const reqUri = req.query.uri
  if (reqUri != null) {
    // console.debug(`DEBUG: got server/whichrt for ${reqUri}.`)
    if (ontologyUrls.includes(reqUri)) {
      // FIXME:  there's probably a better way to find the value in array forEach, but there are only 5 urls
      var oxml
      versoSpoof.owlOntUrlToXmlMappings.forEach( function(el) {
        if (reqUri == el.url) {
          oxml = el.xml
        }
      })
      res.status(200).type('xml').send(oxml)
    } else {
      // other spots using whichRT are checkURI validations for resourceURI and propertyURI
      console.error(`server/whichrt called for uri other than ontology ${reqUri}`)
      res.status(400).send(`server/whichrt called for uri other than ontology ${reqUri}`)
    }
  } else {
    console.error(`server/whichrt called without uri ${req}`)
    res.status(400).send(`server/whichrt called without uri ${req}`)
  }
})

function loadOntologyUrls() {
  versoSpoof.ontologies.forEach(function (el) {
    ontologyUrls.push(el.json.url)
  })
}

// app.listen(port, host);
app.listen(port);

// console.log(`Sinopia Profile Editor running on http://${host}:${port}`);
console.log(`Sinopia Profile Editor running on localhost:${port}`);
console.log('Press Ctrl + C to stop.');
