// Copyright 2018 Stanford University see Apache2.txt for license

const path = require('path')

describe('Sinopia Profile Editor Create Page', () => {
  describe('Upload dialog not showing', () => {
    beforeAll(async () => {
      await page.goto('http://127.0.0.1:8000/#/profile/create/')
    })

    it('text on page', async () => {
      await expect_regex_in_selector_textContent('h3.portlet-title', /Create a new Profile\s*\*Required Fields$/)
    })
    it('profile metadata span', async() => {
      await expect_regex_in_selector_textContent('h4.profile-header > span#profileBanner.accordion-toggle > span.ng-scope', 'Profile')
    });

    describe('header', () => {
      it('image', async() => {
        await expect_sel_to_exist('div.sinopia-headertext > img[src="assets/images/sinopia_profile_headertext.png"]')
      });
      it('links', async () => {
        await expect_value_in_selector_textContent('div.sinopia-headerlinks > a:nth-child(1)', 'Bibliographic Editor')
        await expect_value_in_selector_textContent('div.sinopia-headerlinks > a:nth-child(2)', 'Help and Resources')
      })
    })
    it('footer', async () => {
      await expect(page).toMatch('funded by the Andrew W. Mellon Foundation')
      await expect_value_in_selector_textContent('div.sinopia-footer > a', 'Linked Data for Production 2 (LD4P2)')
    })
  })
})

async function expect_sel_to_exist(sel) {
  await page.waitForSelector(sel)
  const sel_text = !!(await page.$(sel))
  expect(sel_text).toEqual(true)
}
async function expect_regex_in_selector_textContent(sel, regex) {
  await page.waitForSelector(sel)
  const sel_text = await page.$eval(sel, e => e.textContent)
  const strippedTextContent = sel_text.replace(/\n+/g,' ').trim()
  expect(strippedTextContent).toMatch(regex)
}
async function expect_value_in_selector_textContent(sel, value) {
  await page.waitForSelector(sel)
  const sel_text = await page.$eval(sel, e => e.textContent)
  expect(sel_text).toBe(value)
}
