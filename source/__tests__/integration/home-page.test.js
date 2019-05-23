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

  // header tests in header.test file

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
    const expectedUrl = 'http://127.0.0.1:8000/#/profile/create/true'
    await browser.waitForTarget(target => target.url() === expectedUrl)
    const receivedUrl = await page.evaluate(() => window.location.href)
    expect(receivedUrl).toBe(expectedUrl)
  })

  // footer tests in footer.test file

  it('loads our angular app', async () => {
    expect.assertions(1)
    await expect(page).toMatchElement('html[ng-app="locApp"]')
  })
})
