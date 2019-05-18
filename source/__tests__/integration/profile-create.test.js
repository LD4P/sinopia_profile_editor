// Copyright 2018 Stanford University see Apache2.txt for license
const pupExpect = require('./jestPuppeteerHelper')

describe('Sinopia Profile Editor Create Page', () => {
  beforeAll(async () => {
    return await page.goto('http://127.0.0.1:8000/#/profile/create/')
  })

  it('text on page', async () => {
    expect.assertions(1)
    await pupExpect.expectSelTextContentToMatch('h3.portlet-title', /Create a new Profile\s*\*Required Fields$/m)
  })
  it('profile metadata span', async() => {
    expect.assertions(1)
    await pupExpect.expectSelTextContentToMatch('h4.profile-header > span#profileBanner.accordion-toggle > span.ng-scope', 'Profile')
  })

  it('header links', async () => {
    expect.assertions(2)
    await pupExpect.expectSelTextContentToBe('div.sinopia-headerlinks > a:nth-child(1)', 'Linked Data Editor')
    await pupExpect.expectSelTextContentToBe('div.sinopia-headerlinks > a:nth-child(2)', 'Help and Resources')
  })

  it('footer', async () => {
    expect.assertions(2)
    await expect(page).toMatch('funded by the Andrew W. Mellon Foundation')
    await pupExpect.expectSelTextContentToBe('div.sinopia-footer > a:nth-child(2)', 'Linked Data for Production 2 (LD4P2)')
  })
})
