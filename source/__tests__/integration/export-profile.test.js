// Copyright 2018 Stanford University see Apache2.txt for license

const path = require('path')

describe('Profiles Export', () => {

  beforeAll(async () => {
    await page.goto('http://localhost:8000/#/profile/create/true')
  })

  describe('Exporting an edited profile', () => {
    beforeEach(async () => {
      const itemProfile002Location = path.join(__dirname, "..", "__fixtures__", 'item_profile_lc_v0.0.2.json')
      await expect(page).toUploadFile(
        'input[type="file"]',
        itemProfile002Location
      )
      // Wait for the Profile to load
      await page.waitForSelector('span[popover-title="Profile ID: profile:bf2:Item"]')

      // Edit some values
      await page.$eval('form[name="profileForm"]', e => e.reset())
      await expect(page).toFillForm('form[name="profileForm"]', {
        id: "profile:my:Item",
        description: "my item profile",
        author: "Me",
        title: "My Profile"
      })
      await page.waitForSelector('a.import-export')
    })

    it('exports JSON data for a non-empty Profile', async () => {
      expect.assertions(7) // ensures promise errors don't give false positive result
      await expect(page).toClick('a.import-export')
      await page.waitForSelector('a[download="My Profile.json"]')
      const data = await page.$eval('a[download="My Profile.json"]', e => e.getAttribute('href'))
      const json = JSON.parse(decodeURIComponent(data.substr(data.indexOf(',') + 1)))
      expect(json['Profile']['id']).toBe('profile:my:Item')
      expect(json['Profile']['description']).toBe('my item profile')
      expect(json['Profile']['author']).toBe('Me')
      expect(json['Profile']['title']).toBe('My Profile')
    })
  })

  describe('exports full JSON data when propertyURI contains # char', () => {
    beforeEach(async () => {
      await page.$eval('form[name="profileForm"]', e => e.reset())
      const profNeedsEncodingLocation = path.join(__dirname, "..", "__fixtures__", 'profile_needs_encoding_v0.1.0.json')
      await expect(page).toUploadFile(
        'input[type="file"]',
        profNeedsEncodingLocation
      )
      // Wait for the Profile to load
      await page.waitForSelector('span[popover-title="Profile ID: sinopia:profile:bf2:Place"]')
      // page
      //   .waitForSelector('a#addResource')
      //   .then(async () => await page.click('a#addResource'))
      //   .catch(error => console.log(`promise error for addResource link: ${error}`))
      // page
      //   .waitForSelector('a.propertyLink', {timeout: 10000})
      //   .then(async () => await page.click('a.propertyLink'))
      //   .catch(error => console.log(`promise error for add property link: ${error}`))
      await page.waitForSelector('a.import-export')
    })

    // FIXME:  this test does NOT fail when there is a # in the imported profile.
    //   it's possible that opening up the resource template and the property template sections before
    //   exporting will be enough to make it fail when the encodeURIComponent line is commented out.
    //   it's also possible the truncation happens AFTER this point in the code.
    it('full JSON verified', async () => {
      expect.assertions(4) // ensures promise errors don't give false positive result
      await expect(page).toClick('a.import-export')
      await page.waitForSelector('a[download="BIBFRAME 2.0 Place.json"]')
      const data = await page.$eval('a[download="BIBFRAME 2.0 Place.json"]', e => e.getAttribute('href'))
      const json = JSON.parse(decodeURIComponent(data.substr(data.indexOf(',') + 1)))
      expect(json['Profile']['resourceTemplates'][0].propertyTemplates[0].propertyURI).toBe('http://www.w3.org/2000/01/rdf-schema#label')
      // the next line appears AFTER the propertyURI line in the file
      expect(json['Profile'].resourceTemplates[0].resourceURI).toBe('http://id.loc.gov/ontologies/bibframe/Place')
    })
  })
})
