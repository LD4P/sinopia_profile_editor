// Copyright 2018 Stanford University see Apache2.txt for license
const path = require('path')

describe('Importing a profile from a json file', () => {

  beforeAll(async () => {
    await page.goto('http://localhost:8000/#/profile/create/true')

    const bf_item_location = path.join(__dirname, "..", "__fixtures__", 'item_profile_lc_v0.0.2.json')
    await expect(page).toUploadFile(
        'input[type="file"]',
        bf_item_location,
    )
  })

  it('imports an existing v0.0.2 profile and resource templates', async () => {
    await page.waitForSelector('span[popover-title="Profile ID: profile:bf2:Item"]')
      .then(async () => {
        await expect_regex_in_sel_textContent('span[popover-title="Profile ID: profile:bf2:Item"]', 'BIBFRAME 2.0 Item')
        await expect_regex_in_sel_textContent('span[popover-title="Resource ID: profile:bf2:Item"]', 'BIBFRAME 2.0 Item')
        await expect_regex_in_sel_textContent('span[popover-title="Resource ID: profile:bf2:Item:Access"]', 'Lending or Access Policy')
        await expect_regex_in_sel_textContent('span[popover-title="Resource ID: profile:bf2:Item:Use"]', 'Use or Reproduction Policy')
        await expect_regex_in_sel_textContent('span[popover-title="Resource ID: profile:bf2:Item:Retention"]', 'Retention Policy')
        await expect_regex_in_sel_textContent('span[popover-title="Resource ID: profile:bf2:Item:ImmAcqSource"]', 'Immediate Source of Acquisition')
        await expect_regex_in_sel_textContent('span[popover-title="Resource ID: profile:bf2:Item:Enumeration"]', 'Enumeration')
        await expect_regex_in_sel_textContent('span[popover-title="Resource ID: profile:bf2:Item:Chronology"]', 'Chronology')
      })
      .catch(error => console.log(`promise error for import v0.0.2 profile: ${error}`))
  })

  it('has the expected resource metadata and property sections', async() => {
    await page.waitForSelector('span[popover-title="Resource ID: profile:bf2:Item"]')
        .then(async () => {
          await expect(page).toClick('span[id="0"]')
          await expect_value_in_sel_input('input[popover-title="Resource ID"]', 'profile:bf2:Item')
          await expect_value_in_sel_input('input[popover-title="Resource URI"]', 'http://id.loc.gov/ontologies/bibframe/Item')
          await expect_value_in_sel_input('input[popover-title="Resource Label"]', 'BIBFRAME 2.0 Item')
          await expect_regex_in_sel_textContent('span[popover-title="Property URI: http://id.loc.gov/ontologies/bibframe/identifiedBy"]', 'Barcode')
          await expect_regex_in_sel_textContent('span[popover-title="Property URI: http://id.loc.gov/ontologies/bibframe/sublocation"]', 'Shelving location')
          await expect_regex_in_sel_textContent('span[popover-title="Property URI: http://id.loc.gov/ontologies/bibframe/acquisitionSource"]', 'Contact information (RDA 4.3)')
        })
        .catch(error => console.log(`promise error for resource metadata: ${error}`))
  })

  it('has the expected property values for a resource template', async() => {
    await page.waitForSelector('span[popover-title="Property URI: http://id.loc.gov/ontologies/bibframe/identifiedBy"]')
        .then(async() => {
          await expect(page).toClick('span[popover-title="Property URI: http://id.loc.gov/ontologies/bibframe/identifiedBy"]')
          await expect_value_in_sel_input('input[popover-title="Property URI"]', 'http://id.loc.gov/ontologies/bibframe/identifiedBy')
          await expect_value_in_sel_input('input[popover-title="Property Label"]', 'Barcode')
          await expect_value_in_sel_input('select[popover-title="Mandatory"]', '0')
          await expect_value_in_sel_input('select[popover-title="Repeatable"]', '1')

          let template_select_sel = 'select#templateSelect_7_0'
          await page.waitForSelector(template_select_sel)
          await expect_sel_to_exist(`${template_select_sel}.ng-pristine`)
          await expect_sel_to_exist(`${template_select_sel} > option[selected="selected"][value^="?"]`)
        })
  })

  it('can add a default value contraint to a property', async() => {
    await page.waitForSelector('#addDefault')
        .then(async() => {
          await expect(page).toClick('#addDefault')
          await expect(page).toFill('input[popover-title="Default URI"]', 'http://www.default.uri')
          await expect(page).toFill('input[popover-title="Default Literal"]', 'Default')
        })
  })

  it('can add Value Data Type definitions using the Select Data Type modal helper', async() => {
    //TODO: test selecting a Value Data type modal view and value selection
  })

  it('can add a new template reference', async() => {
    await page.waitFor(1000)
    await page.waitForSelector('#addTemplate')
        .then(async() => {
          await expect(page).toClick('#addTemplate')
          await expect(page).toClick('select[popover-title="Value Template Reference"]')

          let template_select_sel = 'select#templateSelect_7_1'
          await page.waitForSelector(template_select_sel)
          // NOTE: the html always shows the first option selected, though the browser
          //  shows the right thing.  So here we cheat and use indirect checking of attributes
          //  to show a template can be selected
          await expect_sel_to_exist(`${template_select_sel}.ng-pristine`)
          await expect_sel_to_exist(`${template_select_sel} > option[selected="selected"][value="?"]`)
          const value_selected = 'profile:bf2:Note'
          await page.select(template_select_sel, value_selected)
          await expect_sel_to_exist(`${template_select_sel}.ng-dirty`)
          await expect_sel_to_exist(`${template_select_sel} > option[selected="selected"][value^="profile:bf2"]`)
        })
        .catch(error => console.log(`promise error clicking Add Template: ${error}`))
  })

  it('can add a uri to use for constrained property values', async() => {
    await page.waitForSelector('#adValue')
        .then(async() => {
          let template_select_sel = 'select[popover-title="Use Values From"]'
          await expect(page).toClick('#adValue')
          await page.waitForSelector(template_select_sel)
          await expect_sel_to_exist(`${template_select_sel}.ng-pristine`)
          await expect_sel_to_exist(`${template_select_sel} > option[selected="selected"][value="?"]`)
          const value_selected = '0'
          await page.select(template_select_sel, value_selected)
          await expect_sel_to_exist(`${template_select_sel}.ng-dirty`)
          await expect_sel_to_exist(`${template_select_sel} > option[selected="selected"][value="0"]`)
          await expect_regex_in_sel_textContent(template_select_sel, 'AGROVOC (QA)')
        })
        .catch(error => console.log(`promise error clicking Add Value: ${error}`))
  })

  it('deletes a property', async() => {
    await page.waitFor(1000)
    const sel = 'div[name="propertyForm"]:nth-of-type(8) > div > h4 > span:nth-child(2) > a#deleteIcon'
    await page.waitForSelector(sel)
        .then(async() => {
          await page.$eval(sel, e => e.click())
        })
        .catch(error => console.log(`promise error clicking delete property: ${error}`))

    await page.waitFor(1000)

    await page.waitForSelector('#deleteModal')
        .then(async() =>{
          await page.click('#deleteModal > div > div > div.modal-body > button:nth-child(1)')
          // await page.$eval('#deleteModal > div > div > div.modal-body > button:nth-child(1)', e => e.click())
        })
        .catch(error => console.log(`promise error clicking confirm modal: ${error}`))

    await page.waitFor(1000)

    const removed_sel = 'span[popover-title="Property URI: http://id.loc.gov/ontologies/bibframe/note'
    await expect(page).not.toMatchElement(removed_sel)
  })

  it('can change property definitions using the Change Property modal', async() => {
    // TODO: test changing property definitions using the Change Property modal helper
  })

  it('exports values in json that match the imported values and changes', async() => {
    // TODO: write this test
  })

})

it('imports an existing v0.0.9 profile and resource templates', async () => {
  await page.goto('http://localhost:8000/#/profile/create/true')

  const bf_item_location = path.join(__dirname, "..", "__fixtures__", 'foo_profile_sinopia_v0.0.9.json')
  await expect(page).toUploadFile(
    'input[type="file"]',
    bf_item_location,
  )
  await page.waitForSelector('span[popover-title="Profile ID: sinopia:profile:bf2:Foo"]')
    .then(async () => {
      await expect_regex_in_sel_textContent('span[popover-title="Profile ID: sinopia:profile:bf2:Foo"]', 'BIBFRAME 2.0 Foo')
      await expect_regex_in_sel_textContent('span[popover-title="Resource ID: sinopia:resourceTemplate:bf2:Foo"]', 'Foo Associated with a Work')
    })
    .catch(error => console.log(`promise error for import v0.0.9 profile: ${error}`))
})

it('imports an existing v0.1.0 profile and resource templates', async () => {
  await page.goto('http://localhost:8000/#/profile/create/true')

  const bf_item_location = path.join(__dirname, "..", "__fixtures__", 'place_profile_sinopia_v0.1.0.json')
  await expect(page).toUploadFile(
    'input[type="file"]',
    bf_item_location,
  )
  await page.waitForSelector('span[popover-title="Profile ID: sinopia:profile:bf2:Place"]')
    .then(async () => {
      await expect_regex_in_sel_textContent('span[popover-title="Profile ID: sinopia:profile:bf2:Place"]', 'BIBFRAME 2.0 Place')
      await expect_regex_in_sel_textContent('span[popover-title="Resource ID: sinopia:resourceTemplate:bf2:Place"]', 'Place Associated with a Work')
    })
    .catch(error => console.log(`promise error for import v0.1.0 profile: ${error}`))
})

async function expect_regex_in_sel_textContent(sel, value) {
  const sel_text = await page.$eval(sel, e => e.textContent)
  expect(sel_text).toMatch(value)
}
async function expect_value_in_sel_input(sel, value) {
  const sel_text = await page.$eval(sel, e => e.value)
  expect(sel_text).toBe(value)
}
async function expect_sel_to_exist(sel) {
  const sel_text = !!(await page.$(sel))
  expect(sel_text).toEqual(true)
}
