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
    it('sinopia-subtitle', async () => {
      // FIXME:  would like to show this is execution environment aware,
      //  e.g. a home page url of https://profile-editor.development.sinopia.io/#/profile/sinopia
      //  would yield https://development.sinopia.io
      //  I was unable to figure out how to set window.location.host global so it would
      //  be set before index.html computed the link
      expect.assertions(1)
      await pupExpect.expectSelTextContentToBe('h2.sinopia-subtitle > a', 'Sinopia')
    })
    it('sinopia-title', async() => {
      expect.assertions(1)
      await pupExpect.expectSelTextContentToBe('h1.sinopia-title', 'Profile Editor')
    })
    it('link to Linked Data Editor', async () => {
      // FIXME:  would like to show this is execution environment aware,
      //  e.g. a home page url of https://profile-editor.development.sinopia.io/#/profile/sinopia
      //  would yield https://development.sinopia.io/templates
      //  I was unable to figure out how to set global window.location.host value in tests so it would
      //  be used by index.html to compute the link
      expect.assertions(1)
      const linkedDataEdSel = 'div.sinopia-headertext a[href$="/templates"]'
      await pupExpect.expectSelTextContentToBe(linkedDataEdSel, 'Linked Data Editor')
    })
    it('link to help and resources', async () => {
      expect.assertions(1)
      const helpLinkSel = 'div.sinopia-headertext a[onclick="openOffCanvasMenu()"]'
      await pupExpect.expectSelTextContentToBe(helpLinkSel, 'Help and Resources')
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
