// Copyright 2019 Stanford University see Apache2.txt for license
const pupExpect = require('./jestPuppeteerHelper')

describe('Sinopia Profile Editor Header', () => {

  describe.each`
    pageUrl
    ${'http://127.0.0.1:8000'}
    ${'http://127.0.0.1:8000/#/profile/create/'}
  `('titles and links', ({pageUrl}) => {

    beforeAll(async () => {
      return await page.goto(pageUrl)
    })

    test('h2.sinopia-subtitle contains a link', async () => {
      // FIXME:  would like to show this is execution environment aware,
      //  e.g. await pupExpect.expectSelTextContentToBe('h2.sinopia-subtitle > a[https://development.sinopia.io]', 'Sinopia')
      // (a home page url of https://profile-editor.development.sinopia.io/#/profile/sinopia
      //  would yield link of https://development.sinopia.io )
      //  I was unable to figure out how to set global window.location.host to be in scope for index.html for tests
      expect.assertions(1)
      await pupExpect.expectSelTextContentToBe('h2.sinopia-subtitle > a', 'Sinopia')
    })
    test('h1.sinopia-title', async() => {
      expect.assertions(1)
      await pupExpect.expectSelTextContentToBe('h1.sinopia-title', 'Profile Editor')
    })
    test('link to Linked Data Editor', async () => {
      // FIXME:  would like to show this is execution environment aware,
      //  e.g. const linkedDataEdSel = 'div.sinopia-headertext a[href="https://development.sinopia.io/templates"]'
      // (a home page url of https://profile-editor.development.sinopia.io/#/profile/sinopia
      //  would yield link of https://development.sinopia.io/templates )
      //  I was unable to figure out how to set global window.location.host to be in scope for index.html for tests
      expect.assertions(1)
      const linkedDataEdSel = 'div.sinopia-headertext a[href$="/templates"]'
      await pupExpect.expectSelTextContentToBe(linkedDataEdSel, 'Linked Data Editor')
    })
    test('link to Help and Resources', async () => {
      expect.assertions(1)
      const helpLinkSel = 'div.sinopia-headertext a[onclick="openOffCanvasMenu()"]'
      await pupExpect.expectSelTextContentToBe(helpLinkSel, 'Help and Resources')
      // see off-canvas-menu.test for the appearance and content of the off-canvas menu
    })
  })
})
