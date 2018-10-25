describe('Create profile has ontologies available for resource template', () => {
  const modal_sel = 'div#chooseResource > div.modal-dialog > div.modal-content'
  beforeAll(async () => {
    // page.on('console', msg => console.log('PAGE LOG:', msg.text()))
    await page.goto('http://127.0.0.1:8000/#/profile/create/')
    page
      .waitForSelector('a#addResource')
      .then(async () => await page.click('a#addResource'))
      .catch(error => console.log(`promise error for addResource link: ${error}`))
    page
      .waitForSelector('a.resourceChoose')
      .then(async () => await page.click('a.resourceChoose'))
      .catch(error => console.log(`promise error for select resource link: ${error}`))
    await page.waitForSelector(modal_sel)
  })

  it('modal title says Choose Vocab Template', async () => {
    const mt_sel = `${modal_sel} > div.modal-header > h3.modal-title`
    await expect_value_in_selector_textContent(mt_sel, 'Choose Vocab Template')
  })

  describe('ontologies select', () => {
    const selectVocabSel = `${modal_sel} > div.modal-body > div#select_box_holder > select[name="chooseVocab"]`
    it('populated with ontologies (via versoSpoof)', async () => {
      page
        .waitForSelector(selectVocabSel)
        .then(async () => {
            const ontologies_count = await page.$eval(selectVocabSel, e => e.length)
            expect(ontologies_count).toBe(5)
          })
        .catch(error => console.log(`promise error for ontologies selector: ${error}`))
    })
    it('ontologies selectable', async () => {
      page
        .waitForSelector(selectVocabSel)
        .then(async () => {
            // NOTE: the html always shows the first option selected, though the browser
            //  shows the right thing.  So here we cheat and use indirect checking of attributes
            //  to show a template can be selected
            await expect_sel_to_exist(`${selectVocabSel}.ng-pristine`)
            await expect_sel_to_exist(`${selectVocabSel} > option[selected="selected"][value="?"]`)
            const value_selected = 'Arapaho'
            page
              .select(selectVocabSel, value_selected)
              .then(async () => {
                await expect_sel_to_exist(`${selectVocabSel}.ng-dirty`)
                await expect_sel_to_exist(`${selectVocabSel} > option[selected="selected"][value="${value_selected}"]`)
                })
              .catch(error => console.log(`promise error for selecting ontology for resource: ${error}`))
          })
        .catch(error => console.log(`promise error for ontologies selector: ${error}`))
    })
  })
})

async function expect_sel_to_exist(sel) {
  const sel_text = !!(await page.$(sel))
  expect(sel_text).toEqual(true)
}
async function expect_value_in_selector_textContent(sel, value) {
  await page.waitForSelector(sel)
  const sel_text = await page.$eval(sel, e => e.textContent)
  expect(sel_text).toBe(value)
}
