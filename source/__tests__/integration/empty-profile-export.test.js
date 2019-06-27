// Copyright 2018 Stanford University see Apache2.txt for license

describe('Sinopia Profile Editor does not export an invalid Profile', () => {

  beforeAll(async () => {
    await page.goto('http://localhost:8000/#/profile/create/true')
  })

  describe('invalid profile exported', () => {
    it('displays alert modal with error message', async () => {
      expect.assertions(3)
      let sel_text = await page.$eval('#alert_text', e => e.textContent)
      expect(sel_text).toBeFalsy() // empty before we export
      await expect(page).toClick('a', { text: 'Export'})
      await page.waitForSelector('#alert_text', {visible: true})
      sel_text = await page.$eval('#alert_text', e => e.textContent)
      expect(sel_text).toMatch('Parts of the form are invalid')
    })
  })
})
