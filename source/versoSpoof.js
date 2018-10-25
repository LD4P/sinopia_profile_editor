// spoof verso calls to get profiles, vocabularies and ontologies
const path = require('path')
const fs = require('fs')

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
