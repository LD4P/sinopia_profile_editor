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
describe('Type of Property in Resource in Profile', () => {
  beforeEach(async () => {
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

  it('dropdown is correctly populated', async () => {
    const propTypeSel = 'select[name="type"][ng-model="propertyTemplate.type"]'
    await expect_value_in_sel_textContent(`${propTypeSel} > option:nth-child(1)`, 'literal')
    await expect_value_in_sel_textContent(`${propTypeSel} > option:nth-child(2)`, 'resource')
    await expect_value_in_sel_textContent(`${propTypeSel} > option:nth-child(3)`, 'lookup')
    await expect_value_in_sel_textContent(`${propTypeSel} > option:nth-child(4)`, 'target')
    await expect_value_in_sel_textContent(`${propTypeSel} > option:nth-child(5)`, 'list')
  })

  // it('can select a type in dropdown', () => {
  //   // TODO: write this test
  // })
})

async function expect_value_in_sel_textContent(sel, value) {
  await page.waitForSelector(sel)
  const sel_text = await page.$eval(sel, e => e.textContent)
  expect(sel_text).toBe(value)
}
