describe('Validating a resource template', () => {

  beforeAll(async () => {
    await page.goto('http://localhost:8000/#/profile/create/')
    await expect(page).toClick('a', { text: 'Add Resource Template'})
  })

  describe('with a resource template that has required form fields', () => {

    it('appends a resource template section to the form', async () => {
      expect(await page.$eval('span[id="0"] > span', e => e.textContent)).toMatch(/Resource Template/)
    })

    afterEach(async () => {
      await page.$eval('form[name="profileForm"]', e => e.reset())
    })

    it('should validate the presence of the Resource ID field ', async () => {
      await expect(page).toFillForm('form[name="profileForm"]', {
        id: "my:profile",
        description: "Profile description",
        author: "Me",
        title: "My profile",
        resourceId: "",
        resourceURI: "http://www.example.com"
      })
      await expect(page).toClick('a', { text: 'Export'})
      await expect_value_in_selector_textContent('#alertBox > div > div > div.modal-body > p', "Parts of the form are invalid")
    })

    it('should validate the presence of the Resource URI field ', async () => {
      await expect(page).toFillForm('form[name="profileForm"]', {
        id: "my:profile",
        description: "Profile description",
        author: "Me",
        title: "My profile",
        resourceId: "my:resource",
        resourceURI: ""
      })
      await expect(page).toClick('a', { text: 'Export'})
      await expect_value_in_selector_textContent('#alertBox > div > div > div.modal-body > p', "Parts of the form are invalid")
    })
  })

  describe('with at least one property template', () => {

    it('should return "my:resource must have at least one property template" when resource template is valid but there is no property template', async () => {
      await expect(page).toFillForm('form[name="profileForm"]', {
        id: "my:profile",
        description: "Profile description",
        author: "Me",
        title: "My profile",
        resourceId: "my:resource",
        resourceURI: "http://www.example.com"
      })
      await expect(page).toClick('a', { text: 'Export'})
      await expect_value_in_selector_textContent('#alertBox > div > div > div.modal-body > p', "my:resource must have at least one property template")
    })
  })

})

async function expect_value_in_selector_textContent(sel, value) {
  const sel_text = await page.$eval(sel, e => e.textContent)
  expect(sel_text).toBe(value)
}