// Copyright 2018 Stanford University see Apache2.txt for license
const path = require('path')
const pupExpect = require('./jestPuppeteerHelper')

describe('edits an imported v0.0.2 profile', () => {
  beforeAll(async () => {
    await page.goto('http://localhost:8000/#/profile/create/true')
    const profilePath = path.join(__dirname, "..", "__fixtures__", 'item_profile_lc_v0.0.2.json')
    await expect(page).toUploadFile('input[type="file"]', profilePath)
    const profileLoadedSel = 'div#profile-panel .panel-heading span[popover-title="Profile ID: profile:bf2:Item"]'
    await page.waitForSelector(profileLoadedSel, {visible: true})
    await expect(page).toClick(profileLoadedSel)
  })

  // FIXME: describe('edits imported profile' ... from import-profile tests should move here, but I had trouble
  // getting them to pass here.
  //  Suspect it is dependent on test order of execution and/or need a more specific selector.

  describe('edit resource templates in profile', () => {
    beforeAll(async () => {
      await page.waitForSelector('a#addResource')
      await page.click('a#addResource')
    })

    test('add (Role) known resource template via Select Resource', async() => {
      expect.assertions(6) // includes 2 from outer beforeAll

      await expect(page).toClick('a#resourceChoose', {text: 'Select Resource'})

      const modalBodySel = 'div#chooseResource div.modal-body'
      const selectVocabSel = `${modalBodySel} > div#select_box_holder > select[name="chooseVocab"]`
      await expect(page).toSelect(selectVocabSel, 'Bibframe 2.0')

      const resourcePickSel = `${modalBodySel} > select#resourcePick`
      await expect(page).toSelect(resourcePickSel, 'Role')
      await pupExpect.expectSelTextContentToMatch('span[popover="URI: http://id.loc.gov/ontologies/bibframe/Role"]', 'Role')
    })
    test('delete (Role) resource template', async() => {
      expect.assertions(4)

      const deleteTargetSel = 'span[popover="URI: http://id.loc.gov/ontologies/bibframe/Role"]'
      await page.waitForSelector(deleteTargetSel)
      await pupExpect.expectSelTextContentToMatch(deleteTargetSel, 'Role')

      const deleteRoleSel = '#deleteButton'
      await page.waitFor(1000) // shameless green: it needs more time here; can't tell why
      await expect(page).toClick(deleteRoleSel, {text: "Delete Role"})

      const modalConfirmDeleteSel = 'div#deleteModal div.modal-body > button[ng-click="confirm();"]'
      await page.waitForSelector(modalConfirmDeleteSel, {visible: true})
      await expect(page).toClick(modalConfirmDeleteSel)

      await pupExpect.expectSelNotToExist(deleteTargetSel)
    })
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

  test.todo('change property definitions using the Change Property modal')
})
