describe('Validating a resource template', () => {

  beforeAll(async () => {
    await page.goto('http://localhost:8000/#/profile/create/')
    page
      .waitForSelector('a#addResource')
      .then(async () => await page.click('a#addResource'))
      .catch(error => console.log(`promise error for addResource link: ${error}`))
    await page.waitForSelector('a.propertyLink')
  })

  let exportButtonSel = 'span.pull-right.pushed-right > a.import-export'
  let alertBoxSel = '#alertBox > div > div > div.modal-body > p'

  describe('with a resource template that has required form fields', () => {

    it('appends a resource template section to the form', async () => {
      page
        .waitForSelector('span[id="0"] > span')
        .then(async () => {
          expect(await page.$eval('span[id="0"] > span', e => e.textContent)).toMatch(/Resource Template/)
        })
        .catch(error => console.log(`promise error for loading create page with import dialog: ${error}`))
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
      await page.click(exportButtonSel)
      page
        .waitForSelector(alertBoxSel)
        .then(async () => await expect_value_in_selector_textContent(alertBoxSel, "Parts of the form are invalid"))
        .catch(error => console.log(`promise error for alert box selector: ${error}`))
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
      await page.click(exportButtonSel)
      page
        .waitForSelector(alertBoxSel)
        .then(async () => await expect_value_in_selector_textContent(alertBoxSel, "Parts of the form are invalid"))
        .catch(error => console.log(`promise error for alert box selector: ${error}`))
    })
  })

  describe('with at least one property template', () => {

    it('should return "my:resource must have at least one property template" when resource template is valid but there is no property template', async () => {
      expect(page)
        .toFillForm('form[name="profileForm"]', {
            id: "my:profile",
            description: "Profile description",
            author: "Me",
            title: "My profile",
            resourceId: "my:resource",
            resourceURI: "http://www.example.com"
          })
        .then(async() => await page.click(exportButtonSel))
        .catch(error => console.log(`promise error for filling profile form: ${error}`))
      page
        .waitForSelector(alertBoxSel)
        .then(async () => await expect_value_in_selector_textContent(alertBoxSel, "my:resource must have at least one property template"))
        .catch(error => console.log(`promise error for alert box selector: ${error}`))
    })
  })
})

async function expect_value_in_selector_textContent(sel, value) {
  const sel_text = await page.$eval(sel, e => e.textContent)
  expect(sel_text).toBe(value)
}
