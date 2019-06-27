// Copyright 2019 Stanford University see Apache2.txt for license

describe('Off-canvas Help Menu', () => {
  const helpLinkSel = 'div.sinopia-headertext a[onclick="openOffCanvasMenu()"]'
  const menuIdSel = "#offCanvasMenu"

  beforeAll(async () => {
    // NOTE:  tried to test both of these urls with describe.table approach and couldn't get it to work
    // await page.goto('http://127.0.0.1:8000')
    await page.goto('http://127.0.0.1:8000/#/profile/create/')
    await page.waitForSelector(helpLinkSel)
    await page.click(helpLinkSel)
    await page.waitFor(500, {waitUntil: 'networkidle0'}) // it gets content from sinopia github pages
    await page.waitForSelector(menuIdSel, {visible: true})
  })

  // Note:  Help and Resources link is tested in header.test

  test('width is 300px', async () => {
    expect.assertions(1)
    const offCanvasMenuWidth = await page.$eval(menuIdSel, e => e.style.width)
    expect(offCanvasMenuWidth).toBe("300px")
  })

  test('content is from Sinopia github pages', async () => {
    // text should match https://ld4p.github.io/sinopia/help_and_resources/menu.html
    expect.assertions(9)
    const menuElementHandle = await expect(page).toMatchElement(menuIdSel)
    await expect(menuElementHandle).toMatch('Help')
    await expect(menuElementHandle).toMatchElement('a[href="https://listserv.loc.gov/cgi-bin/wa?A0=PCCTG1"]', { text: 'Cataloger listserv' })
    await expect(menuElementHandle).toMatch('Training Resources')
    await expect(menuElementHandle).toMatchElement('a[href="https://github.com/LD4P/sinopia/wiki/Training-Videos-based-on-Library-of-Congress-tools"]', { text: 'LC Training Modules' })
    await expect(menuElementHandle).toMatch('External Identifier Sources and Vocabularies')
    await expect(menuElementHandle).toMatchElement('a[href="https://viaf.org"]', { text: 'VIAF'} )
    await expect(menuElementHandle).toMatch('Other External Resources')
    await expect(menuElementHandle).toMatchElement('a[href="https://translate.google.com/"]', { text: 'Google Translate' })
  })
})
