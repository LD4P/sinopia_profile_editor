// Copyright 2019 Stanford University see Apache2.txt for license
describe('Sinopia Profile Editor Footer', () => {

  describe.each`
    pageUrl
    ${'http://127.0.0.1:8000'}
    ${'http://127.0.0.1:8000/#/profile/create/'}
  `('header titles and links', ({pageUrl}) => {

    beforeAll(async () => {
      await page.goto(pageUrl)
    })

    test('funding statement', async () => {
      expect.assertions(1)
      await expect(page).toMatch('funded by the Andrew W. Mellon Foundation')
    })

    test('LD4P2 link', async () => {
      expect.assertions(1)
      const linkSel = 'div.sinopia-footer > a[href="http://www.ld4p.org"]'
      await expect(page).toMatchElement(linkSel, { text: 'Linked Data for Production 2 (LD4P2)' })
    })

    test('license link',async () => {
      expect.assertions(1)
      const linkSel = 'div.sinopia-footer > a[href="https://creativecommons.org/publicdomain/zero/1.0/"]'
      await expect(page).toMatchElement(linkSel, { text: 'Creative Commons CC0 1.0 Universal Public Domain Dedication' })
    })
  })
})
