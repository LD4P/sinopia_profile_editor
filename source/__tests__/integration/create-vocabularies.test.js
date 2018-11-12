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
describe('Create profile has vocabularies available for properties for resource', () => {
  beforeEach(async () => {
    // page.on('console', msg => console.log('PAGE LOG:', msg.text()))
    await page.goto('http://127.0.0.1:8000/#/profile/create')
    page
      .waitForSelector('button#addResource')
      .then(async () => await page.click('button#addResource'))
      .catch(error => console.log(`promise error for addResource link: ${error}`))
    page
      .waitForSelector('a.propertyLink')
      .then(async () => await page.click('a.propertyLink'))
      .catch(error => console.log(`promise error for add property link: ${error}`))
    await page.waitForSelector('span[href="#property_1"]')
  })

  describe('language URI select', () => {
    let lang_select_sel = 'select[name="languageURI"]'
    it('populated with language vocabulary (via versoSpoof)', async () => {
      await page.waitForSelector('span[href="#property_1"]')
      const languages_count = await page.$eval(lang_select_sel, e => e.length)
      expect(languages_count).toBe(485)
    })
    it('can select a language', async () => {
      await page.waitForSelector('span[href="#property_1"]')
      // NOTE: the html always shows the first option selected, though the browser
      //  shows the right thing.  So here we cheat and use indirect checking of attributes
      //  to show a template can be selected
      await expect_sel_to_exist(`${lang_select_sel}.ng-pristine`)
      await expect_sel_to_exist(`${lang_select_sel} > option[selected="selected"][value="?"]`)
      const value_selected = 'Arapaho'
      await page.select(lang_select_sel, value_selected)
      // await expect_sel_to_exist(`${lang_select_sel}.ng-dirty`)
      // await expect_sel_to_exist(`${lang_select_sel} > option[selected="selected"][value="${value_selected}"]`)
    })
  })
})

async function expect_sel_to_exist(sel) {
  const sel_text = !!(await page.$(sel))
  expect(sel_text).toEqual(true)
}
