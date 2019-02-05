// Copyright 2018 Stanford University see Apache2.txt for license

describe('Sinopia Profile Editor does not export an invalid Profile', () => {

  beforeAll(async () => {
    await page.goto('http://localhost:8000/#/profile/create/true')
  })

  describe('shows an error message', () => {
    it('modal displayed', async () => {
      await expect(page).toClick('a', { text: 'Export'})
      const sel_text = await page.$eval('#alert_text', e => e.textContent)
      await page.screenshot({path: 'empty-profile.png'})
      expect(sel_text).toMatch('Parts of the form are invalid')
    })

    it('closes the alert modal', async () => {
      page
        .waitForSelector('#alertClose')
        .then(async () => await page.click('#alertClose'))
        .catch(error => console.log(`promise error for closing alert modal: ${error}`))
    })
  })
})
