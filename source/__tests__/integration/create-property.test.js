// Copyright 2018 Stanford University see Apache2.txt for license

describe('Create profile property template requirements', () => {
  beforeAll(async () => {
    await page.goto('http://127.0.0.1:8000/#/profile/create/')
    page
      .waitForSelector('a#addResource')
      .then(async () => await page.click('a#addResource'))
      .catch(error => console.log(`promise error for addResource link: ${error}`))
    page
      .waitForSelector('a.propertyLink')
      .then(async () => await page.click('a.propertyLink'))
      .catch(error => console.log(`promise error for add property link: ${error}`))
    await page.waitForSelector('span[href="#property_1"]')
  })


  describe('adding a property template', () => {
    let propTemplateSelectSelector = 'select#templateSelect_1_0'
    let ptFieldsTableSel = 'div.panel[name="propertyForm"] table'
    beforeAll(async () => {
      await page.waitForSelector('span[href="#property_1"]')
      page
        .waitForSelector('a#addTemplate')
        .then(async () => await page.click('a#addTemplate'))
        .catch(error => console.log(`promise error for add template link: ${error}`))
      await page.waitForSelector(propTemplateSelectSelector)
    })

    it('appends a property template section to the form', async () => {
      expect.assertions(1)
      page.waitForSelector(ptFieldsTableSel)
        .catch(error => console.log(`promise error loading property form: ${error}`))
      await expect_sel_to_exist('i.fa-exclamation[id="error"]')
    })

    describe('property template form fields', () => {

      it('has 3 input fields for the property template metadata', async () => {
        const inputs = await page.$eval(ptFieldsTableSel, e => e.getElementsByTagName('input').length)
        expect(inputs).toBe(3)
      })

      it('has 3 select fields for the property template metadata', async () => {
        const selects = await page.$eval(ptFieldsTableSel, e => e.getElementsByTagName('select').length)
        expect(selects).toBe(3)
      })

      describe('Required fields are indicated with asterisk', async () => {
        it('Property URI', async () => {
          await expect_value_in_sel_text(`${ptFieldsTableSel} label[for="propertyURI"]`, "Property URI*")
        })
        it('Property Label', async () => {
          await expect_value_in_sel_text(`${ptFieldsTableSel} label[for="propertyLabel"]`, "Property Label*")
        })
        it('Type', async () => {
          await expect_value_in_sel_text(`${ptFieldsTableSel} label[for="type"]`, "Type*")
        })
      })

      describe('Non-required fields have no asterisk', async () => {
        it('Remark', async () => {
          await expect_value_not_in_sel_text(`${ptFieldsTableSel} label[for="remark"]`, "Guiding statement for the use of this property*")
          await expect_value_in_sel_text(`${ptFieldsTableSel} label[for="remark"]`, "Guiding statement for the use of this property")
        })
      })
    })

    describe('valueConstraints fields', () => {
      let vcFieldsTableSel = 'div[ng-controller="ValueConstraintController"]'

      describe('Value Constraints', () => {
        it('header', async () => {
          await expect_value_in_sel_text(`${vcFieldsTableSel} > #constraintHeader`, "Value Constraint")
        })
        it('has no input fields', async () => {
          const inputs = await page.$eval(`${vcFieldsTableSel} > table`, e => e.getElementsByTagName('input').length)
          expect(inputs).toBe(0)
        });
        it('has no select fields', async () => {
          const selects = await page.$eval(`${vcFieldsTableSel} > table`, e => e.getElementsByTagName('select').length)
          expect(selects).toBe(0)
        })
        it('has Add Default Link', async () => {
          await expect_value_in_sel_text(`${vcFieldsTableSel} > a#addDefault`, "Add Default")
        })
      })


      describe('Value Data Type', () => {
        let vdtTableSel = `${vcFieldsTableSel} div[ng-controller="ValueDataTypeController"]`
        it('header', async () => {
          await expect(page).toMatch('Value Data Type')
        })
        it('has one input field', async () => {
          const inputs = await page.$eval(vdtTableSel, e => e.getElementsByTagName('input').length)
          expect(inputs).toBe(1)
        })
        it('has URI field', async () => {
          await expect_value_in_sel_text(`${vdtTableSel} label[for="dataTypeURI"]`, "URI")
        })
      })

      describe('Templates dropdown', () => {
        it('populated with resource template ids (via profiles from versoSpoof)', async () => {
          await page.waitForSelector(propTemplateSelectSelector)
          const profile_count = await page.$eval(propTemplateSelectSelector, e => e.length)
          expect(profile_count).toBe(242)
        })
        it('allows selection of a resource template id', async () => {
          await page.waitForSelector(propTemplateSelectSelector)
          // NOTE: the html always shows the first option selected, though the browser
          //  shows the right thing.  So here we cheat and use indirect checking of attributes
          //  to show a template can be selected
          await expect_sel_to_exist(`${propTemplateSelectSelector}.ng-pristine`)
          await expect_sel_to_exist(`${propTemplateSelectSelector} > option[selected="selected"][value="?"]`)
          await page.select(propTemplateSelectSelector, 'sinopia:resourceTemplate:bf2:Form')
          await expect_sel_to_exist(`${propTemplateSelectSelector}.ng-dirty`)
          await expect_sel_to_exist(`${propTemplateSelectSelector} > option[selected="selected"][value^="sinopia:resourceTemplate:bf2"]`)
        })
      })

      describe('has Add Value link', async () => {
        await expect_value_in_sel_text(`${vcFieldsTableSel} > a#adValue`, "Add Value")
      })
    })
  })

  describe('property header appearence', () => {
    it('font-awesome icon class is present', async () => {
      await expect_sel_to_exist(`.fa-caret-right`)
    })
  })
})

describe('property URI is required', () => {
  let profileFormSel = 'form[name="profileForm"]'
  let exportButtonSel = 'a.btn.import-export'

  it('error if exported without property URI', async () => {
    await page.waitForSelector(profileFormSel)
    await expect(page).toFillForm(profileFormSel, {
      id: "my:profile",
      description: "Profile description",
      author: "Me",
      title: "My profile",
      resourceId: "my:resource",
      resourceURI: "http://www.example.com#after"
    }, 10000)

    await page.click(exportButtonSel)
    let alertBoxSel = '#alertBox > div.modal-dialog > div.modal-content > div.modal-body > p#alert_text'
    await expect_value_in_sel_text(alertBoxSel, 'Parts of the form are invalid')
  })

  it('can be exported with property URI', async () => {
    expect.assertions(3) // avoid false positives when promise fails
    await page.waitFor(1000, {waitUntil: 'networkidle2'})
    await page.$eval(profileFormSel, e => e.reset())

    await expect(page).toFillForm(profileFormSel, {
      id: "my:profile",
      description: "Profile description",
      author: "Me",
      title: "My Profile",
      resourceId: "my:resource",
      resourceURI: "http://www.example.com#after",
      propertyURI: "http://www.example.org#foo"
    }, 10000)

    await page.waitFor(1000, {waitUntil: 'networkidle2'})
    page.click(exportButtonSel)
      // .then(async () => { console.log('Export button clicked') })
      .catch(e => console.log(`failed promise on clicking the Export button: ${e}`))

    await page.waitForSelector('a[download="My Profile.json"]')

    let data
    page
      .waitForSelector('a[download="My Profile.json"]')
      .then(
          data = await page.$eval('a[download="My Profile.json"]', e => e.getAttribute('href'))
        )
      .catch(e => console.log(`failed promise on download data link: ${e}`))

    const json = JSON.parse(decodeURIComponent(data.substr(data.indexOf(',') + 1)))
    expect(json['Profile']['id']).toBe('my:profile')
    expect(json['Profile']['resourceTemplates'][0]['propertyTemplates'][0]['propertyURI']).toBe('http://www.example.org#foo')
  })
})

describe('choose template from menu', () => {

  //let property_select_sel = '#resourcePick > option[value^="0"]'
  let property_select_sel = '#resourcePick > option:nth-child(1)'
  let option_select_sel = '#select_box_holder > select > option:nth-child(2)'

  beforeAll(async () => {
    await page.goto('http://127.0.0.1:8000/#/profile/create/')
    page
      .waitForSelector('a#addResource')
      .then(async () => await page.click('a#addResource'))
      .catch(error => console.log(`promise error for addResource link: ${error}`))
    page
      .waitForSelector('a.propertyLink')
      .then(async () => await page.click('a.propertyLink'))
      .catch(error => console.log(`promise error for add property link: ${error}`))
    page
      .waitForSelector('a#propertyChoose')
      .then(async () => await page.click('a#propertyChoose'))
      .catch(error => console.log(`promise error for select resource link: ${error}`))
    page
      .waitForSelector(option_select_sel)
      .then(async () => await page.click(option_select_sel))
      .catch(error => console.log(`promise error for select resource link: ${error}`))
    await page.waitFor(1000)
  })

  // FIXME:  this test gives a false positive -- try changing the string below ...
  it('First property is Absorbed by', async () => {
    page
      .waitForSelector(property_select_sel)
      .then(async () => await expect_value_in_sel_text(property_select_sel, 'FIXME I am broken Absorbed by'))
  })
})

async function expect_sel_to_exist(sel) {
  const sel_text = !!(await page.$(sel))
  expect(sel_text).toEqual(true)
}
async function expect_value_in_sel_text(sel, value) {
  const sel_text = await page.$eval(sel, e => e.textContent)
  expect(sel_text.trim()).toBe(value)
}
async function expect_value_not_in_sel_text(sel, value) {
  const sel_text = await page.$eval(sel, e => e.textContent)
  expect(sel_text.trim()).not.toBe(value)
}
