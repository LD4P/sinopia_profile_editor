// Copyright 2018 Stanford University see Apache2.txt for license

describe('Create profile has ontologies available for resource template', () => {
  const modalSel = 'div#chooseResource > div.modal-dialog > div.modal-content'
  beforeAll(async () => {
    await page.goto('http://127.0.0.1:8000/#/profile/create/')
    await page.waitForSelector('a#addResource')
    await page.click('a#addResource')
    await page.waitForSelector('a#resourceChoose')
    await page.click('a#resourceChoose')
    return await page.waitForSelector(modalSel)
  })

  it('modal title says Choose Vocab Template', async () => {
    expect.assertions(1)

    const modalTitleSel = `${modalSel} > div.modal-header > h3.modal-title`
    await expect_value_in_sel_textContent(modalTitleSel, 'Choose Resource Template')
  })

  describe('ontologies select', () => {
    const modalBodySel = `${modalSel} > div.modal-body`
    const selectVocabSel = `${modalBodySel} > div#select_box_holder > select[name="chooseVocab"]`

    beforeAll( async() => {
      return await page.waitForSelector(selectVocabSel)
    })

    it('populated with ontologies (via versoSpoof)', async () => {
      expect.assertions(7)
      const expVals = [
        'Select Vocabulary File',
        'BFLC',
        'RDF',
        'RDFS',
        'MADSRDF',
        'Bibframe 2.0'
      ]
      const options = await page.$$eval(
        `${selectVocabSel} > option`,
        opts => {
          return opts.map(e => {
            return e.textContent
          })
        }
      )
      expect(options.length).toBe(6)
      expVals.forEach(val => {
        expect(options).toContain(val)
      })
    })

    it('ontologies are selectable', async () => {
      expect.assertions(2)
      await expect(page).toSelect(selectVocabSel, 'RDF')

      const resourcePickSel = `${modalBodySel} > select#resourcePick`
      await expect_value_in_sel_textContent(`${resourcePickSel} > option:nth-child(1)`, 'Property')
    })
  })
})

async function expect_value_in_sel_textContent(sel, value) {
  await page.waitForSelector(sel)
  const sel_text = await page.$eval(sel, e => e.textContent)
  return expect(sel_text).toBe(value)
}
