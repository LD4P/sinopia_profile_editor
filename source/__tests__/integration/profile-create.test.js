const path = require('path')

describe('Sinopia Profile Editor imports a Profile', () => {

  beforeAll(async () => {
    await page.goto('http://127.0.0.1:8000/#/profile/create')
  })

  describe('Import Data Modal Upload Dialog', () => {

    beforeAll(async () => {
      await expect(page).toClick('a', { text: 'Import'})
    })

    it('displays Import Data dialog after Import button is clicked', async () => {
      await expect(page).toMatch(/Import Data/)
    })

    it('uploads a local BIBFRAME 2.0 Item Profile', async () => {
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
