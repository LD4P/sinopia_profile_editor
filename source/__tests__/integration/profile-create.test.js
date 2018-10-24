const path = require('path')

describe('Sinopia Profile Editor imports a Profile', () => {

  describe('It has an Import button', () => {

    beforeAll(async () => {
      await page.goto('http://127.0.0.1:8000/#/profile/sinopia').then({waitUntil: 'networkidle2'})
      await expect(page).toClick('a', {text: 'Import'})
    })

    it('Redirects to the new profile page state', async () => {
      await expect(page).toMatch(/Create a new Profile/);
    })

  })

  describe('Import Data Modal Upload Dialog', () => {

    beforeAll(async () => {
      await page.goto('http://127.0.0.1:8000/#/profile/create/true')
    })

    it('uploads a local Item Profile and checks to see if it is loaded', async () => {
      const bf_item_location = path.join(__dirname, "..", "__fixtures__", 'item.json')

      await expect(page).toUploadFile(
        'input[type="file"]',
        bf_item_location,
      )

      await page.waitFor(1000) // Waits for the Profile to load
      await expect(page).toMatch(/BIBFRAME 2.0 Item/)
      await expect(page).toMatch(/Lending or Access Policy/)
      await expect(page).toMatch(/Use or Reproduction Policy/)
      await expect(page).toMatch(/Retention Policy/)
      await expect(page).toMatch(/Immediate Source of Acquisition/)
      await expect(page).toMatch(/Enumeration/)
      await expect(page).toMatch(/Chronology/)
    })
  })
})
