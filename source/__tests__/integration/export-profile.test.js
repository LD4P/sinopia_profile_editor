const path = require('path')

describe('Sinopia Profile Editor exports a loaded Profile', () => {

  beforeAll(async () => {
    await page.goto('http://127.0.0.1:8000/#/profile/create')
  })

  it('clicks Verbose Export and displays an error with missing profile form data', async () => {
     await expect(page).toClick('a', { text: 'Verbose Export'})
     const alert_box_header = await page.$eval('#alertBox > div > div > div.modal-header > h3', e => e.textContent)
     await expect(alert_box_header).toMatch(/Error\!/)
 })

  describe('Exporting an existing profile', () => {

    beforeAll(async () => {
      await expect(page).toClick('a', { text: 'Import'})
      const bf_item_location = path.join(__dirname, "..", "__fixtures__", 'item.json')
      await expect(page).toUploadFile(
        'input[type="file"]',
        bf_item_location,
      )
    })

    it('clicks the Verbose Button and downloads the loaded Profile', async () => {
      await page.waitFor(1000)
      await expect(page).toClick('a', { text: 'Verbose Export'})
    })
  })
})
