describe('Sinopia Profile Editor exports an edited profile', () => {

  beforeAll(async () => {
    await page.goto('http://localhost:8000/#/profile/create/true')
  })

  describe('Exporting an edited profile', () => {

    beforeAll(async () => {
      const path = require('path')
      const bf_item_location = path.join(__dirname, "..", "__fixtures__", 'item.json')
      await expect(page).toUploadFile(
          'input[type="file"]',
          bf_item_location,
      )
    })

    it('imports an existing profile', async () => {
      await page.waitForSelector('span[popover-title="Profile ID: profile:bf2:Item"]') // Waits for the Profile to load
    })

    it('changes some values', async () => {
      await page.$eval('form[name="profileForm"]', e => e.reset())
      await expect(page).toFillForm('form[name="profileForm"]', {
        id: "profile:my:Item",
        description: "my item profile",
        author: "Me",
        title: "My Profile"
      })
    }, 10000)

    it('exports JSON data for a non-empty Profile', async () => {
      let data;

      page.click('a.import-export')
          .then(async () => {
            console.log('Export button clicked')
          })
          .catch(e => console.log(`failed promise on clicking the Export button: ${e}`))

      await page.waitFor(1000)

      page.waitForSelector('a[download="My Profile.json"]')
          .then(
            data = await page.$eval('a[download="My Profile.json"]', e => e.getAttribute('href'))
          )
          .catch(e => console.log(`failed promise on download data link: ${e}`))

      const json = JSON.parse(data.substr(data.indexOf(',') + 1))
      expect(json['Profile']['id']).toBe('profile:my:Item')
      expect(json['Profile']['description']).toBe('my item profile')
      expect(json['Profile']['author']).toBe('Me')
      expect(json['Profile']['title']).toBe('My Profile')
    })
  })
})
