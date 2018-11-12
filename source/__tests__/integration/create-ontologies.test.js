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
describe('Create profile has ontologies available for resource template', () => {
  const modalSel = 'div#chooseResource > div.modal-dialog > div.modal-content'
  beforeAll(async () => {
    // page.on('console', msg => console.log('PAGE LOG:', msg.text()))
    await page.goto('http://127.0.0.1:8000/#/profile/create/')
    page
      .waitForSelector('a#addResource')
      .then(async () => await page.click('a#addResource'))
      .catch(error => console.log(`promise error for addResource link: ${error}`))
    page
      .waitForSelector('a#resourceChoose')
      .then(async () => await page.click('a#resourceChoose'))
      .catch(error => console.log(`promise error for select resource link: ${error}`))
    await page.waitForSelector(modalSel)
  })

  it('modal title says Choose Vocab Template', async () => {
    const modalTitleSel = `${modalSel} > div.modal-header > h3.modal-title`
    await expect_value_in_sel_textContent(modalTitleSel, 'Choose Vocab Template')
  })

  describe('ontologies select', () => {
    const modalBodySel = `${modalSel} > div.modal-body`
    const selectVocabSel = `${modalBodySel} > div#select_box_holder > select[name="chooseVocab"]`

    beforeAll(() => {
      page
        .waitForSelector(selectVocabSel)
        .catch(error => console.log(`promise error for ontologies selector: ${error}`))
    })

    it('populated with ontologies (via versoSpoof)', async () => {
      await expect_value_in_sel_textContent(`${selectVocabSel} > option:nth-child(2)`, 'BFLC')
      await expect_value_in_sel_textContent(`${selectVocabSel} > option:nth-child(3)`, 'RDF')
      await expect_value_in_sel_textContent(`${selectVocabSel} > option:nth-child(4)`, 'RDFS')
      await expect_value_in_sel_textContent(`${selectVocabSel} > option:nth-child(5)`, 'MADSRDF')
      await expect_value_in_sel_textContent(`${selectVocabSel} > option:nth-child(6)`, 'Bibframe 2.0')
    })

    it('ontologies selectable', async () => {
      await expect(page).toSelect(selectVocabSel, 'RDF')

      const resourcePickSel = `${modalBodySel} > select#resourcePick`
      await expect_value_in_sel_textContent(`${resourcePickSel} > option:nth-child(1)`, 'Property')
    })
  })
})

async function expect_value_in_sel_textContent(sel, value) {
  await page.waitForSelector(sel)
  const sel_text = await page.$eval(sel, e => e.textContent)
  expect(sel_text).toBe(value)
}
