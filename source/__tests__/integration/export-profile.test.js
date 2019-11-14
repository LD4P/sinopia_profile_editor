// Copyright 2018 Stanford University see Apache2.txt for license

const path = require('path')

describe('Profiles Export', () => {

  it('exports correct edited values from imported profile', async () => {
    expect.assertions(8)

    // import a profile
    await page.goto('http://localhost:8000/#/profile/create/true')
    await page.waitForSelector('input[type="file"]', {visible: true})
    const profilePath = path.join(__dirname, "..", "__fixtures__", 'item_profile_lc_v0.0.2.json')
    await expect(page).toUploadFile('input[type="file"]', profilePath)
    await page.waitForSelector('span[popover-title="Profile ID: profile:bf2:Item"]', {visible: true})

    // Edit some values
    await expect(page).toFillForm('form[name="profileForm"]', {
      id: "profile:my:Item",
      description: "my item profile",
      author: "Me",
      title: "My Profile"
    })
    await expect(page).toClick('a.import-export')

    // export
    await page.waitForSelector('a[download="My Profile.json"]', {visible: true})
    const data = await page.$eval('a[download="My Profile.json"]', e => e.getAttribute('href'))
    const json = JSON.parse(decodeURIComponent(data.substr(data.indexOf(',') + 1)))

    // unchanged value
    expect(json['Profile']['date']).toBe('2017-08-08')
    // changed values
    expect(json['Profile']['id']).toBe('profile:my:Item')
    expect(json['Profile']['description']).toBe('my item profile')
    expect(json['Profile']['author']).toBe('Me')
    expect(json['Profile']['title']).toBe('My Profile')
  })

  describe('exports cleanly', () => {
    beforeAll(async () => {
      await page.goto('http://127.0.0.1:8000/#/profile/create/')
    })

    beforeEach(async () => {
      await page.waitForSelector('a#addResource', {visible: true})
      await page.click('a#addResource')
      await page.waitForSelector('a.propertyLink', {visible: true})
      await page.click('a.propertyLink')
      await page.waitForSelector('div[name="propertyForm"] input[name="propertyURI"]', {visible: true})
      await expect(page).toFillForm('form[name="profileForm"]', {
        // all the required fields from profile, resource template, property template except propertyURI
        id: "my:profile",
        description: "Profile description",
        author: "Me",
        title: "My profile",
        resourceId: "my:resource",
        resourceURI: "http://www.example.org",
        resourceLabel: 'rt label',
        rtAuthor: 'rt author',
        propertyLabel: 'propLabel'
      })
      // wait for resourceURI check
      await page.waitFor(1000, {waitUntil: 'networkidle2'})
      const valid_url_class = await page.$('input[name="resourceURI"]', e => e.getAttribute('ng-valid-url'))
      expect(valid_url_class).toBeTruthy()
    })

    afterEach(async() => {
      await page.reload('http://127.0.0.1:8000/#/profile/create/')
    })

    it.each`
      propURI
      ${'http://www.example.org/nofrag'}
      ${'http://www.example.org#frag'}
    `('full propertyURI regardless of # char', async({propURI}) => {
      expect.assertions(6) // includes 2 in beforeEach
      await page.waitForSelector('input[name="propertyURI"]')
      await expect(page).toFillForm('form[name="profileForm"]', {
        propertyURI: propURI
      })
      // wait for propertyURI check
      await page.waitFor(1000, {waitUntil: 'networkidle2'})
      const valid_url_class = await page.$('input[name="propertyURI"]', e => e.getAttribute('ng-valid-url'))
      expect(valid_url_class).toBeTruthy()

      await expect(page).toClick('a.import-export')
      await page.waitForSelector('a[download="My profile.json"]', {visible: true})

      const data = await page.$eval('a[download="My profile.json"]', e => e.getAttribute('href'))
      const json = JSON.parse(decodeURIComponent(data.substr(data.indexOf(',') + 1)))
      expect(json['Profile']['resourceTemplates'][0]['propertyTemplates'][0]['propertyURI']).toEqual(propURI)
    })
  })

  describe('schema version', () => {
    const profile009SchemaURL = 'https://ld4p.github.io/sinopia/schemas/0.0.9/profile.json'
    const rt009SchemaURL = 'https://ld4p.github.io/sinopia/schemas/0.0.9/resource-template.json'

    afterEach(async() => {
      await page.reload('http://127.0.0.1:8000/#/profile/create/')
    })

    test('0.0.9 when profile created from scratch', async () => {
      expect.assertions(6)
      await page.goto('http://127.0.0.1:8000/#/profile/create/')
      await page.waitForSelector('a#addResource', {visible: true})
      await page.click('a#addResource')
      await page.waitForSelector('a.propertyLink', {visible: true})
      await page.click('a.propertyLink')
      await page.waitForSelector('div[name="propertyForm"] input[name="propertyURI"]', {visible: true})
      await expect(page).toFillForm('form[name="profileForm"]', {
        // all the required fields from profile, resource template, property template except propertyURI
        id: "my:profile",
        description: "Profile description",
        author: "Me",
        title: "My profile",
        resourceId: "my:resource",
        resourceURI: "http://www.example.org",
        resourceLabel: 'rt label',
        rtAuthor: 'rt author',
        propertyLabel: 'propLabel',
        propertyURI: 'http://example.org/pt1'
      })
      // wait for resourceURI and propertyURI checks
      await page.waitFor(1000, {waitUntil: 'networkidle2'})
      let valid_url_class = await page.$('input[name="resourceURI"]', e => e.getAttribute('ng-valid-url'))
      expect(valid_url_class).toBeTruthy()
      valid_url_class = await page.$('input[name="propertyURI"]', e => e.getAttribute('ng-valid-url'))
      expect(valid_url_class).toBeTruthy()

      await expect(page).toClick('a.import-export')
      await page.waitForSelector('a[download="My profile.json"]', {visible: true})
      const data = await page.$eval('a[download="My profile.json"]', e => e.getAttribute('href'))
      const json = JSON.parse(decodeURIComponent(data.substr(data.indexOf(',') + 1)))

      expect(json['Profile']['schema']).toEqual(profile009SchemaURL)
      expect(json['Profile']['resourceTemplates'][0]['schema']).toEqual(rt009SchemaURL)
    })

    test('0.0.9 when imported profile has no schema url', async () => {
      expect.assertions(5)
      await page.goto('http://localhost:8000/#/profile/create/true')
      const profilePath = path.join(__dirname, "..", "__fixtures__", 'item_profile_lc_v0.0.2.json')
      await expect(page).toUploadFile('input[type="file"]', profilePath)
      const profileLoadedSel = 'div#profile-panel .panel-heading span[popover-title="Profile ID: profile:bf2:Item"]'
      await page.waitForSelector(profileLoadedSel, {visible: true})
      await expect(page).toClick(profileLoadedSel)

      await expect(page).toClick('a.import-export')
      await page.waitForSelector('a[download="BIBFRAME 2.0 Item.json"]', {visible: true})
      const data = await page.$eval('a[download="BIBFRAME 2.0 Item.json"]', e => e.getAttribute('href'))
      const json = JSON.parse(decodeURIComponent(data.substr(data.indexOf(',') + 1)))

      expect(json['Profile']['schema']).toEqual(profile009SchemaURL)
      expect(json['Profile']['resourceTemplates'][0]['schema']).toEqual(rt009SchemaURL)
    })

    test('0.0.9 when imported profile is 0.1.0', async () => {
      expect.assertions(5)
      await page.goto('http://localhost:8000/#/profile/create/true')
      const profilePath = path.join(__dirname, "..", "__fixtures__", 'place_profile_sinopia_v0.1.0.json')
      await expect(page).toUploadFile('input[type="file"]', profilePath)
      const profileLoadedSel = 'div#profile-panel .panel-heading span[popover-title="Profile ID: sinopia:profile:bf2:Place"]'
      await page.waitForSelector(profileLoadedSel, {visible: true})
      await expect(page).toClick(profileLoadedSel)

      await expect(page).toClick('a.import-export')
      await page.waitForSelector('a[download="BIBFRAME 2.0 Place.json"]', {visible: true})
      const data = await page.$eval('a[download="BIBFRAME 2.0 Place.json"]', e => e.getAttribute('href'))
      const json = JSON.parse(decodeURIComponent(data.substr(data.indexOf(',') + 1)))

      expect(json['Profile']['schema']).toEqual(profile009SchemaURL)
      expect(json['Profile']['resourceTemplates'][0]['schema']).toEqual(rt009SchemaURL)
    })

    test('0.0.9 when imported profile is 0.2.0', async () => {
      expect.assertions(5)
      await page.goto('http://localhost:8000/#/profile/create/true')
      const profilePath = path.join(__dirname, "..", "__fixtures__", 'place_profile_sinopia_v0.2.0.json')
      await expect(page).toUploadFile('input[type="file"]', profilePath)
      const profileLoadedSel = 'div#profile-panel .panel-heading span[popover-title="Profile ID: sinopia:profile:bf2:Place"]'
      await page.waitForSelector(profileLoadedSel, {visible: true})
      await expect(page).toClick(profileLoadedSel)

      await expect(page).toClick('a.import-export')
      await page.waitForSelector('a[download="BIBFRAME 2.0 Place.json"]', {visible: true})
      const data = await page.$eval('a[download="BIBFRAME 2.0 Place.json"]', e => e.getAttribute('href'))
      const json = JSON.parse(decodeURIComponent(data.substr(data.indexOf(',') + 1)))

      expect(json['Profile']['schema']).toEqual(profile009SchemaURL)
      expect(json['Profile']['resourceTemplates'][0]['schema']).toEqual(rt009SchemaURL)
    })
  })

  describe('valueDataType redering', () => {
    beforeAll(async() => {
      await page.goto('http://localhost:8000/#/profile/create/true')
      await page.waitForSelector('a#addResource', {visible: true})
      await page.click('a#addResource')
      await page.waitForSelector('a.propertyLink', {visible: true})
      await page.click('a.propertyLink')
      await page.waitForSelector('div[name="propertyForm"] input[name="propertyURI"]', {visible: true})
    })

    test('removes valueDataType from profile if empty', async() => {
      expect.assertions(3)
      await expect(page).toFillForm('form[name="profileForm"]', {
        // all the required fields from profile, resource template, property template except dataTypeURI
        id: "my:profile",
        description: "Profile description",
        author: "Me",
        title: "My profile",
        resourceId: "my:resource",
        resourceURI: "http://www.example.org",
        resourceLabel: 'rt label',
        rtAuthor: 'rt author',
        propertyLabel: 'propLabel',
        propertyURI: "http://www.example.org/prop"
      })
      await expect(page).toClick('a.import-export')
      await page.waitForSelector('a[download="My profile.json"]', {visible: true})
      const data = await page.$eval('a[download="My profile.json"]', e => e.getAttribute('href'))
      const json = JSON.parse(decodeURIComponent(data.substr(data.indexOf(',') + 1)))

      expect(json['Profile']['resourceTemplates'][0]['propertyTemplates'][0]['valueConstraint']['valueDataType']).not.toBeDefined()
    })

    test('generates the correct valueDataType for editor schema validation', async() => {
      expect.assertions(4)
      await page.waitFor(500)
      await page.waitForSelector('a#addValueDataType')
      await page.click('a#addValueDataType')
      await page.waitForSelector('input[name="dataTypeURI"]')

      await expect(page).toFillForm('form[name="profileForm"]', {
        // all the required fields from profile, resource template, property template
        id: "my:profile",
        description: "Profile description",
        author: "Me",
        title: "My profile",
        resourceId: "my:resource",
        resourceURI: "http://www.example.org",
        resourceLabel: 'rt label',
        rtAuthor: 'rt author',
        propertyLabel: 'propLabel',
        propertyURI: "http://www.example.org/prop",
        dataTypeURI: "http://example.com/test"
      })

      await expect(page).toClick('a.import-export')
      await page.waitForSelector('a[download="My profile.json"]', {visible: true})
      const data = await page.$eval('a[download="My profile.json"]', e => e.getAttribute('href'))
      const json = JSON.parse(decodeURIComponent(data.substr(data.indexOf(',') + 1)))
      expect(json['Profile']['resourceTemplates'][0]['propertyTemplates'][0]['valueConstraint']['valueDataType']).toBeDefined()
      expect(json['Profile']['resourceTemplates'][0]['propertyTemplates'][0]['valueConstraint']['valueDataType']['dataTypeURI']).toEqual('http://example.com/test')
    })

  })
})
