// Copyright 2018 Stanford University see Apache2.txt for license

describe('Sinopia Profile Editor Create Page', () => {
  beforeAll(async () => {
    return await page.goto('http://127.0.0.1:8000/#/profile/create/')
  })

  it('text on page', async () => {
    expect.assertions(1)
    await expect_regex_in_selector_textContent('h3.portlet-title', /Create a new Profile\s*\*Required Fields$/)
  })
  it('profile metadata span', async() => {
    expect.assertions(1)
    await expect_regex_in_selector_textContent('h4.profile-header > span#profileBanner.accordion-toggle > span.ng-scope', 'Profile')
  })

  it('header links', async () => {
    expect.assertions(2)
    await expect_value_in_selector_textContent('div.sinopia-headerlinks > a:nth-child(1)', 'Linked Data Editor')
    await expect_value_in_selector_textContent('div.sinopia-headerlinks > a:nth-child(2)', 'Help and Resources')
  })

  it('footer', async () => {
    expect.assertions(2)
    await expect(page).toMatch('funded by the Andrew W. Mellon Foundation')
    await expect_value_in_selector_textContent('div.sinopia-footer > a:nth-child(2)', 'Linked Data for Production 2 (LD4P2)')
  })
})

async function expect_regex_in_selector_textContent(sel, regex) {
  await page.waitForSelector(sel)
  const sel_text = await page.$eval(sel, e => e.textContent)
  const strippedTextContent = sel_text.replace(/\n+/g,' ').trim()
  return expect(strippedTextContent).toMatch(regex)
}
async function expect_value_in_selector_textContent(sel, value) {
  await page.waitForSelector(sel)
  const sel_text = await page.$eval(sel, e => e.textContent)
  return expect(sel_text).toBe(value)
}
