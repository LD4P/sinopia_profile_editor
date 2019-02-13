// Copyright 2018 Stanford University see Apache2.txt for license

describe('Adding and removing a new Profile', () => {
  const source_input_sel = '#profile input[name="source"]'

  beforeAll(async () => {
    await page.goto('http://localhost:8000/#/profile/create/')
  })

  it('displays a new profile span', async () => {
    const span = await page.$eval('span[id="profileBanner"] > span', e => e.getAttribute('popover-title'))
    await expect(span).toMatch(/Profile ID: Undefined/)
  })

  describe('Profile fields', () => {
    const profile_fields_table_sel = 'div[id="profile"] > div.panel-body > table'

    beforeAll(async () => {
      await page.waitForSelector(profile_fields_table_sel)
    })

    it('has eight input fields for the profile admin data', async () => {
      const inputs = await page.$eval(profile_fields_table_sel, e => e.getElementsByTagName('input').length)
      expect(inputs).toBe(8)
    })

    describe('Required fields are indicated with asterisk', async () => {
      it('ID', async () => {
        await expect_value_in_selector_textContent(`${profile_fields_table_sel} label[for="id"]`, "ID*")
      })
      it('Description', async () => {
        await expect_value_in_selector_textContent(`${profile_fields_table_sel} label[for="description"]`, "Description*")
      })
      it('Author', async () => {
        await expect_value_in_selector_textContent(`${profile_fields_table_sel} label[for="author"]`, "Author*")
      })
      it('Title', async () => {
        await expect_value_in_selector_textContent(`${profile_fields_table_sel} label[for="title"]`, "Title*")
      })
    })
    it('Date has no asterisk b/c it may be filled in automagically', async () => {
      await expect_value_not_in_selector_textContent(`${profile_fields_table_sel} label[for="date"]`, "Date*")
      await expect_value_in_selector_textContent(`${profile_fields_table_sel} label[for="date"]`, "Date")
    })
    describe('Non-required fields have no asterisk', async () => {
      it('Remark', async () => {
        await expect_value_not_in_selector_textContent(`${profile_fields_table_sel} label[for="remark"]`, "Remark*")
        await expect_value_in_selector_textContent(`${profile_fields_table_sel} label[for="remark"]`, "Remark")
      })
      it('Adherence', async () => {
        await expect_value_not_in_selector_textContent(`${profile_fields_table_sel} label[for="adherence"]`, "Adherence*")
        await expect_value_in_selector_textContent(`${profile_fields_table_sel} label[for="adherence"]`, "Adherence")
      })
      it('Source', async () => {
        await expect_value_not_in_selector_textContent(`${profile_fields_table_sel} label[for="source"]`, "Source*")
        await expect_value_in_selector_textContent(`${profile_fields_table_sel} label[for="source"]`, "Source")
      })
    })
  })

  describe('Adherence rules/standards that profile confirms with', () => {

    const adherence_input_sel = '#profile input[name="adherence"]'

    it('adherence input label and field', async () => {
      await expect_value_in_selector_textContent('#profile label[for="adherence"]', 'Adherence')
      const field = await page.$eval(adherence_input_sel, e => e.getAttribute('name'))
      await expect(field).toBe('adherence')
    })

    it('popover text', async () => {
      const popover = await page.$eval(adherence_input_sel, e => e.getAttribute('popover'))
      await expect(popover).toBe('What rules this profile follows')
    })
  })

  describe('Source url', () => {

    it('source input label and field', async () => {
      await expect_value_in_selector_textContent('#profile label[for="source"]', 'Source')
      const input_name = await page.$eval(source_input_sel, e => e.getAttribute('name'))
      await expect(input_name).toBe('source')
    })

    it('popover text', async () => {
      const popover = await page.$eval(source_input_sel, e => e.getAttribute('popover'))
      await expect(popover).toBe('Link to more information about profile')
    })

    it('validates with checkURL', async () => {
      const ng_blur = await page.$eval(source_input_sel, e => e.getAttribute('ng-blur'))
      await expect(ng_blur).toBe('checkURL()')
    })
  })

  describe('Adding a Resource Template', () => {

    beforeAll(async () => {
      await page.waitForSelector('#addResource')
      await page.click('#addResource')
      await page.waitFor(1000)
    })

    it('displays a new resource template span', async () => {
      const title = await page.$eval('span[id="0"] > span', e => e.getAttribute('popover-title'))
      const span = await page.$eval('span[id="0"] > span', e => e.textContent)
      expect(title).toMatch(/Resource ID: Undefined/)
      expect(span).toMatch(/Resource Template/)
    })

    it('has five input fields for the resource template data', async () => {
      const inputs = await page.$eval('div[id="resource_0"] > div > table', e => e.getElementsByTagName('input').length)
      expect(inputs).toBe(5)
      await expect(page).toMatch('ID')
      await expect(page).toMatch('Resource Label')
      await expect(page).toMatch('Guiding statement for the use of this resource')
      await expect(page).toMatch('Resource URI')
    })
  })

  describe('Adding a Property Template', () => {
    beforeEach(async () => {
      await page.waitForSelector('.propertyLink')
      await page.click('.propertyLink')
      await expect(page).toMatch('Property Template')
    })

    it('now has 3 input fields for property ID once a resource template is added', async () => {
      await page.waitForSelector('div[id="property_1"] > div > table')
      const inputs = await page.$eval('div[id="property_1"] > div > table', e => e.getElementsByTagName('input').length)
      expect(inputs).toBe(3)
      await page.waitFor(1000)
      await expect(page).toMatch('Property URI')
      await expect(page).toMatch('Type')
      await expect(page).toMatch('Mandatory')
      await expect(page).toMatch('Property Label')
      await expect(page).toMatch('Repeatable')
    })
  })

  describe('Removing the resource template', () => {
    beforeEach(async () => {
      await page.waitForSelector('#deleteButton')
      await page.click('#deleteButton')
      await page.waitForSelector('#deleteModal')
      await page.waitFor(1000)
      await page.click('#deleteModal > div > div > div.modal-body > button:nth-child(1)')
    })

    it('now has no span or input fields for the resource template', async () => {
      await expect(page).not.toMatch('Property Template')
      await expect(page).not.toMatch('span', {
        text: 'Resource Template'
      })
    })
  })

  describe('Profile fields errors', () => {

    it('displays error if source and user switches focus', async () => {
      await page
        .type(source_input_sel, '')
        .catch(error => console.log(`promise error for : ${error}`))
      await page.keyboard.press(`Tab`)
      await expect_value_in_selector_textContent('#alertBox > div > div > div.modal-header > h3', 'Error!')
      const invalid_url_class = page.$('input#resourceURI', e => e.getAttribute('ng-invalid-url'))
      expect(invalid_url_class).toBeDefined()
    })
  })

})

async function expect_value_in_selector_textContent(sel, value) {
  const sel_text = await page.$eval(sel, e => e.textContent)
  expect(sel_text.trim()).toBe(value)
}

async function expect_value_not_in_selector_textContent(sel, value) {
  const sel_text = await page.$eval(sel, e => e.textContent)
  expect(sel_text.trim()).not.toBe(value)
}
