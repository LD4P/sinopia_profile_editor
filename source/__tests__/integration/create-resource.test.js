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

    it('appends a resource template section to the form', async () => {
      page
        .waitForSelector('span[id="0"] > span')
        .catch(error => console.log(`promise error for loading create page with import dialog: ${error}`))
      await expect_regex_in_sel_textContent('span[id="0"] > span', /^Resource Template\s*$/)
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
      page
        .waitForSelector('input#resourceURI.ng-invalid-url')
        .catch(error => console.log(`promise error checkURL: ${error}`))
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

      const phtml = await page.evaluate(() => document.querySelector('a.propertyLink').innerHTML);
      console.log(phtml)

      console.log("PropertyURI Invalid")
      page
          .waitForSelector('input#propertyURI.ng-invalid-url')
          .catch(error => console.log(`promise error checkPropertyURL: ${error}`))
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
    });

    const phtml = await page.evaluate(() => document.querySelector('a.propertyLink').innerHTML);
    console.log(phtml)

    console.log("PropertyURI Valid")
    page.waitFor(2000)
    page
        .waitForSelector('input#propertyURI.ng-valid-url')
        .catch(error => console.log(`promise error checkPropertyURL: ${error}`))
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
