// Copyright 2018 Stanford University see Apache2.txt for license

describe('Create profile resource template requirements', () => {

  beforeAll(async () => {
    await page.goto('http://localhost:8000/#/profile/create/')
    page
      .waitForSelector('a#addResource')
      .then(async () => await page.click('a#addResource'))
      .catch(error => console.log(`promise error for addResource link: ${error}`))
    await page.waitForSelector('a.propertyLink')
  })

  afterEach(async () => {
    page.waitFor(2000)
    await page.$eval('form[name="profileForm"]', e => e.reset())
  })

  let exportButtonSel = 'span.pull-right.pushed-right > a.import-export'
  let alertBoxSel = '#alertBox > div > div > div.modal-body > p'

  describe('resource template form fields', () => {
    const rt_fields_table_sel = 'div[id="resourceTemplates_0"] div.panel-body > table'

    it('appends a resource template section to the form', async () => {
      page.waitForSelector('span[id="0"] > span')
        .catch(error => console.log(`promise error for loading create page with import dialog: ${error}`))
      await expect_regex_in_sel_textContent('span[id="0"] > span', /^Resource Template\s*$/)
    })

    it('has five input fields for the resource template data', async () => {
      const inputs = await page.$eval(rt_fields_table_sel, e => e.getElementsByTagName('input').length)
      expect(inputs).toBe(5)
    })

    describe('Required fields are indicated with asterisk', async () => {
      it('ID', async () => {
        await expect_value_in_sel_textContent(`${rt_fields_table_sel} label[for="id"]`, "ID*")
      })
      it('Resource URI', async () => {
        await expect_value_in_sel_textContent(`${rt_fields_table_sel} label[for="resourceURI"]`, "Resource URI*")
      })
      it('Resource Label', async () => {
        await expect_value_in_sel_textContent(`${rt_fields_table_sel} label[for="resourceLabel"]`, "Resource Label*")
      })
      it('Author', async () => {
        await expect_value_in_sel_textContent(`${rt_fields_table_sel} label[for="rtAuthor"]`, "Author*")
      })
    })

    describe('Non-required fields have no asterisk', async () => {
      it('Remark', async () => {
        await expect_value_not_in_sel_textContent(`${rt_fields_table_sel} label[for="rtRemark"]`, "Guiding statement for the use of this resource*")
        await expect_value_in_sel_textContent(`${rt_fields_table_sel} label[for="rtRemark"]`, "Guiding statement for the use of this resource")
      })
    })

    it('requires Resource ID', async () => {
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
        .catch(error => console.log(`promise error for alert box selector: ${error}`))
      await expect_value_in_sel_textContent(alertBoxSel, "Parts of the form are invalid")
    })

    it('requires Resource URI', async () => {
      await expect(page).toFillForm('form[name="profileForm"]', {
        id: "my:profile",
        description: "Profile description",
        author: "Me",
        title: "My profile",
        resourceId: "my:resource",
        resourceURI: "htt",
      }).catch(error => console.log(`promise error for filling profile form: ${error}`));
      await page.waitFor(1000)
      const invalid_url_class = page.$('input#resourceURI', e => e.getAttribute('ng-invalid-url'))
      expect(invalid_url_class).toBeDefined()

      await page.click(exportButtonSel)
      page
        .waitForSelector(alertBoxSel)
        .catch(error => console.log(`promise error for alert box selector: ${error}`))
      await expect_value_in_sel_textContent(alertBoxSel, "Parts of the form are invalid")
    })

    it('requires a property template', async () => {
      expect(page)
        .toFillForm('form.sinopia-profile-form[name="profileForm"]', {
          // all the other required fields from resource template
          id: "my:profile",
          description: "Profile description",
          author: "Me",
          title: "My profile",
          resourceId: "my:resource",
          resourceURI: "http://id.loc.gov"
        })
        .catch(error => console.log(`promise error for filling profile form: ${error}`))
      await page.waitFor(1000) // waiting for .toFillForm(), as resourceURI field does a check
      page
        .waitForSelector('input#resourceURI.ng-valid-url')
        .catch(error => console.log(`promise error checkURL: ${error}`))
      await page.click(exportButtonSel)
      page
        .waitForSelector(alertBoxSel)
        .catch(error => console.log(`promise error for alert box selector: ${error}`))
      await expect_value_in_sel_textContent(alertBoxSel, "my:resource must have at least one property template")
    })



    // TODO:   I think the below belongs in create-property.test, if it isn't already there
    it('requires a valid property uri', async () => {
      expect(page)
        .toFillForm('form.sinopia-profile-form[name="profileForm"]', {
          // all the other required fields from resource template
          id: "my:profile",
          description: "Profile description",
          author: "Me",
          title: "My profile",
          resourceId: "my:resource",
          resourceURI: "http://id.loc.gov"
        })
        .catch(error => console.log(`promise error for filling profile form: ${error}`))

      await page.click('a.propertyLink')
      await page.waitFor(1000)
      await page.evaluate(() => {
        let dom = document.querySelector('a.propertyLink');
        dom.innerHTML = "h";
      });
      await expect_value_in_sel_textContent('a.propertyLink', 'h')
      await page.waitFor(2000)
      const invalid_url_class = await page.$('input#propertyURI', e => e.getAttribute('ng-invalid-url'))
      expect(invalid_url_class).toBeDefined()
    })

    it('valid property uri', async () => {
      expect(page)
        .toFillForm('form.sinopia-profile-form[name="profileForm"]', {
          // all the other required fields from resource template
          id: "my:profile",
          description: "Profile description",
          author: "Me",
          title: "My profile",
          resourceId: "my:resource",
          resourceURI: "http://id.loc.gov"
        })
        .catch(error => console.log(`promise error for filling profile form: ${error}`))

      await page.click('a.propertyLink')

      await page.evaluate(() => {
        let dom = document.querySelector('a.propertyLink');
        dom.innerHTML = "http://id.loc.gov/ontologies/bibframe/code";
      })

      page.waitFor(2000)
      const valid_url_class = page.$('input#propertyURI', e => e.getAttribute('ng-valid-url'))
      expect(valid_url_class).toBeDefined()
    })
  })
})

async function expect_regex_in_sel_textContent(sel, value) {
  const sel_text = await page.$eval(sel, e => e.textContent)
  expect(sel_text).toMatch(value)
}
async function expect_value_in_sel_textContent(sel, value) {
  const sel_text = await page.$eval(sel, e => e.textContent)
  expect(sel_text).toBe(value)
}
async function expect_value_not_in_sel_textContent(sel, value) {
  const sel_text = await page.$eval(sel, e => e.textContent)
  expect(sel_text.trim()).not.toBe(value)
}
