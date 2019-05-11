// Copyright 2018 Stanford University see Apache2.txt for license

describe('Sinopia Profile Editor Homepage', () => {

  beforeAll(async () => {
    return await page.goto('http://127.0.0.1:8000')
  })

  it('redirects to profile/sinopia', async () => {
    expect.assertions(1)
    const new_url = await page.evaluate(() => window.location.href)
    expect(new_url).toBe('http://127.0.0.1:8000/#/profile/sinopia')
  })

  it('website title', async () => {
    expect.assertions(1)
    await expect_value_in_selector_textContent('title', 'Sinopia Profile Editor')
  })

  describe('header', () => {
    it('title', async() => {
      expect.assertions(2)
      await expect_value_in_selector_textContent('h2.sinopia-subtitle > a:nth-child(1)', 'Sinopia')
      await expect_value_in_selector_textContent('h1.sinopia-title', 'Profile Editor')
    });
    it('links', async () => {
      expect.assertions(2)
      await expect_value_in_selector_textContent('div.sinopia-headerlinks > a:nth-child(1)', 'Linked Data Editor')
      await expect_value_in_selector_textContent('div.sinopia-headerlinks > a:nth-child(2)', 'Help and Resources')
    })
  })

  it('text on page', async () => {
    expect.assertions(1)
    await expect_regex_in_selector_textContent('h3.new-profile-header', /\s*Create a new Profile or Import one from your files\s*$/)
  })

  it('link to create new profile page', async () => {
    expect.assertions(1)
    await expect_regex_in_selector_textContent('a.new-profile[href="#/profile/create/"]', /\s*Create new Profile\s*/)
  })

  it('Import button redirects to profile/create/true', async () => {
    expect.assertions(2)
    const sel = 'a.btn.import-export[ng-click="showImport()"]'
    await expect(page).toClick(sel)
    await page.waitFor(500) // shameless green: it needs more time here; not sure what to wait for
    const new_url = await page.evaluate(() => window.location.href)
    expect(new_url).toBe('http://127.0.0.1:8000/#/profile/create/true')
  })

  it('footer', async () => {
    expect.assertions(3)
    await expect(page).toMatch('funded by the Andrew W. Mellon Foundation')
    await expect_value_in_selector_textContent('div.sinopia-footer > a:nth-child(2)', 'Linked Data for Production 2 (LD4P2)')
    await expect_value_in_selector_textContent('div.sinopia-footer > a:nth-child(3)', 'Creative Commons CC0 1.0 Universal Public Domain Dedication')
  })

  it('loads our angular app', async () => {
    expect.assertions(1)
    await expect_sel_to_exist('html[ng-app="locApp"]')
  })
})

async function expect_sel_to_exist(sel) {
  const sel_text = !!(await page.$(sel))
  expect(sel_text).toEqual(true)
}
async function expect_regex_in_selector_textContent(sel, regex) {
  const sel_text = await page.$eval(sel, e => e.textContent)
  expect(sel_text).toMatch(regex)
}
async function expect_value_in_selector_textContent(sel, value) {
  const sel_text = await page.$eval(sel, e => e.textContent)
  expect(sel_text).toBe(value)
}
