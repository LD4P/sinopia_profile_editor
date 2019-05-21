// Copyright 2018 Stanford University see Apache2.txt for license

const path = require('path')

describe('Profiles Export', () => {

  it('exports correct edited values from imported profile', async () => {
    expect.assertions(7)

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
    expect(json['Profile']['id']).toBe('profile:my:Item')
    expect(json['Profile']['description']).toBe('my item profile')
    expect(json['Profile']['author']).toBe('Me')
    expect(json['Profile']['title']).toBe('My Profile')
  })

  describe('exports cleanly', () => {
    beforeAll(async () => {
      return await page.goto('http://127.0.0.1:8000/#/profile/create/')
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
      return await page.reload('http://127.0.0.1:8000/#/profile/create/')
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
})
