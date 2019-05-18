// Copyright 2018 Stanford University see Apache2.txt for license
const pupExpect = require('./jestPuppeteerHelper')

describe('Sinopia Profile Editor Homepage', () => {

  beforeAll(async () => {
    return await page.goto('http://127.0.0.1:8000')
  })

  it('redirects to profile/sinopia', async () => {
    expect.assertions(1)
    const expectedUrl = 'http://127.0.0.1:8000/#/profile/sinopia'
    await browser.waitForTarget(target => target.url() === expectedUrl)
    const receivedUrl = await page.evaluate(() => window.location.href)
    expect(receivedUrl).toBe(expectedUrl)
  })

  it('website title', async () => {
    expect.assertions(1)
    await pupExpect.expectSelTextContentToBe('title', 'Sinopia Profile Editor')
  })

  describe('header', () => {
    it('title', async() => {
      expect.assertions(2)
      await pupExpect.expectSelTextContentToBe('h2.sinopia-subtitle > a:nth-child(1)', 'Sinopia')
      await pupExpect.expectSelTextContentToBe('h1.sinopia-title', 'Profile Editor')
    });
    it('links', async () => {
      expect.assertions(2)
      await pupExpect.expectSelTextContentToBe('div.sinopia-headerlinks > a:nth-child(1)', 'Linked Data Editor')
      await pupExpect.expectSelTextContentToBe('div.sinopia-headerlinks > a:nth-child(2)', 'Help and Resources')
    })
  })

  it('text on page', async () => {
    expect.assertions(1)
    await pupExpect.expectSelTextContentToMatch('h3.new-profile-header', /\s*Create a new Profile or Import one from your files\s*$/)
  })

  it('link to create new profile page', async () => {
    expect.assertions(1)
    await pupExpect.expectSelTextContentToMatch('a.new-profile[href="#/profile/create/"]', /\s*Create new Profile\s*/)
  })

  it('Import button redirects to profile/create/true', async () => {
    expect.assertions(2)
    const sel = 'a.btn.import-export[ng-click="showImport()"]'
    await expect(page).toClick(sel)
    const receivedUrl = await page.evaluate(() => window.location.href)
    expect(receivedUrl).toBe('http://127.0.0.1:8000/#/profile/create/true')
  })

  it('footer', async () => {
    expect.assertions(3)
    await expect(page).toMatch('funded by the Andrew W. Mellon Foundation')
    await pupExpect.expectSelTextContentToBe('div.sinopia-footer > a:nth-child(2)', 'Linked Data for Production 2 (LD4P2)')
    await pupExpect.expectSelTextContentToBe('div.sinopia-footer > a:nth-child(3)', 'Creative Commons CC0 1.0 Universal Public Domain Dedication')
  })

  it('loads our angular app', async () => {
    expect.assertions(1)
    await pupExpect.expectSelToExist('html[ng-app="locApp"]')
  })
})
