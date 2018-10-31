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
})

async function expect_value_in_sel_textContent(sel, value) {
  await page.waitForSelector(sel)
  const sel_text = await page.$eval(sel, e => e.textContent)
  expect(sel_text).toBe(value)
}
