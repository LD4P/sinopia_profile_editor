/**
Copyright 2018 The Board of Trustees of the Leland Stanford Junior University

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
**/
describe('Importing a profile from a json file', () => {

  beforeAll(async () => {
    await page.goto('http://localhost:8000/#/profile/create/true')
  })

  beforeAll(async () => {
    const path = require('path')
    const bf_item_location = path.join(__dirname, "..", "__fixtures__", 'item.json')
    await expect(page).toUploadFile(
        'input[type="file"]',
        bf_item_location,
    )
  })

  it('imports an existing profile and resource templates', async () => {
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
        .catch(error => console.log(`promise error for import profile: ${error}`))
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
          await expect_sel_to_exist(`${template_select_sel} > option[selected="selected"][value^="profile:bf2"]`)
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
          await expect(page).toClick('#adValue')
          await expect(page).toFill('input[popover-title="Use Values From"]', 'http://www.values.loc')
        })
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
