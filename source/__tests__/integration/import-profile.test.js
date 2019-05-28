// Copyright 2018 Stanford University see Apache2.txt for license
const path = require('path')
const pupExpect = require('./jestPuppeteerHelper')

describe('imports v0.0.2 profile from json file', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:8000/#/profile/create/true')
    const profilePath = path.join(__dirname, "..", "__fixtures__", 'item_profile_lc_v0.0.2.json')
    await expect(page).toUploadFile('input[type="file"]', profilePath)
    const profileLoadedSel = 'div#profile-panel .panel-heading span[popover-title="Profile ID: profile:bf2:Item"]'
    await page.waitForSelector(profileLoadedSel, {visible: true})
    return await expect(page).toClick(profileLoadedSel)
  })

  test('profile attribute values', async () => {
    expect.assertions(3) // includes 2 in beforeAll
    await pupExpect.expectSelTextContentToMatch('span[popover-title="Profile ID: profile:bf2:Item"]', 'BIBFRAME 2.0 Item')
    // FIXME: not sure how to test value of input fields as they are events, e.g. 'input[popover-title="Profile ID"]'
    // await pupExpect.expectSelTextContentToMatch('input[popover-title="Profile ID"]', 'profile:bf2:Item')
    // await pupExpect.expectSelTextContentToMatch('input[popover-title="Title"]', 'BIBFRAME 2.0 Item')
    // await pupExpect.expectSelTextContentToMatch('input[popover-title="Description"]', 'item for all formats (testing)')
    // await pupExpect.expectSelTextContentToMatch('input[popover-title="Profile Author"]', 'NDMSO')
    // await pupExpect.expectSelTextContentToMatch('input[popover-title="Date"]', '2017-08-08')
  })

  test("profile's contained resource templates", async () => {
    expect.assertions(7)
    await pupExpect.expectSelTextContentToMatch('span[popover-title="Resource ID: profile:bf2:Item"]', 'BIBFRAME 2.0 Item')
    await pupExpect.expectSelTextContentToMatch('span[popover-title="Resource ID: profile:bf2:Item:Access"]', 'Lending or Access Policy')
    await pupExpect.expectSelTextContentToMatch('span[popover-title="Resource ID: profile:bf2:Item:Use"]', 'Use or Reproduction Policy')
    await pupExpect.expectSelTextContentToMatch('span[popover-title="Resource ID: profile:bf2:Item:Retention"]', 'Retention Policy')
    await pupExpect.expectSelTextContentToMatch('span[popover-title="Resource ID: profile:bf2:Item:ImmAcqSource"]', 'Immediate Source of Acquisition')
    await pupExpect.expectSelTextContentToMatch('span[popover-title="Resource ID: profile:bf2:Item:Enumeration"]', 'Enumeration')
    await pupExpect.expectSelTextContentToMatch('span[popover-title="Resource ID: profile:bf2:Item:Chronology"]', 'Chronology')
  })

  test('resource template attribute values', async() => {
    expect.assertions(4)
    await expect(page).toClick('span[popover-title="Resource ID: profile:bf2:Item"]')
    await page.waitForSelector('span[popover-title="Property URI: http://id.loc.gov/ontologies/bibframe/sublocation"]', {visible: true})
    await pupExpect.expectSelValueToBe('input[popover-title="Resource ID"]', 'profile:bf2:Item')
    await pupExpect.expectSelValueToBe('input[popover-title="Resource URI"]', 'http://id.loc.gov/ontologies/bibframe/Item')
    await pupExpect.expectSelValueToBe('input[popover-title="Resource Label"]', 'BIBFRAME 2.0 Item')
  })

  test("resource template's contained property sections", async() => {
    expect.assertions(3)
    await page.waitForSelector('span[popover-title="Property URI: http://id.loc.gov/ontologies/bibframe/sublocation"]', {visible: true})
    await pupExpect.expectSelTextContentToMatch('span[popover-title="Property URI: http://id.loc.gov/ontologies/bibframe/identifiedBy"]', 'Barcode')
    await pupExpect.expectSelTextContentToMatch('span[popover-title="Property URI: http://id.loc.gov/ontologies/bibframe/sublocation"]', 'Shelving location')
    await pupExpect.expectSelTextContentToMatch('span[popover-title="Property URI: http://id.loc.gov/ontologies/bibframe/acquisitionSource"]', 'Contact information (RDA 4.3)')
  })

  test('property template attribute values', async() => {
    expect.assertions(3)
    await expect(page).toClick('span[popover-title="Property URI: http://id.loc.gov/ontologies/bibframe/identifiedBy"]')
    await page.waitForSelector('select[popover-title="Mandatory"]', {visible: true})
    // FIXME: not sure how to test value of input fields as they are events, e.g. 'input[popover-title="Profile ID"]'
    // await pupExpect.expectSelValueToBe('input[popover-title="Property URI"]', 'http://id.loc.gov/ontologies/bibframe/identifiedBy')
    // await pupExpect.expectSelValueToBe('input[popover-title="Property Label"]', 'Barcode')
    await pupExpect.expectSelValueToBe('select[popover-title="Mandatory"]', '0')
    await pupExpect.expectSelValueToBe('select[popover-title="Repeatable"]', '1')
    // const valueConstraintSel = 'div#template > div[item="0"] input[popover-title="ID of Resource Template to embed"]'
    // await expect(page).toMatchElement(valueConstraintSel, { text: 'profile:bf2:Identifiers:Barcode' })
  })
})

describe('edits an imported v0.0.2 profile', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:8000/#/profile/create/true')
    const profilePath = path.join(__dirname, "..", "__fixtures__", 'item_profile_lc_v0.0.2.json')
    await expect(page).toUploadFile('input[type="file"]', profilePath)
    const profileLoadedSel = 'div#profile-panel .panel-heading span[popover-title="Profile ID: profile:bf2:Item"]'
    await page.waitForSelector(profileLoadedSel, {visible: true})
    return await expect(page).toClick(profileLoadedSel)
  })

  describe('property template fields', () => {
    beforeAll(async () => {
      await expect(page).toClick('a#addResource')
      return await expect(page).toClick('#resourceTemplates_0 > div:last-child a.propertyLink')
    })

    const lastResTempPropTempSel = '#resourceTemplates_0 > div:last-child div[name="propertyForm"]'

    test('add Default value constraint to Property Template', async() => {
      expect.assertions(10) // includes 2 in each beforeAll
      await expect(page).toClick(`${lastResTempPropTempSel} #valueConstraints #addDefault`)

      const defaultURIsel = `${lastResTempPropTempSel} #valueConstraints input[name="defaultURI"]`
      await expect(page).toClick(defaultURIsel)
      await expect(page).toFill(defaultURIsel, 'http://www.default.uri')
      const defaultLiteralSel = `${lastResTempPropTempSel} #valueConstraints input[name="defaultLiteral"]`
      await expect(page).toFill(defaultLiteralSel, 'my default literal')

      // NOTE: this is a shameless green way to hopefully show that data has been entered into the default form fields
      await expect(page).toMatchElement(`${defaultURIsel}.ng-dirty`)
      await expect(page).toMatchElement(`${defaultLiteralSel}.ng-dirty`)
    })

    //TODO: test selecting a Value Data type modal view and value selection
    it.todo('add Value Data Type definitions using the Select Data Type modal helper')

    test('add resource template id in "Templates" section', async () => {
      expect.assertions(3)
      const addTemplateSel = `${lastResTempPropTempSel} #valueConstraints div#template > a#addTemplate`
      await expect(page).toClick(addTemplateSel)

      const valTempRefTemplatesSel = 'div.panel[name="propertyForm"] #template.propertyItems'
      const valTempRefDivSel = `${valTempRefTemplatesSel} > div.listItems[html="html/template.html"] > div > div`
      const valTempRefInputSel = `${valTempRefDivSel} > input[id^="templateInput_"][type="text"]`
      const resTemplateId = 'profile:bf2:35mmFeatureFilm:Color'
      await expect(page).toFill(valTempRefInputSel, resTemplateId)

      // NOTE: this is a shameless green way to show that a value has been entered
      await expect(page).toMatchElement(`${valTempRefInputSel}.ng-dirty`)
    })

    test('"Values" Add Value allows URI selection', async() => {
      expect.assertions(5)
      const addValSel = 'div#value > #adValue'
      await page.waitForSelector(addValSel, {visible: true})
      await page.click(addValSel)
      const useValuesFromSel = 'div#value select[popover-title="Use Values From"]'
      await page.waitForSelector(useValuesFromSel, {visible: true})
      await pupExpect.expectSelTextContentToMatch(useValuesFromSel, '')
      await expect(page).toMatchElement(`${useValuesFromSel} > option[selected="selected"][value="?"]`)

      await expect(page).toSelect(useValuesFromSel, 'AGROVOC (QA)')
      await expect(page).toMatchElement(`${useValuesFromSel} > option[selected="selected"][value="0"]`)
      await pupExpect.expectSelTextContentToMatch(useValuesFromSel, 'AGROVOC (QA)')
    })
  })

  test('add resource template via Select Resource', async() => {
    expect.assertions(5)

    await expect(page).toClick('a#addResource')
    await expect(page).toClick('a#resourceChoose', {text: 'Select Resource'})

    const modalBodySel = 'div#chooseResource div.modal-body'
    const selectVocabSel = `${modalBodySel} > div#select_box_holder > select[name="chooseVocab"]`
    await expect(page).toSelect(selectVocabSel, 'Bibframe 2.0')

    const resourcePickSel = `${modalBodySel} > select#resourcePick`
    await expect(page).toSelect(resourcePickSel, 'Role')
    await pupExpect.expectSelTextContentToMatch('span[popover="URI: http://id.loc.gov/ontologies/bibframe/Role"]', 'Role')
  })

  test('delete a property from a resource template', async() => {
    expect.assertions(5)
    const resourceTemplateSpan = 'span[popover-title="Resource ID: profile:bf2:Item"]'
    await page.waitFor(500) // shameless green: it needs more time here, can't tell why
    await page.waitForSelector(resourceTemplateSpan, {visible: true})
    await expect(page).toClick(resourceTemplateSpan)
    await page.waitForSelector('#resource_0 a.propertyLink')

    const propTemplatesSel = '#resourceTemplates_0 > div[name="resourceForm"] div.panel-body div.propertyTemplates'
    const deleteTargetSel = `${propTemplatesSel} span[popover-title="Property URI: http://id.loc.gov/ontologies/bibframe/identifiedBy"]`
    await pupExpect.expectSelTextContentToMatch(deleteTargetSel, 'Barcode')

    await expect(page).toClick(`${propTemplatesSel} > div.propertyItem[item="0"] a#deleteIcon`)
    const confirmDeleteSel = 'div#deleteModal div.modal-body > button[ng-click="confirm();"]'
    await page.waitForSelector(confirmDeleteSel, {visible: true})
    await expect(page).toClick(confirmDeleteSel)

    await pupExpect.expectSelTextContentNotToMatch(deleteTargetSel, 'Barcode')
  })

  it.todo('change property definitions using the Change Property modal')
})

test('imports a v0.0.9 profile from a json file', async () => {
  expect.assertions(3)
  await page.goto('http://localhost:8000/#/profile/create/true')

  const profilePath = path.join(__dirname, "..", "__fixtures__", 'foo_profile_sinopia_v0.0.9.json')
  await expect(page).toUploadFile('input[type="file"]', profilePath)
  await page.waitForSelector('span[popover-title="Profile ID: sinopia:profile:bf2:Foo"]', {visible: true})
  await pupExpect.expectSelTextContentToMatch('span[popover-title="Profile ID: sinopia:profile:bf2:Foo"]', 'BIBFRAME 2.0 Foo')
  await pupExpect.expectSelTextContentToMatch('span[popover-title="Resource ID: sinopia:resourceTemplate:bf2:Foo"]', 'Foo Associated with a Work')
})

test('imports a v0.1.0 profile from a json file', async () => {
  expect.assertions(3)
  await page.goto('http://localhost:8000/#/profile/create/true')

  const profilePath = path.join(__dirname, "..", "__fixtures__", 'place_profile_sinopia_v0.1.0.json')
  await expect(page).toUploadFile('input[type="file"]', profilePath)
  await page.waitForSelector('span[popover-title="Profile ID: sinopia:profile:bf2:Place"]', {visible: true})
  await pupExpect.expectSelTextContentToMatch('span[popover-title="Profile ID: sinopia:profile:bf2:Place"]', 'BIBFRAME 2.0 Place')
  await pupExpect.expectSelTextContentToMatch('span[popover-title="Resource ID: sinopia:resourceTemplate:bf2:Place"]', 'Place Associated with a Work')
})

test('imports propertyURI value with # char cleanly', async () => {
  expect.assertions(3)

  await page.goto('http://localhost:8000/#/profile/create/true')
  const profilePath = path.join(__dirname, "..", "__fixtures__", 'profile_needs_encoding_v0.1.0.json')
  await expect(page).toUploadFile('input[type="file"]', profilePath)
  const rtemplateSpanSel = 'span[popover-title="Resource ID: sinopia:resourceTemplate:bf2:Place"]'
  await page.waitForSelector(rtemplateSpanSel)
  await expect(page).toClick(rtemplateSpanSel)

  // NOTE: this propertyURI has #
  const ptemplateSpanSel = 'span[popover-title="Property URI: http://www.w3.org/2000/01/rdf-schema#label"]'
  await expect(page).toMatchElement(ptemplateSpanSel)
  // shameless green:  could not figure out a way to select the value in the actual input element
})
