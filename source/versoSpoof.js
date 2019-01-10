// Copyright 2018 Stanford University see Apache2.txt for license

// spoof verso calls to get profiles, vocabularies and ontologies
const path = require('path')
const fs = require('fs')
const valuesFromConfig = require('../sample_data_from_verso/data/config/lookupConfig.json')

var profiles = []
loadProfiles()
module.exports.profiles = profiles

function loadProfiles () {
  if (profiles.length == 0) {
    const profilesDirPath = path.join(__dirname, '..', 'sample_data_from_verso', 'data', 'profiles')
    fs.readdirSync(profilesDirPath).forEach(file => {
      const fileJson = require(path.join(profilesDirPath, file))
      profiles.push(
        {
          id: fileJson['Profile']['id'],
          name: fileJson['Profile']['description'],
          configType: 'profile',
          json: fileJson
        }
      )
    })
  }
}

var vocabularies = []
loadVocabs()
module.exports.vocabularies = vocabularies

function loadVocabs() {
  const x2js = require('x2js')
  const x2json_parser = new x2js()
  if (vocabularies.length == 0) {
    const langVocabPath = path.join(__dirname, '..', 'sample_data_from_verso', 'data', 'vocabularies', 'languages.rdf')
    const xml = fs.readFileSync(langVocabPath, {encoding: 'utf8'})
    vocabularies.push(
      {
        name: "Languages",
        configType: "vocabulary",
        json: x2json_parser.xml2js(xml)
      }
    )
  }
}

// Manual construction of ontologies list, based on lcnetdev verso/server/boot/05-load-ontologies.js
module.exports.ontologies = [
  {
    'id': 'Bibframe-ontology',
    'configType': 'ontology',
    'name': 'Bibframe-ontology',
    'json': {'label': 'Bibframe 2.0', 'url': 'http://id.loc.gov/ontologies/bibframe.rdf'},
  },
  {
    'id': 'BFLC-ontology',
    'configType': 'ontology',
    'name': 'BFLC-ontology',
    'json': {'label': 'BFLC', 'url': 'http://id.loc.gov/ontologies/bflc.rdf'},
  },
  {
    'id': 'MADSRDF-ontology',
    'configType': 'ontology',
    'name': 'MADSRDF-ontology',
    'json': {'label': 'MADSRDF', 'url': 'http://www.loc.gov/standards/mads/rdf/v1.rdf'},
  },
  {
    'id': 'RDF-ontology',
    'configType': 'ontology',
    'name': 'RDF-ontology',
    'json': {'label': 'RDF', 'url': 'http://www.w3.org/1999/02/22-rdf-syntax-ns.rdf'},
  },
  {
    'id': 'RDF-Schema-ontology',
    'configType': 'ontology',
    'name': 'RDF-Schema-ontology',
    'json': {'label': 'RDFS', 'url': 'http://www.w3.org/2000/01/rdf-schema.rdf'},
  }
]

const owlOntUrl2FileMappings = [
  {'url': 'http://id.loc.gov/ontologies/bibframe.rdf', 'fname': 'bibframe.rdf.xml'},
  {'url': 'http://id.loc.gov/ontologies/bflc.rdf', 'fname': 'bflc.rdf.xml'},
  {'url': 'http://www.loc.gov/standards/mads/rdf/v1.rdf', 'fname': 'mads-v1.rdf.xml'},
  {'url': 'http://www.w3.org/1999/02/22-rdf-syntax-ns.rdf', 'fname': 'rdf-syntax-ns.rdf.xml'},
  {'url': 'http://www.w3.org/2000/01/rdf-schema.rdf', 'fname': 'rdf-schema.rdf.xml'}
]
function loadOwlOntologies() {
  const x2js = require('x2js')
  const x2json_parser = new x2js()
  if (owlOntUrlToXmlMappings.length == 0) {
    owlOntUrl2FileMappings.forEach(function (mappingEl) {
      const fileName = mappingEl['fname']
      const filePath = path.join(__dirname, 'assets', 'rdfxml', fileName)
      const oxml = fs.readFileSync(filePath, {encoding: 'utf8'})
      owlOntUrlToXmlMappings.push(
        {
          url: mappingEl['url'],
          'xml': oxml
        }
      )
    })
  }
}

var owlOntUrlToXmlMappings = []
loadOwlOntologies()
module.exports.owlOntUrlToXmlMappings = owlOntUrlToXmlMappings

// Manual construction of property types list, based on lcnetdev verso/server/boot/45-load-types.js
module.exports.propertyTypes = [
  {
    'name': 'propertyTypes',
    'configType': 'propertySettings',
    'json': ['literal', 'resource', 'lookup', 'target', 'list']
  }
]

module.exports.valuesFromConfig = [
  {
    'name': 'valuesFromURIs',
    'configType': 'valuesFromConfig',
    'json': valuesFromConfig
  }
]
