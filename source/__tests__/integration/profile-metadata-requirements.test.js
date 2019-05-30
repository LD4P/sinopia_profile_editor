// Copyright 2018 Stanford University see Apache2.txt for license
const pupExpect = require('./jestPuppeteerHelper')

describe('Validating the profile metadata', () => {

  beforeAll(async () => {
    return await page.goto('http://localhost:8000/#/profile/create/')
  })

  describe('missing required profile metadata fields', () => {
    afterEach(async () => {
      return await page.$eval('form[name="profileForm"]', e => e.reset())
    })

    it.each`
      id              | description              | author  | title
      ${''}           | ${'Profile description'} | ${'Me'} | ${'My Profile'}
      ${'my:profile'} | ${''}                    | ${'Me'} | ${'My Profile'}
      ${'my:profile'} | ${'Profile description'} | ${''}   | ${'My Profile'}
      ${'my:profile'} | ${'Profile description'} | ${'Me'} | ${''}
    `('alerts if required form fields are missing', async({id, description, author, title}) => {
        expect.assertions(3)
        await expect(page).toFillForm('form[name="profileForm"]', {
          id: id,
          description: description,
          author: author,
          title: title
        })
        await expect(page).toClick('a', { text: 'Export'})
        await pupExpect.expectSelTextContentToBe('#alertBox > div > div > div.modal-body > p', 'Parts of the form are invalid')
        await page.reload({waitUntil: 'networkidle2'});
    })
  })

  describe('requires at least one resource template', () => {
    it(`alerts with useful message when missing resource template with valid profile metadata`, async () => {
      expect.assertions(3)
      await expect(page).toFillForm('form[name="profileForm"]', {
        id: "my:profile",
        description: "Profile description",
        author: "Me",
        title: "My profile"
      })
      await expect(page).toClick('a', { text: 'Export'})
      const alertMsg = 'Profile must have at least one resource template'
      await pupExpect.expectSelTextContentToBe('#alertBox > div > div > div.modal-body > p', alertMsg)
    })
  })
})
