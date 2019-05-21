// Copyright 2018 Stanford University see Apache2.txt for license
const pupExpect = require('./jestPuppeteerHelper')

describe('Adding, editing and removing a new Profile', () => {
  const sourceInputSel = '#profile input[name="source"]'

  beforeAll(async () => {
    return await page.goto('http://localhost:8000/#/profile/create/')
  })

  it('displays a new profile span', async () => {
    expect.assertions(1)
    await page.waitForSelector('span[id="profileBanner"] > span')
    const span = await page.$eval('span[id="profileBanner"] > span', e => e.getAttribute('popover-title'))
    await expect(span).toMatch(/Profile ID: Undefined/)
  })

  describe('Profile fields', () => {
    const profile_fields_table_sel = 'div[id="profile"] > div.panel-body > table'

    beforeAll(async () => {
      return await page.waitForSelector(profile_fields_table_sel)
    })

    it('has eight input fields for the profile admin data', async () => {
      expect.assertions(1)
      const num_inputs = await page.$eval(profile_fields_table_sel, e => e.getElementsByTagName('input').length)
      expect(num_inputs).toBe(8)
    })

    describe('Required fields are indicated with asterisk', () => {
      it('ID', async () => {
        expect.assertions(1)
        await pupExpect.expectSelTextContentTrimmedToBe(`${profile_fields_table_sel} label[for="id"]`, "ID*")
      })
      it('Description', async () => {
        expect.assertions(1)
        await pupExpect.expectSelTextContentTrimmedToBe(`${profile_fields_table_sel} label[for="description"]`, "Description*")
      })
      it('Author', async () => {
        expect.assertions(1)
        await pupExpect.expectSelTextContentTrimmedToBe(`${profile_fields_table_sel} label[for="author"]`, "Author*")
      })
      it('Title', async () => {
        expect.assertions(1)
        await pupExpect.expectSelTextContentTrimmedToBe(`${profile_fields_table_sel} label[for="title"]`, "Title*")
      })
    })
    it('Date has no asterisk b/c it may be filled in automagically', async () => {
      expect.assertions(2)
      await pupExpect.expectSelTextContentNotToMatch(`${profile_fields_table_sel} label[for="date"]`, "Date*")
      await pupExpect.expectSelTextContentTrimmedToBe(`${profile_fields_table_sel} label[for="date"]`, "Date")
    })
    describe('Non-required fields have no asterisk', () => {
      it('Remark', async () => {
        expect.assertions(2)
        await pupExpect.expectSelTextContentNotToMatch(`${profile_fields_table_sel} label[for="remark"]`, "Remark*")
        await pupExpect.expectSelTextContentTrimmedToBe(`${profile_fields_table_sel} label[for="remark"]`, "Remark")
      })
      it('Adherence', async () => {
        expect.assertions(2)
        await pupExpect.expectSelTextContentNotToMatch(`${profile_fields_table_sel} label[for="adherence"]`, "Adherence*")
        await pupExpect.expectSelTextContentTrimmedToBe(`${profile_fields_table_sel} label[for="adherence"]`, "Adherence")
      })
      it('Source', async () => {
        expect.assertions(2)
        await pupExpect.expectSelTextContentNotToMatch(`${profile_fields_table_sel} label[for="source"]`, "Source*")
        await pupExpect.expectSelTextContentTrimmedToBe(`${profile_fields_table_sel} label[for="source"]`, "Source")
      })
    })
    describe('Adherence rules/standards that profile confirms with', () => {
      const adherence_input_sel = '#profile input[name="adherence"]'

      it('adherence input label and field', async () => {
        expect.assertions(2)
        await pupExpect.expectSelTextContentTrimmedToBe('#profile label[for="adherence"]', 'Adherence')
        const field = await page.$eval(adherence_input_sel, e => e.getAttribute('name'))
        await expect(field).toBe('adherence')
      })

      it('popover text', async () => {
        expect.assertions(1)
        const popover = await page.$eval(adherence_input_sel, e => e.getAttribute('popover'))
        await expect(popover).toBe('What rules this profile follows')
      })
    })
    describe('Source url', () => {
      it('source input label and field', async () => {
        expect.assertions(2)
        await pupExpect.expectSelTextContentTrimmedToBe('#profile label[for="source"]', 'Source')
        const input_name = await page.$eval(sourceInputSel, e => e.getAttribute('name'))
        await expect(input_name).toBe('source')
      })

      it('popover text', async () => {
        expect.assertions(1)
        const popover = await page.$eval(sourceInputSel, e => e.getAttribute('popover'))
        await expect(popover).toBe('Link to more information about profile')
      })

      it('validates with checkURL', async () => {
        expect.assertions(1)
        const ng_blur = await page.$eval(sourceInputSel, e => e.getAttribute('ng-blur'))
        await expect(ng_blur).toBe('checkURL()')
      })
    })
  })

  describe('Resource Template fields', () => {
    beforeAll(async () => {
      await page.waitForSelector('#addResource')
      await page.click('#addResource')
      return await page.waitForSelector('div[name="resourceForm"]')
    })

    it('displays a new resource template span', async () => {
      expect.assertions(2)
      const span_sel = 'div[name="resourceForm"] span[id="0"] > span'
      await page.waitForSelector(span_sel)
      const popover_title = await page.$eval(span_sel, e => e.getAttribute('popover-title'))
      expect(popover_title).toMatch(/Resource ID: Undefined/)
      const span_text = await page.$eval('div[name="resourceForm"] span[id="0"] > span', e => e.textContent)
      expect(span_text).toMatch(/Resource Template/)
    })
    it('has 5 attribute fields', async () => {
      expect.assertions(5)
      await expect(page).toMatch('ID*')
      await expect(page).toMatch('Resource Label*')
      await expect(page).toMatch('Resource URI*')
      await expect(page).toMatch('Author*')
      await expect(page).toMatch('Guiding statement for the use of this resource')
    })
    it('has 5 text input fields', async () => {
      expect.assertions(1)
      const num_inputs = await page.$eval('div[id="resource_0"] > div > table', e => e.getElementsByTagName('input').length)
      expect(num_inputs).toBe(5)
    })
    it('has "Add Property Template" link', async () => {
      expect.assertions(1)
      const text = await page.$eval('a.propertyLink', e => e.textContent)
      expect(text.trim()).toEqual('Add Property Template')
    })
  })

  describe('Property Template fields', () => {
    beforeAll(async () => {
      await page.waitForSelector('div[name="resourceForm"]')
      await page.waitForSelector('.propertyLink')
      await page.click('.propertyLink')
      return await page.waitForSelector('div[name="propertyForm"]')
    })

    it('has 6 top level attribute fields', async() => {
      expect.assertions(6)
      await expect(page).toMatch('Property URI*')
      await expect(page).toMatch('Type*')
      await expect(page).toMatch('Mandatory')
      await expect(page).toMatch('Property Label*')
      await expect(page).toMatch('Repeatable')
      await expect(page).toMatch('Guiding statement for the use of this property')
    })
    it('has 3 text input fields', async () => {
      expect.assertions(1)
      await page.waitForSelector('div[id="property_1"] > div > table')
      const num_inputs = await page.$eval('div[id="property_1"] > div > table', e => e.getElementsByTagName('input').length)
      expect(num_inputs).toBe(3)
    })
  })

  describe('editing', () => {
    it('add resource template by selecting existing resource template from server', async () => {
      expect.assertions(4)
      await expect(page).toClick('a#resourceChoose', {text: 'Select Resource'})
      const resourceChooseModalSel = 'div#chooseResource > div.modal-dialog > div.modal-content > div.modal-body'
      await page.waitForSelector(resourceChooseModalSel)
      const selectVocabSel = `${resourceChooseModalSel} > div#select_box_holder > select[name="chooseVocab"]`
      await expect(page).toSelect(selectVocabSel, 'Bibframe 2.0')
      const resourceSelectorSel = `${resourceChooseModalSel} > select#resourcePick`
      await expect(page).toSelect(resourceSelectorSel, 'Role')

      await pupExpect.expectSelTextContentToMatch('span[popover="URI: http://id.loc.gov/ontologies/bibframe/Role"]', 'Role')
    })

    it('removing resource template removes its span and input fields', async () => {
      expect.assertions(4)

      const deleteTargetSel = 'span[popover="URI: http://id.loc.gov/ontologies/bibframe/Role"]'
      await page.waitForSelector(deleteTargetSel)
      await pupExpect.expectSelTextContentToMatch(deleteTargetSel, 'Role')

      const deleteRoleSel = 'div[name="resourceForm"] div#resource_0 #deleteButton'
      await page.waitForSelector(deleteRoleSel, {visible: true})
      await page.waitFor(500) // shameless green: it needs more time here; can't tell why
      await expect(page).toClick(deleteRoleSel)

      const modalConfirmDeleteSel = 'div#deleteModal div.modal-body > button[ng-click="confirm();"]'
      await page.waitForSelector(modalConfirmDeleteSel, {visible: true})
      await expect(page).toClick(modalConfirmDeleteSel)

      await pupExpect.expectSelNotToExist(deleteTargetSel)
    })

    it('alerts with error if non-uri profile source is entered and user switches focus', async () => {
      expect.assertions(4)
      await page.goto('http://localhost:8000/#/profile/create/')
      await expect(page).toFill(sourceInputSel, 'nope')
      await expect(page).toClick('#profile input[name="description"]')
      const alertBoxSel = '#alertBox > div > div > div.modal-header > h3'
      await page.waitForSelector(alertBoxSel, {visible: true})
      await pupExpect.expectSelTextContentTrimmedToBe(alertBoxSel, 'Error!')
      await page.waitForSelector('#alertClose', {visible: true})
      await page.click('#alertClose')
      const invalid_url_class = await page.$(sourceInputSel, e => e.getAttribute('ng-invalid-url'))
      expect(invalid_url_class).toBeTruthy()
    })
  })
})
