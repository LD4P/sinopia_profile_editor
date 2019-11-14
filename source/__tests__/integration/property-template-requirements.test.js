// Copyright 2018 Stanford University see Apache2.txt for license
const pupExpect = require('./jestPuppeteerHelper')

describe('PropertyTemplate requirements', () => {
  beforeAll(async () => {
    await page.goto('http://127.0.0.1:8000/#/profile/create/')
    await page.waitForSelector('a#addResource')
    await page.click('a#addResource')
    await page.waitForSelector('a.propertyLink')
    await page.click('a.propertyLink')
    await page.waitForSelector('span[href="#property_1"]')
  })

  describe('adding a property template', () => {
    const ptFieldsTableSel = 'div.panel[name="propertyForm"] table'

    beforeAll(async () => {
      await page.waitForSelector('span[href="#property_1"]')
      await page.waitForSelector('a#addTemplate')
      await page.click('a#addTemplate')
      await page.waitForSelector(ptFieldsTableSel)
    })

    test('clicking "Add Property Template" appends a property template section to the form', async () => {
      expect.assertions(1)
      await page.waitForSelector(ptFieldsTableSel)
      await expect(page).toMatchElement('i.fa-exclamation[id="error"]')
    })

    describe('property template form fields', () => {
      test('has 3 input fields for the property template metadata', async () => {
        expect.assertions(1)
        const inputs = await page.$eval(ptFieldsTableSel, e => e.getElementsByTagName('input').length)
        expect(inputs).toBe(3)
      })
      test('has 3 select fields for the property template metadata', async () => {
        expect.assertions(1)
        const selects = await page.$eval(ptFieldsTableSel, e => e.getElementsByTagName('select').length)
        expect(selects).toBe(3)
      })

      describe('Required fields are indicated with asterisk', () => {
        test('Property URI', async () => {
          expect.assertions(1)
          await pupExpect.expectSelTextContentToBe(`${ptFieldsTableSel} label[for="propertyURI"]`, "Property URI*")
        })
        test('Property Label', async () => {
          expect.assertions(1)
          await pupExpect.expectSelTextContentToBe(`${ptFieldsTableSel} label[for="propertyLabel"]`, "Property Label*")
        })
        test('Type', async () => {
          expect.assertions(1)
          await pupExpect.expectSelTextContentToBe(`${ptFieldsTableSel} label[for="type"]`, "Type*")
        })
      })

      describe('Non-required fields have no asterisk', () => {
        test('Remark', async () => {
          expect.assertions(2)
          await pupExpect.expectSelTextContentNotToBe(`${ptFieldsTableSel} label[for="remark"]`, "Guiding statement for the use of this property*")
          await pupExpect.expectSelTextContentToBe(`${ptFieldsTableSel} label[for="remark"]`, "Guiding statement for the use of this property")
        })
        test('Mandatory', async () => {
          expect.assertions(2)
          await pupExpect.expectSelTextContentNotToBe(`${ptFieldsTableSel} label[for="mandatory"]`, "Mandatory*")
          await pupExpect.expectSelTextContentToBe(`${ptFieldsTableSel} label[for="mandatory"]`, "Mandatory")
        })
        test('Repeatable', async () => {
          expect.assertions(2)
          await pupExpect.expectSelTextContentNotToBe(`${ptFieldsTableSel} label[for="repeatable"]`, "Repeatable*")
          await pupExpect.expectSelTextContentToBe(`${ptFieldsTableSel} label[for="repeatable"]`, "Repeatable")
        })
      })
    })

    describe('valueConstraints fields', () => {
      const vcFieldsTableSel = 'div[ng-controller="ValueConstraintController"]'

      describe('Value Constraint', () => {
        test('header', async () => {
          expect.assertions(1)
          await pupExpect.expectSelTextContentToBe(`${vcFieldsTableSel} > #constraintHeader`, "Value Constraint")
        })
        test('has no input fields', async () => {
          expect.assertions(1)
          const inputs = await page.$eval(`${vcFieldsTableSel} > table`, e => e.getElementsByTagName('input').length)
          expect(inputs).toBe(0)
        });
        test('has no select fields', async () => {
          expect.assertions(1)
          const selects = await page.$eval(`${vcFieldsTableSel} > table`, e => e.getElementsByTagName('select').length)
          expect(selects).toBe(0)
        })
        test('has Add Default Link', async () => {
          expect.assertions(1)
          await pupExpect.expectSelTextContentTrimmedToMatch(`${vcFieldsTableSel} > a#addDefault`, "Add Default")
        })
      })

      describe('Value Data Type', () => {
        const vdtTableSel = `${vcFieldsTableSel} div#valueDataType`

        test('header', async () => {
          expect.assertions(1)
          await expect(page).toMatch('Value Data Type')
        })

        test('has no input fields', async () => {
          expect.assertions(1)
          const inputs = await page.$eval(vdtTableSel, e => e.getElementsByTagName('input').length)
          expect(inputs).toBe(0)
        });

        test('has Add Value Data Type Link', async () => {
          expect.assertions(1)
          await pupExpect.expectSelTextContentTrimmedToMatch(`${vdtTableSel} > a#addValueDataType`, "Add Value Data Type")
        })
      })

      describe('Adding a Value Data Type field', () => {
        beforeAll(async() => {
          await page.waitForSelector('a#addValueDataType')
          await page.click('a#addValueDataType')
        })

        test('label for Value Data Type', async() => {
          expect.assertions(1)
          await pupExpect.expectSelTextContentToMatch('label[for="dataTypeURI"]', 'URI')
        })

        test('input field for Value Data Type', async() => {
          expect.assertions(1)
          expect(!!(await page.$('input[name="dataTypeURI"]'))).toBeTruthy()
        })

        test('delete icon for Value Data Type', async() => {
          expect.assertions(1)
          expect(!!(await page.$('a > i.fa-trash-o'))).toBeTruthy()
        })

        test('Select Data Type chooser link', async() => {
          expect.assertions(2)
          const sel = 'a#datatypeChoose'
          expect(!!(await page.$(`${sel}  > i.fa-bars`))).toBeTruthy()
          await pupExpect.expectSelTextContentTrimmedToBe(sel, 'Select Data Type')
        })
      })

      describe('Removing a Value Data Type field', () => {
        beforeAll(async() => {
          await page.waitForSelector('a#valueDataTypeDelete')
          await page.click('a#valueDataTypeDelete')
        })

        test('remove Value Data Type', async() => {
          expect.assertions(2)
          const modalConfirmDeleteSel = 'div#deleteModal div.modal-body > button[ng-click="confirm();"]'
          await page.waitForSelector(modalConfirmDeleteSel, {visible: true})
          await page.waitFor(500) // shameless green: it needs more time here; can't tell why
          await expect(page).toClick(modalConfirmDeleteSel)
          await pupExpect.expectSelNotToExist('input[name="dataTypeURI"]')
        })
      })

      describe('Templates (ValueTemplateRefs)', () => {
        const valTempRefTemplatesSel = 'div.panel[name="propertyForm"] #template.propertyItems'
        const valTempRefDivSel = `${valTempRefTemplatesSel} > div.listItems[html="html/template.html"] > div > div`
        const valTempRefInputSel = `${valTempRefDivSel} > input[id^="templateInput_"]`

        test('heading is "Templates"', async() => {
          expect.assertions(1)
          await pupExpect.expectSelTextContentToBe(`${valTempRefTemplatesSel} > h5`, "Templates")
        })

        test('label of Template', async () => {
          expect.assertions(1)
          await pupExpect.expectSelTextContentToBe(`${valTempRefDivSel} > label[for="template"]`, "Template")
        })

        test('input field is text box', async () => {
          expect.assertions(1)
          await expect(page).toMatchElement(`${valTempRefInputSel}[type="text"]`)
        })

        test('popover-title', async () => {
          expect.assertions(1)
          await expect(page).toMatchElement(`${valTempRefInputSel}[popover-title="ID of Resource Template to embed"]`)
        })
        test('popover', async () => {
          expect.assertions(1)
          await expect(page).toMatchElement(`${valTempRefInputSel}[popover="For use with type = resource. Enter the ID of the Resource Template that will be the object of this property."]`)
        })

        // NOTE: these tests might be better put in import-profile (see github #222)
        test.todo('on import - ensure existing valueTemplateRef shows up in UI')
        test.todo('on import - ensure multiple existing valueTemplateRef all show up in UI')
        // NOTE: these tests might be better put in export-profile (see github #222)
        test.todo('on export - ensure correct value is in rt in correct way')
        test.todo('on export - ensure multiple values can be put in rt')
      })

      test('Values - has Add Value link', async () => {
        expect.assertions(1)
        await pupExpect.expectSelTextContentTrimmedToMatch(`${vcFieldsTableSel} > div#value > a#adValue`, "Add Value")
      })
    })
  })

  describe('property header appearence', () => {
    test('font-awesome icon class is present', async () => {
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
    await page.$eval(profileFormSel, e => e.reset())
  })

  test('error if exported without property URI', async () => {
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

  test('error if exported without property Label', async () => {
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

  test('error if exported with invalid property uri', async () => {
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

  test('can be exported with valid property URI', async () => {
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
    await page.click('a#propertyChoose')
  })

  test('selecting property populates property form', async () => {
    expect.assertions(3)
    await page.waitForSelector('select[name="chooseVocab"]')
    await expect(page).toSelect('select[name="chooseVocab"]', 'Bibframe 2.0')
    await expect(page).toSelect('#resourcePick', 'Absorbed by')
    await pupExpect.expectSelTextContentTrimmedToMatch('div.propertyItem span[href="#property_1"] > span', 'Absorbed by')
  })
})
