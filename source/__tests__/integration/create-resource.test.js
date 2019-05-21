// Copyright 2018 Stanford University see Apache2.txt for license
const pupExpect = require('./jestPuppeteerHelper')

describe('Create profile resource template requirements', () => {

  beforeAll(async () => {
    await page.goto('http://localhost:8000/#/profile/create/')
    await page.waitForSelector('a#addResource')
    await page.click('a#addResource')
    return await page.waitForSelector('a.propertyLink')
  })

  describe('resource template form fields', () => {
    const rt_fields_table_sel = 'div[id="resourceTemplates_0"] div.panel-body > table'

    it('appends a resource template section to the form', async () => {
      expect.assertions(1)
      await page.waitForSelector('span[id="0"] > span')
      await pupExpect.expectSelTextContentToMatch('span[id="0"] > span', /^Resource Template\s*$/)
    })

    it('has five input fields for the resource template data', async () => {
      expect.assertions(1)
      const num_inputs = await page.$eval(rt_fields_table_sel, e => e.getElementsByTagName('input').length)
      expect(num_inputs).toBe(5)
    })

    describe('Required fields are indicated with asterisk', () => {
      it('ID', async () => {
        expect.assertions(1)
        await pupExpect.expectSelTextContentToBe(`${rt_fields_table_sel} label[for="id"]`, "ID*")
      })
      it('Resource URI', async () => {
        expect.assertions(1)
        await pupExpect.expectSelTextContentToBe(`${rt_fields_table_sel} label[for="resourceURI"]`, "Resource URI*")
      })
      it('Resource Label', async () => {
        expect.assertions(1)
        await pupExpect.expectSelTextContentToBe(`${rt_fields_table_sel} label[for="resourceLabel"]`, "Resource Label*")
      })
      it('Author', async () => {
        expect.assertions(1)
        await pupExpect.expectSelTextContentToBe(`${rt_fields_table_sel} label[for="rtAuthor"]`, "Author*")
      })
    })

    describe('Non-required fields have no asterisk', () => {
      it('Remark', async () => {
        expect.assertions(2)
        await pupExpect.expectSelTextContentNotToBe(`${rt_fields_table_sel} label[for="rtRemark"]`, "Guiding statement for the use of this resource*")
        await pupExpect.expectSelTextContentToBe(`${rt_fields_table_sel} label[for="rtRemark"]`, "Guiding statement for the use of this resource")
      })
    })
  })

  describe('exporting', () => {
    let exportButtonSel = 'span.pull-right.pushed-right > a.import-export'
    let alertBoxSel = '#alertBox > div > div > div.modal-body > p'

    it('errors without a property template', async () => {
      expect.assertions(3)
      await expect(page).toFillForm('form.sinopia-profile-form[name="profileForm"]', {
        // all the other required fields from profile and resource template
        id: "my:profile",
        description: "Profile description",
        author: "Me",
        title: "My profile",
        resourceId: "my:resource",
        resourceURI: "http://www.stanford.edu"
      })
      // wait for resourceURI check
      await page.waitFor(1000, {waitUntil: 'networkidle2'})
      const valid_url_class = await page.$('input[name="resourceURI"]', e => e.getAttribute('ng-valid-url'))
      expect(valid_url_class).toBeTruthy()

      await page.click(exportButtonSel)
      await page.waitForSelector(alertBoxSel)
      await pupExpect.expectSelTextContentToBe(alertBoxSel, "my:resource must have at least one property template")
    })

    describe('with property template', () => {
      beforeAll(async () => {
        await page.goto('http://127.0.0.1:8000/#/profile/create/')
        await page.waitForSelector('a#addResource')
        await page.click('a#addResource')
        await page.waitForSelector('a.propertyLink')
        await page.click('a.propertyLink')
        return await page.waitForSelector('span[href="#property_1"]')
      })

      afterEach(async() => {
        return await page.$eval('form[name="profileForm"]', e => e.reset())
      })

      it('requires Resource ID', async () => {
        expect.assertions(4)
        await page.waitForSelector('div[name="propertyForm"]')
        await expect(page).toFillForm('form[name="profileForm"]', {
          // all the other required fields from profile and resource template
          id: "my:profile",
          description: "Profile description",
          author: "Me",
          title: "My profile",
          resourceId: "",
          resourceURI: "http://www.stanford.edu",
          propertyURI: 'http://www.example.org',
          propertyLabel: 'propLabel'
        })
        // wait for resourceURI and propertyURI checks
        await page.waitFor(1000, {waitUntil: 'networkidle2'})
        let valid_url_class = await page.$('input[name="resourceURI"]', e => e.getAttribute('ng-valid-url'))
        expect(valid_url_class).toBeTruthy()
        valid_url_class = await page.$('input[name="propertyURI"]', e => e.getAttribute('ng-valid-url'))
        expect(valid_url_class).toBeTruthy()

        await page.click(exportButtonSel)
        await page.waitForSelector(alertBoxSel)
        await pupExpect.expectSelTextContentToBe(alertBoxSel, "Parts of the form are invalid")
      })

      it('requires Resource URI', async () => {
        expect.assertions(4)
        await expect(page).toFillForm('form[name="profileForm"]', {
          // all the other required fields from profile and resource template
          id: "my:profile",
          description: "Profile description",
          author: "Me",
          title: "My profile",
          resourceId: "my:resource",
          resourceURI: "not-a-uri",
          propertyURI: 'http://www.example.org',
          propertyLabel: 'propLabel'
        })
        // wait for propertyURI check
        await page.waitFor(1000, {waitUntil: 'networkidle2'})
        const valid_url_class = await page.$('input[name="propertyURI"]', e => e.getAttribute('ng-valid-url'))
        expect(valid_url_class).toBeTruthy()

        const invalid_url_class = await page.$('input[name="resourceURI"]', e => e.getAttribute('ng-invalid-url'))
        expect(invalid_url_class).toBeTruthy()

        await page.click(exportButtonSel)
        await page.waitForSelector(alertBoxSel)
        await pupExpect.expectSelTextContentToBe(alertBoxSel, "Parts of the form are invalid")
      })

      it('no alerts when all requirements are met', async () => {
        expect.assertions(5)
        await expect(page).toFillForm('form.sinopia-profile-form[name="profileForm"]', {
          // all the other required fields from profile and resource template
          id: "my:profile",
          description: "Profile description",
          author: "Me",
          title: "My profile",
          resourceId: "my:resource",
          resourceURI: "http://www.stanford.edu",
          propertyURI: 'http://www.example.org',
          propertyLabel: 'propLabel'
        })
        // wait for resourceURI and propertyURI checks
        await page.waitFor(1000, {waitUntil: 'networkidle2'})
        let valid_url_class = await page.$('input[name="resourceURI"]', e => e.getAttribute('ng-valid-url'))
        expect(valid_url_class).toBeTruthy()
        valid_url_class = await page.$('input[name="propertyURI"]', e => e.getAttribute('ng-valid-url'))
        expect(valid_url_class).toBeTruthy()

        await page.click(exportButtonSel)
        await page.waitForSelector('a[download="My profile.json"]', {visible: true})
        const data = await page.$eval('a[download="My profile.json"]', e => e.getAttribute('href'))
        const json = JSON.parse(decodeURIComponent(data.substr(data.indexOf(',') + 1)))
        expect(json['Profile']['id']).toBe('my:profile')
        expect(json['Profile']['resourceTemplates'][0]['resourceURI']).toBe('http://www.stanford.edu')
      })
    })
  })
})
