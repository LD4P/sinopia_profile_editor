// Copyright 2018 Stanford University see Apache2.txt for license
const pupExpect = require('./jestPuppeteerHelper')

describe('PropertyTemplate requirements', () => {
  beforeAll(async () => {
    await page.goto('http://127.0.0.1:8000/#/profile/create/')
    await page.waitForSelector('a#addResource')
    await page.click('a#addResource')
    await page.waitForSelector('a.propertyLink')
    await page.click('a.propertyLink')
    return await page.waitForSelector('span[href="#property_1"]')
  })

  describe('adding a property template', () => {
    const propTemplateSelectSelector = 'select#templateSelect_1_0'
    const ptFieldsTableSel = 'div.panel[name="propertyForm"] table'

    beforeAll(async () => {
      await page.waitForSelector('span[href="#property_1"]')
      await page.waitForSelector('a#addTemplate')
      await page.click('a#addTemplate')
      return await page.waitForSelector(propTemplateSelectSelector)
    })

    it('clicking "Add Property Template" appends a property template section to the form', async () => {
      expect.assertions(1)
      await page.waitForSelector(ptFieldsTableSel)
      await expect(page).toMatchElement('i.fa-exclamation[id="error"]')
    })

    describe('property template form fields', () => {
      it('has 3 input fields for the property template metadata', async () => {
        expect.assertions(1)
        const inputs = await page.$eval(ptFieldsTableSel, e => e.getElementsByTagName('input').length)
        expect(inputs).toBe(3)
      })
      it('has 3 select fields for the property template metadata', async () => {
        expect.assertions(1)
        const selects = await page.$eval(ptFieldsTableSel, e => e.getElementsByTagName('select').length)
        expect(selects).toBe(3)
      })

      describe('Required fields are indicated with asterisk', () => {
        it('Property URI', async () => {
          expect.assertions(1)
          await pupExpect.expectSelTextContentToBe(`${ptFieldsTableSel} label[for="propertyURI"]`, "Property URI*")
        })
        it('Property Label', async () => {
          expect.assertions(1)
          await pupExpect.expectSelTextContentToBe(`${ptFieldsTableSel} label[for="propertyLabel"]`, "Property Label*")
        })
        it('Type', async () => {
          expect.assertions(1)
          await pupExpect.expectSelTextContentToBe(`${ptFieldsTableSel} label[for="type"]`, "Type*")
        })
      })

      describe('Non-required fields have no asterisk', () => {
        it('Remark', async () => {
          expect.assertions(2)
          await pupExpect.expectSelTextContentNotToBe(`${ptFieldsTableSel} label[for="remark"]`, "Guiding statement for the use of this property*")
          await pupExpect.expectSelTextContentToBe(`${ptFieldsTableSel} label[for="remark"]`, "Guiding statement for the use of this property")
        })
        it('Mandatory', async () => {
          expect.assertions(2)
          await pupExpect.expectSelTextContentNotToBe(`${ptFieldsTableSel} label[for="mandatory"]`, "Mandatory*")
          await pupExpect.expectSelTextContentToBe(`${ptFieldsTableSel} label[for="mandatory"]`, "Mandatory")
        })
        it('Repeatable', async () => {
          expect.assertions(2)
          await pupExpect.expectSelTextContentNotToBe(`${ptFieldsTableSel} label[for="repeatable"]`, "Repeatable*")
          await pupExpect.expectSelTextContentToBe(`${ptFieldsTableSel} label[for="repeatable"]`, "Repeatable")
        })
      })
    })

    describe('valueConstraints fields', () => {
      const vcFieldsTableSel = 'div[ng-controller="ValueConstraintController"]'

      describe('Value Constraint', () => {
        it('header', async () => {
          expect.assertions(1)
          await pupExpect.expectSelTextContentToBe(`${vcFieldsTableSel} > #constraintHeader`, "Value Constraint")
        })
        it('has no input fields', async () => {
          expect.assertions(1)
          const inputs = await page.$eval(`${vcFieldsTableSel} > table`, e => e.getElementsByTagName('input').length)
          expect(inputs).toBe(0)
        });
        it('has no select fields', async () => {
          expect.assertions(1)
          const selects = await page.$eval(`${vcFieldsTableSel} > table`, e => e.getElementsByTagName('select').length)
          expect(selects).toBe(0)
        })
        it('has Add Default Link', async () => {
          expect.assertions(1)
          await pupExpect.expectSelTextContentTrimmedToMatch(`${vcFieldsTableSel} > a#addDefault`, "Add Default")
        })
      })

      describe('Value Data Type', () => {
        const vdtTableSel = `${vcFieldsTableSel} div[ng-controller="ValueDataTypeController"]`

        it('header', async () => {
          expect.assertions(1)
          await expect(page).toMatch('Value Data Type')
        })
        it('has one input field', async () => {
          expect.assertions(1)
          const inputs = await page.$eval(vdtTableSel, e => e.getElementsByTagName('input').length)
          expect(inputs).toBe(1)
        })
        it('has URI field', async () => {
          expect.assertions(1)
          await pupExpect.expectSelTextContentToBe(`${vdtTableSel} label[for="dataTypeURI"]`, "URI")
        })
      })

      describe('Templates', () => {
        it('dropdown populated with resource template ids (via profiles from versoSpoof)', async () => {
          expect.assertions(1)
          await page.waitForSelector(propTemplateSelectSelector)
          const profile_count = await page.$eval(propTemplateSelectSelector, e => e.length)
          expect(profile_count).toBe(242)
        })
        it('dropdown allows selection of a resource template id', async () => {
          expect.assertions(4)
          await page.waitForSelector(propTemplateSelectSelector)
          // NOTE: the html always shows the first option selected, though the browser
          //  shows the right thing.  So here we cheat and use indirect checking of attributes
          //  to show a template can be selected
          await expect(page).toMatchElement(`${propTemplateSelectSelector}.ng-pristine`)
          await expect(page).toMatchElement(`${propTemplateSelectSelector} > option[selected="selected"][value="?"]`)
          await page.select(propTemplateSelectSelector, 'sinopia:resourceTemplate:bf2:Form')
          await expect(page).toMatchElement(`${propTemplateSelectSelector}.ng-dirty`)
          await expect(page).toMatchElement(`${propTemplateSelectSelector} > option[selected="selected"][value^="sinopia:resourceTemplate:bf2"]`)
        })
      })

      it('Values - has Add Value link', async () => {
        expect.assertions(1)
        await pupExpect.expectSelTextContentTrimmedToMatch(`${vcFieldsTableSel} > div#value > a#adValue`, "Add Value")
      })
    })
  })

  describe('property header appearence', () => {
    it('font-awesome icon class is present', async () => {
      expect.assertions(1)
      await expect(page).toMatchElement(`.fa-caret-right`)
    })
  })
})

describe('property URI and Label are required', () => {
  const profileFormSel = 'form[name="profileForm"]'
  const exportButtonSel = 'a.btn.import-export'
  const alertBoxSel = '#alertBox > div.modal-dialog > div.modal-content > div.modal-body > p#alert_text'

  afterEach(async () => {
    return await page.$eval(profileFormSel, e => e.reset())
  })

  it('error if exported without property URI', async () => {
    expect.assertions(3)
    await page.waitForSelector(profileFormSel)
    await expect(page).toFillForm(profileFormSel, {
      // all the other required fields from profile and resource template
      id: "my:profile",
      description: "Profile description",
      author: "Me",
      title: "My profile",
      resourceId: "my:resource",
      resourceURI: "http://www.example.com#after",
      propertyLabel: 'propLabel'
    })
    // wait for resourceURI check
    await page.waitFor(1000, {waitUntil: 'networkidle2'})
    const valid_url_class = await page.$('input[name="resourceURI"]', e => e.getAttribute('ng-valid-url'))
    expect(valid_url_class).toBeTruthy()

    await page.click(exportButtonSel)
    await pupExpect.expectSelTextContentToBe(alertBoxSel, 'Parts of the form are invalid')
  })

  it('error if exported without property Label', async () => {
    expect.assertions(3)
    await page.waitForSelector(profileFormSel)
    await expect(page).toFillForm(profileFormSel, {
      // all the other required fields from profile and resource template
      id: "my:profile",
      description: "Profile description",
      author: "Me",
      title: "My profile",
      resourceId: "my:resource",
      resourceURI: "http://www.example.com#after",
      propertyURI: "http://www.example.com#property"
    })
    // wait for resourceURI check
    const valid_url_class = await page.$('input[name="resourceURI"]', e => e.getAttribute('ng-valid-url'))
    expect(valid_url_class).toBeTruthy()

    await page.click(exportButtonSel)
    await pupExpect.expectSelTextContentToBe(alertBoxSel, 'Parts of the form are invalid')
  })

  it('error if exported with invalid property uri', async () => {
    expect.assertions(4)
    await expect(page).toFillForm('form.sinopia-profile-form[name="profileForm"]', {
      // all the other required fields from profile and resource template
      id: "my:profile",
      description: "Profile description",
      author: "Me",
      title: "My profile",
      resourceId: "my:resource",
      resourceURI: "http://www.stanford.edu",
      propertyURI: 'not-a-uri',
      propertyLabel: 'propLabel'
    })
    // wait for resourceURI and propertyURI checks
    await page.waitFor(1000, {waitUntil: 'networkidle2'})
    const valid_url_class = await page.$('input[name="resourceURI"]', e => e.getAttribute('ng-valid-url'))
    expect(valid_url_class).toBeTruthy()
    const invalid_url_class = await page.$('input[name="propertyURI"]', e => e.getAttribute('ng-invalid-url'))
    expect(invalid_url_class).toBeTruthy()

    await page.click(exportButtonSel)
    await page.waitForSelector(alertBoxSel)
    await pupExpect.expectSelTextContentToBe(alertBoxSel, "Parts of the form are invalid")
  })

  it('can be exported with valid property URI', async () => {
    expect.assertions(5)

    await expect(page).toFillForm(profileFormSel, {
      id: "my:profile",
      description: "Profile description",
      author: "Me",
      title: "My Profile",
      resourceId: "my:resource",
      resourceURI: "http://www.example.com#after",
      propertyURI: "http://www.example.org#foo"
    })
    // wait for resourceURI and propertyURI checks
    await page.waitFor(1000, {waitUntil: 'networkidle2'})
    let valid_url_class = await page.$('input[name="resourceURI"]', e => e.getAttribute('ng-valid-url'))
    expect(valid_url_class).toBeTruthy()
    valid_url_class = await page.$('input[name="propertyURI"]', e => e.getAttribute('ng-valid-url'))
    expect(valid_url_class).toBeTruthy()

    await page.click(exportButtonSel)
    await page.waitForSelector('a[download="My Profile.json"]')
    const data = await page.$eval('a[download="My Profile.json"]', e => e.getAttribute('href'))
    const json = JSON.parse(decodeURIComponent(data.substr(data.indexOf(',') + 1)))
    expect(json['Profile']['id']).toBe('my:profile')
    expect(json['Profile']['resourceTemplates'][0]['propertyTemplates'][0]['propertyURI']).toBe('http://www.example.org#foo')
  })
})

describe('choose propertyTemplate from menu', () => {
  beforeAll(async () => {
    await page.goto('http://127.0.0.1:8000/#/profile/create/')
    await page.waitForSelector('a#propertyChoose')
    return await page.click('a#propertyChoose')
  })

  it('selecting property populates property form', async () => {
    expect.assertions(3)
    await page.waitForSelector('select[name="chooseVocab"]')
    await expect(page).toSelect('select[name="chooseVocab"]', 'Bibframe 2.0')
    await expect(page).toSelect('#resourcePick', 'Absorbed by')
    await pupExpect.expectSelTextContentTrimmedToMatch('div.propertyItem span[href="#property_1"] > span', 'Absorbed by')
  })
})
