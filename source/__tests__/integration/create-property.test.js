describe('Create properties in resource', () => {
  beforeEach(async () => {
    await page.goto('http://127.0.0.1:8000/#/profile/create')
    page
      .waitForSelector('button#addResource')
      .then(async () => await page.click('button#addResource'))
      .catch(error => console.log(`testing promise error for addResource link: ${error}`))
    page
      .waitForSelector('a.propertyLink')
      .then(async () => await page.click('a.propertyLink'))
      .catch(error => console.log(`testing promise error for property link: ${error}`))
    await page.waitForSelector('span[href="#property_1"]')
  })

  // it('gives error if exported without property URI', () => {
  //   // TODO: write this test
  // })
  // it('can be exported with property URI', () => {
  //   // TODO: write this test
  //   // it shouldn't throw an error
  // })

  describe('adding a template', () => {
    let template_select_sel = 'select#templateSelect_1_0'
    beforeEach(async () => {
      page
        .waitForSelector('a#addTemplate')
        .then(async () => await page.click('a#addTemplate'))
        .catch(error => console.log(`testing promise error for add template link: ${error}`))
      await page.waitForSelector(template_select_sel)
    })

    it('loads profiles from versoSpoof', async () => {
      const profile_count = await page.$eval(template_select_sel, e => e.length)
      expect(profile_count).toBe(235)
    })

    it('can select a template', async () => {
      // NOTE: the html doesn't always shows the first option selected, though the browser
      //  shows the right thing.  So here we cheat and use indirect checking of attributes
      //  to show a template can be selected
      await expect_sel_to_exist(`${template_select_sel}.ng-pristine`)
      await expect_sel_to_exist(`${template_select_sel} > option[selected="selected"][value="?"]`)
      const value_selected = 'profile:bf2:Form'
      await page.select(template_select_sel, value_selected)
      await expect_sel_to_exist(`${template_select_sel}.ng-dirty`)
      await expect_sel_to_exist(`${template_select_sel} > option[selected="selected"][value^="profile:bf2"]`)
    })
  })
})

async function expect_sel_to_exist(sel) {
  const sel_text = !!(await page.$(sel))
  expect(sel_text).toEqual(true)
}
