// Copyright 2018 Stanford University see Apache2.txt for license

describe('Type of Property in Resource in Profile', () => {
  beforeEach(async () => {
    await page.goto('http://127.0.0.1:8000/#/profile/create/')
    await page.waitForSelector('a#addResource')
    await page.click('a#addResource')
    await page.waitForSelector('a.propertyLink')
    await page.click('a.propertyLink')
    return await page.waitForSelector('span[href="#property_1"]')
  })

  it('dropdown is correctly populated', async () => {
    expect.assertions(3)
    const propTypeSel = 'select[name="type"][ng-model="propertyTemplate.type"]'
    await expect_value_in_sel_textContent(`${propTypeSel} > option:nth-child(1)`, 'literal')
    await expect_value_in_sel_textContent(`${propTypeSel} > option:nth-child(2)`, 'resource')
    await expect_value_in_sel_textContent(`${propTypeSel} > option:nth-child(3)`, 'lookup')
  })

  // it('can select a type in dropdown', () => {
  //   // TODO: write this test
  // })
})

async function expect_value_in_sel_textContent(sel, value) {
  await page.waitForSelector(sel)
  const sel_text = await page.$eval(sel, e => e.textContent)
  return expect(sel_text).toBe(value)
}
