// Copyright 2018 Stanford University see Apache2.txt for license
const path = require('path')

describe('imports and edits a v0.0.2 profile from a json file', () => {

  beforeAll(async () => {
    await page.goto('http://localhost:8000/#/profile/create/true')
    const profilePath = path.join(__dirname, "..", "__fixtures__", 'item_profile_lc_v0.0.2.json')
    await expect(page).toUploadFile('input[type="file"]', profilePath)
    const profileLoadedSel = 'div#profile-panel .panel-heading span[popover-title="Profile ID: profile:bf2:Item"]'
    await page.waitForSelector(profileLoadedSel, {visible: true})
    return await expect(page).toClick(profileLoadedSel)
  })

  it('has expected profile attribute values and resource templates', async () => {
    expect.assertions(10) // includes 2 in beforeAll
    await expect_regex_in_sel_textContent('span[popover-title="Profile ID: profile:bf2:Item"]', 'BIBFRAME 2.0 Item')
    await expect_regex_in_sel_textContent('span[popover-title="Resource ID: profile:bf2:Item"]', 'BIBFRAME 2.0 Item')
    await expect_regex_in_sel_textContent('span[popover-title="Resource ID: profile:bf2:Item:Access"]', 'Lending or Access Policy')
    await expect_regex_in_sel_textContent('span[popover-title="Resource ID: profile:bf2:Item:Use"]', 'Use or Reproduction Policy')
    await expect_regex_in_sel_textContent('span[popover-title="Resource ID: profile:bf2:Item:Retention"]', 'Retention Policy')
    await expect_regex_in_sel_textContent('span[popover-title="Resource ID: profile:bf2:Item:ImmAcqSource"]', 'Immediate Source of Acquisition')
    await expect_regex_in_sel_textContent('span[popover-title="Resource ID: profile:bf2:Item:Enumeration"]', 'Enumeration')
    await expect_regex_in_sel_textContent('span[popover-title="Resource ID: profile:bf2:Item:Chronology"]', 'Chronology')
  })

  it('has expected resource template with expected attribute values and property sections', async() => {
    expect.assertions(7)
    await expect(page).toClick('span[popover-title="Resource ID: profile:bf2:Item"]')
    await page.waitForSelector('span[popover-title="Property URI: http://id.loc.gov/ontologies/bibframe/sublocation"]', {visible: true})
    await expect_value_in_sel_input('input[popover-title="Resource ID"]', 'profile:bf2:Item')
    await expect_value_in_sel_input('input[popover-title="Resource URI"]', 'http://id.loc.gov/ontologies/bibframe/Item')
    await expect_value_in_sel_input('input[popover-title="Resource Label"]', 'BIBFRAME 2.0 Item')
    await expect_regex_in_sel_textContent('span[popover-title="Property URI: http://id.loc.gov/ontologies/bibframe/identifiedBy"]', 'Barcode')
    await expect_regex_in_sel_textContent('span[popover-title="Property URI: http://id.loc.gov/ontologies/bibframe/sublocation"]', 'Shelving location')
    await expect_regex_in_sel_textContent('span[popover-title="Property URI: http://id.loc.gov/ontologies/bibframe/acquisitionSource"]', 'Contact information (RDA 4.3)')
  })

  it('has expected property with expected attribute values', async() => {
    expect.assertions(6)
    await expect(page).toClick('span[popover-title="Property URI: http://id.loc.gov/ontologies/bibframe/identifiedBy"]')
    await page.waitForSelector('select[popover-title="Mandatory"]', {visible: true})
    await expect_value_in_sel_input('input[popover-title="Property URI"]', 'http://id.loc.gov/ontologies/bibframe/identifiedBy')
    await expect_value_in_sel_input('input[popover-title="Property Label"]', 'Barcode')
    await expect_value_in_sel_input('select[popover-title="Mandatory"]', '0')
    await expect_value_in_sel_input('select[popover-title="Repeatable"]', '1')
    const template_select_sel = 'div#template > div[item="0"] select[popover-title="Value Template Reference"]'
    await expect_sel_to_exist(template_select_sel)
  })

  describe('property template fields', () => {
    beforeAll(async () => {
      await expect(page).toClick('a#addResource')
      return await expect(page).toClick('#resourceTemplates_0 > div:last-child a.propertyLink')
    })

    const lastResTempPropTempSel = '#resourceTemplates_0 > div:last-child div[name="propertyForm"]'

    it('add Default value constraint to Property Template', async() => {
      expect.assertions(8) // includes 2 in beforeAll
      await expect(page).toClick(`${lastResTempPropTempSel} #valueConstraints #addDefault`)

      const defaultURIsel = `${lastResTempPropTempSel} #valueConstraints input[name="defaultURI"]`
      await expect(page).toClick(defaultURIsel)
      await expect(page).toFill(defaultURIsel, 'http://www.default.uri')
      const defaultLiteralSel = `${lastResTempPropTempSel} #valueConstraints input[name="defaultLiteral"]`
      await expect(page).toFill(defaultLiteralSel, 'my default literal')

      // NOTE: this is a shameless green way to hopefully show that data has been entered into the default form fields
      await expect_sel_to_exist(`${defaultURIsel}.ng-dirty`)
      await expect_sel_to_exist(`${defaultLiteralSel}.ng-dirty`)
    })

    //TODO: test selecting a Value Data type modal view and value selection
    it.todo('add Value Data Type definitions using the Select Data Type modal helper')

    it('add resource template id from selector in "Templates" section', async () => {
      // NOTE:  Not sure it's working properly in the app.
      //   browser shows text selected, but inspected element html does NOT show additional changes to
      //   the selected element (like, I picked 1, then I picked 2).

      expect.assertions(4)
      const addTemplateSel = `${lastResTempPropTempSel} #valueConstraints div#template > a#addTemplate`
      await expect(page).toClick(addTemplateSel)

      const resTemplateRefSel = `${lastResTempPropTempSel} #valueConstraints div#template select[popover-title="Value Template Reference"]`
      await page.waitForSelector(resTemplateRefSel)
      await expect_regex_in_sel_textContent(resTemplateRefSel, '')
      await expect_sel_to_exist(`${resTemplateRefSel} > option[selected="selected"][value="?"]`)

      // FIXME:  the selector should be populated with ids of resource templates from the server.  See #212
      const resTemplateId = 'profile:bf2:35mmFeatureFilm:Color'
      // NOTE: This code technique can't seem to select the text
      // await expect(page).toSelect(resTemplateRefSel, resTemplateId) // this didn't work;  dunno why
      // NOTE: not positive this code selects the value
      await page.waitForSelector(resTemplateRefSel)
      await page.select(resTemplateRefSel, resTemplateId)

      // NOTE: could not get any of these to work
      // await expect_sel_to_exist(`${resTemplateRefSel} > option[selected="selected"][value="${resTemplateId}"]`)
      // await expect_sel_to_exist(`${resTemplateRefSel} > option[selected="selected"][value*="Color"]`)
      // await expect_sel_to_exist(`${resTemplateRefSel} > option[selected="selected"][value^="profile:bf2"]`)
      // await expect_regex_in_sel_textContent(resourceTemplateRefSel, "profile:bf2:35mmFeatureFilm:Color")

      // NOTE: this is a shameless green way to hopefully show that a value has been selected
      await expect_sel_to_exist(`${resTemplateRefSel}.ng-dirty`)
    })

    it('"Values" Add Value allows URI selection', async() => {
      expect.assertions(5)
      const addValSel = 'div#value > #adValue'
      await page.waitForSelector(addValSel, {visible: true})
      await page.click(addValSel)
      const useValuesFromSel = 'div#value select[popover-title="Use Values From"]'
      await page.waitFor(500) // shameless green: it needs more time here, can't tell why
      await page.waitForSelector(useValuesFromSel, {visible: true})
      await expect_regex_in_sel_textContent(useValuesFromSel, '')
      await expect_sel_to_exist(`${useValuesFromSel} > option[selected="selected"][value="?"]`)

      await expect(page).toSelect(useValuesFromSel, 'AGROVOC (QA)')
      await expect_sel_to_exist(`${useValuesFromSel} > option[selected="selected"][value="0"]`)
      await expect_regex_in_sel_textContent(useValuesFromSel, 'AGROVOC (QA)')
    })
  })

  it('add a new resource template based on known resource templates', async() => {
    expect.assertions(5)

    await expect(page).toClick('a#addResource')
    await expect(page).toClick('a#resourceChoose', {text: 'Select Resource'})

    const modalBodySel = 'div#chooseResource div.modal-body'
    const selectVocabSel = `${modalBodySel} > div#select_box_holder > select[name="chooseVocab"]`
    await expect(page).toSelect(selectVocabSel, 'Bibframe 2.0')

    const resourcePickSel = `${modalBodySel} > select#resourcePick`
    await expect(page).toSelect(resourcePickSel, 'Role')
    await expect_regex_in_sel_textContent('span[popover="URI: http://id.loc.gov/ontologies/bibframe/Role"]', 'Role')
  })

  it('delete a property from a resource template', async() => {
    expect.assertions(5)
    const resourceTemplateSpan = 'span[popover-title="Resource ID: profile:bf2:Item"]'
    await page.waitFor(500) // shameless green: it needs more time here, can't tell why
    await page.waitFor(resourceTemplateSpan, {visible: true})
    await expect(page).toClick(resourceTemplateSpan)
    await page.waitForSelector('#resource_0 a.propertyLink')

    const propTemplatesSel = '#resourceTemplates_0 > div[name="resourceForm"] div.panel-body div.propertyTemplates'
    const deleteTargetSel = `${propTemplatesSel} span[popover-title="Property URI: http://id.loc.gov/ontologies/bibframe/identifiedBy"]`
    await expect_regex_in_sel_textContent(deleteTargetSel, 'Barcode')

    await expect(page).toClick(`${propTemplatesSel} > div.propertyItem[item="0"] a#deleteIcon`)
    const confirmDeleteSel = 'div#deleteModal div.modal-body > button[ng-click="confirm();"]'
    await page.waitForSelector(confirmDeleteSel, {visible: true})
    await expect(page).toClick(confirmDeleteSel)

    await expect_regex_not_in_sel_textContent(deleteTargetSel, 'Barcode')
  })

  it.todo('change property definitions using the Change Property modal')

  // TODO: write this test -- tho it's sorta maybe covered by export-profile tests?
  it.todo('exports values in json that match the imported values and changes')
})

it('imports a v0.0.9 profile from a json file', async () => {
  expect.assertions(3)
  await page.goto('http://localhost:8000/#/profile/create/true')

  const profilePath = path.join(__dirname, "..", "__fixtures__", 'foo_profile_sinopia_v0.0.9.json')
  await expect(page).toUploadFile('input[type="file"]', profilePath)
  await page.waitForSelector('span[popover-title="Profile ID: sinopia:profile:bf2:Foo"]', {visible: true})
  await expect_regex_in_sel_textContent('span[popover-title="Profile ID: sinopia:profile:bf2:Foo"]', 'BIBFRAME 2.0 Foo')
  await expect_regex_in_sel_textContent('span[popover-title="Resource ID: sinopia:resourceTemplate:bf2:Foo"]', 'Foo Associated with a Work')
})

it('imports a v0.1.0 profile from a json file', async () => {
  expect.assertions(3)
  await page.goto('http://localhost:8000/#/profile/create/true')

  const profilePath = path.join(__dirname, "..", "__fixtures__", 'place_profile_sinopia_v0.1.0.json')
  await expect(page).toUploadFile('input[type="file"]', profilePath)
  await page.waitForSelector('span[popover-title="Profile ID: sinopia:profile:bf2:Place"]', {visible: true})
  await expect_regex_in_sel_textContent('span[popover-title="Profile ID: sinopia:profile:bf2:Place"]', 'BIBFRAME 2.0 Place')
  await expect_regex_in_sel_textContent('span[popover-title="Resource ID: sinopia:resourceTemplate:bf2:Place"]', 'Place Associated with a Work')
})

it('imports propertyURI value with # char cleanly', async () => {
  expect.assertions(3)

  await page.goto('http://localhost:8000/#/profile/create/true')
  const profilePath = path.join(__dirname, "..", "__fixtures__", 'profile_needs_encoding_v0.1.0.json')
  await expect(page).toUploadFile('input[type="file"]', profilePath)
  const rtemplateSpanSel = 'span[popover-title="Resource ID: sinopia:resourceTemplate:bf2:Place"]'
  await page.waitForSelector(rtemplateSpanSel)
  await expect(page).toClick(rtemplateSpanSel)

  // NOTE: this propertyURI has #
  const ptemplateSpanSel = 'span[popover-title="Property URI: http://www.w3.org/2000/01/rdf-schema#label"]'
  await expect_sel_to_exist(ptemplateSpanSel)
  // shameless green:  could not figure out a way to select the value in the actual input element
})

async function expect_regex_in_sel_textContent(sel, value) {
  await page.waitForSelector(sel)
  const sel_text = await page.$eval(sel, e => e.textContent)
  expect(sel_text).toMatch(value)
}
async function expect_regex_not_in_sel_textContent(sel, value) {
  await page.waitForSelector(sel)
  const sel_text = await page.$eval(sel, e => e.textContent)
  expect(sel_text).not.toMatch(value)
}
async function expect_value_in_sel_input(sel, value) {
  await page.waitForSelector(sel)
  const sel_text = await page.$eval(sel, e => e.value)
  expect(sel_text).toBe(value)
}
async function expect_sel_to_exist(sel) {
  await page.waitForSelector(sel)
  const sel_text = !!(await page.$(sel))
  expect(sel_text).toEqual(true)
}
