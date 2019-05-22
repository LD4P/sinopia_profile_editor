// Copyright 2019 Stanford University see Apache2.txt for license

describe('Off-canvas Help Menu', () => {
  beforeAll(async () => {
    return await page.goto('http://127.0.0.1:8000/#/profile/create/')
  })

  it('clicking on the Help and Resource menu displays off-canvas menu ', async () => {
    expect.assertions(1)
    const linkSel = 'div.sinopia-headertext a[onclick="openOffCanvasMenu()"]'
    await page.waitForSelector(linkSel)
    await page.click(linkSel)
    await page.waitForSelector("#offCanvasMenu")
    const off_canvas_menu = await page.$eval("#offCanvasMenu", e => e.style.width)
    expect(off_canvas_menu).toBe("300px")
  })
})
