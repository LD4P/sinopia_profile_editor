describe('Validating the profile metadata', () => {

  beforeAll(async () => {
    await page.goto('http://localhost:8000/#/profile/create/')
  })

  describe('with the required profile metadata fields', () => {

    afterEach(async () => {
      page.$eval('form[name="profileForm"]', e => e.reset())
    })

    it.each`
      id              | description              | author  | title           | result
      ${''}           | ${'Profile description'} | ${'Me'} | ${'My Profile'} | ${'Parts of the form are invalid'}
      ${'my:profile'} | ${''}                    | ${'Me'} | ${'My Profile'} | ${'Parts of the form are invalid'}
      ${'my:profile'} | ${'Profile description'} | ${''}   | ${'My Profile'} | ${'Parts of the form are invalid'}
      ${'my:profile'} | ${'Profile description'} | ${'Me'} | ${''}           | ${'Parts of the form are invalid'}
    `('should show message $result if required form fields are missing', async({id, description, author, title, result}) => {
        var alert_box_header;
        await expect(page).toFillForm('form[name="profileForm"]', {
          id: id,
          description: description,
          author: author,
          title: title
        })
        await expect(page).toClick('a', { text: 'Export'})
        alert_box_header = await page.$eval('#alertBox > div > div > div.modal-body > p', e => e.textContent)
        await expect(alert_box_header).toEqual(result)
        await page.reload({waitUntil: 'networkidle2'});
    })
  })

  describe('with at least one resource template', () => {

    it('should return "Profile must have at least one resource template" when profile metadata is valid but there is no resource template', async () => {
      var alert_box_header;
      await expect(page).toFillForm('form[name="profileForm"]', {
        id: "my:profile",
        description: "Profile description",
        author: "Me",
        title: "My profile"
      })
      await expect(page).toClick('a', { text: 'Export'})
      alert_box_header = await page.$eval('#alertBox > div > div > div.modal-body > p', e => e.textContent)
      await expect(alert_box_header).toEqual("Profile must have at least one resource template")
    })
  })

});
