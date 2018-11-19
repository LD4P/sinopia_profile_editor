// Copyright 2018 Stanford University see Apache2.txt for license

describe('Sinopia Profile Editor Homepage', () => {

  beforeAll(async () => {
    await page.goto('http://127.0.0.1:8000')
  })

  afterAll(async () =>{
    await page.waitFor(1000)
  })

  it('redirects to profile/sinopia', async () => {
    const new_url = await page.evaluate(() => window.location.href)
    expect(new_url).toBe('http://127.0.0.1:8000/#/profile/sinopia')
  })

  it('website title', async () => {
    await expect_value_in_selector_textContent('title', 'Sinopia Profile Editor')
  })

  describe('header', () => {
    it('image', async() => {
      await expect_sel_to_exist('div.sinopia-headertext > img[src="assets/images/sinopia_profile_headertext.png"]')
    });
    it('links', async () => {
      await expect_value_in_selector_textContent('div.sinopia-headerlinks > a:nth-child(1)', 'Bibliographic Editor')
      await expect_value_in_selector_textContent('div.sinopia-headerlinks > a:nth-child(2)', 'Help and Resources')
    })
  })

  it('text on page', async () => {
    await expect_regex_in_selector_textContent('h3.new-profile-header', /\s*Create a new Profile or Import one from your files\s*$/)
  })

  it('link to create new profile page', async () => {
    await expect_regex_in_selector_textContent('a.new-profile[href="#/profile/create/"]', /\s*Create new Profile\s*/)
  })

  it('Import button redirects to profile/create/true', async () => {
    const sel = 'a.btn.import-export[ng-click="showImport()"]'
    page
      .waitForSelector(sel)
      .then(async () => await page.click(sel))
      .catch(error => console.log(`promise error for clicking import button: ${error}`))
    await page.waitForNavigation({waitUntil: 'load'})
    const new_url = await page.evaluate(() => window.location.href)
    expect(new_url).toBe('http://127.0.0.1:8000/#/profile/create/true')
  })

  it('footer', async () => {
    await expect(page).toMatch('funded by the Andrew W. Mellon Foundation')
    await expect_value_in_selector_textContent('div.sinopia-footer > a', 'Linked Data for Production 2 (LD4P2)')
    await expect_value_in_selector_textContent('div.sinopia-footer > a:nth-child(3)', 'Creative Commons Attribution 4.0 International License')
  })

  it('loads our angular app', async () => {
    expect_sel_to_exist('html[ng-app="locApp"]')
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
