// spoof verso calls to get profiles, vocabularies and ontologies
const path = require('path')
const fs = require('fs')
const profilesDirPath = path.join(__dirname, '..', 'sample_data_from_verso', 'data', 'profiles')

var profiles = []
loadProfiles()
module.exports.profiles = profiles

function loadProfiles () {
  if (profiles.length == 0) {
    fs.readdirSync(profilesDirPath).forEach(file => {
      const fileJson = require(path.join(profilesDirPath, file))
      profiles.push(
        { id: fileJson['Profile']['id'],
          name: fileJson['Profile']['description'],
          configType: 'profile',
          json: fileJson
        }
      )
    })
  }
}
