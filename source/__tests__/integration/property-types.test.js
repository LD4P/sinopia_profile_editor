// Copyright 2018 Stanford University see Apache2.txt for license
const pupExpect = require('./jestPuppeteerHelper')

describe('Type of Property in Resource in Profile', () => {
  beforeEach(async () => {
    await page.goto('http://127.0.0.1:8000/#/profile/create/')
    await page.waitForSelector('a#addResource')
    await page.click('a#addResource')
    await page.waitForSelector('a.propertyLink')
    await page.click('a.propertyLink')
    await page.waitForSelector('span[href="#property_1"]')
  })

  it('dropdown is correctly populated', async () => {
    expect.assertions(3)
    const propTypeSel = 'select[name="type"][ng-model="propertyTemplate.type"]'
    await pupExpect.expectSelTextContentToBe(`${propTypeSel} > option:nth-child(1)`, 'literal')
    await pupExpect.expectSelTextContentToBe(`${propTypeSel} > option:nth-child(2)`, 'resource')
    await pupExpect.expectSelTextContentToBe(`${propTypeSel} > option:nth-child(3)`, 'lookup')
  })

  // it('can select a type in dropdown', () => {
  //   // TODO: write this test
  // })
})
