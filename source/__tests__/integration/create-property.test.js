// Copyright 2018 Stanford University see Apache2.txt for license

describe('Create profile has properties for resource and templates for property', () => {
  beforeAll(async () => {
    await page.goto('http://127.0.0.1:8000/#/profile/create/')
    page
      .waitForSelector('a#addResource')
      .then(async () => await page.click('a#addResource'))
      .catch(error => console.log(`promise error for addResource link: ${error}`))
    page
      .waitForSelector('a.propertyLink')
      .then(async () => await page.click('a.propertyLink'))
      .catch(error => console.log(`promise error for add property link: ${error}`))
    await page.waitForSelector('span[href="#property_1"]')
  })

  describe('adding a template', () => {
    let template_select_sel = 'select#templateSelect_1_0'
    beforeAll(async () => {
      await page.waitForSelector('span[href="#property_1"]')
      page
        .waitForSelector('a#addTemplate')
        .then(async () => await page.click('a#addTemplate'))
        .catch(error => console.log(`promise error for add template link: ${error}`))
      await page.waitForSelector(template_select_sel)
    })

    it('populates templates (via profiles from versoSpoof)', async () => {
      await page.waitForSelector(template_select_sel)
      const profile_count = await page.$eval(template_select_sel, e => e.length)
      expect(profile_count).toBe(235)
    })
    it('can select a template', async () => {
      await page.waitForSelector(template_select_sel)
      // NOTE: the html always shows the first option selected, though the browser
      //  shows the right thing.  So here we cheat and use indirect checking of attributes
      //  to show a template can be selected
      await expect_sel_to_exist(`${template_select_sel}.ng-pristine`)
      await expect_sel_to_exist(`${template_select_sel} > option[selected="selected"][value="?"]`)
      await page.select(template_select_sel, 'profile:bf2:Form')
      await expect_sel_to_exist(`${template_select_sel}.ng-dirty`)
      await expect_sel_to_exist(`${template_select_sel} > option[selected="selected"][value^="profile:bf2"]`)
    })
  })

  describe('property header appearence', () => {
    it('font-awesome icon class is present', async () => {
      await expect_sel_to_exist(`.fa-caret-right`)
    })
  })
})

describe('property URI is required', () => {
  let profileFormSel = 'form[name="profileForm"]'
  let exportButtonSel = 'a.btn.import-export'

  it('error if exported without property URI', async () => {
    await page.waitFor(1000)
    await expect(page).toFillForm(profileFormSel, {
      id: "my:profile",
      description: "Profile description",
      author: "Me",
      title: "My profile",
      resourceId: "my:resource",
      resourceURI: "http://www.example.com"
    }, 10000)

    await page.click(exportButtonSel)
    let alertBoxSel = '#alertBox > div.modal-dialog > div.modal-content > div.modal-body > p#alert_text'
    await expect_value_in_sel_text(alertBoxSel, 'Parts of the form are invalid')
  })


  it('can be exported with property URI', async () => {
    let data;

    await page.waitFor(1000, {waitUntil: 'networkidle2'})
    await page.$eval(profileFormSel, e => e.reset())

    await expect(page).toFillForm(profileFormSel, {
      id: "my:profile",
      description: "Profile description",
      author: "Me",
      title: "My Profile",
      resourceId: "my:resource",
      resourceURI: "http://www.example.com",
      propertyURI: "http://www.example.org"
    }, 10000)

    await page.waitFor(1000, {waitUntil: 'networkidle2'})
    page.click(exportButtonSel).then(async () => { console.log('Export button clicked') })
        .catch(e => console.log(`failed promise on clicking the Export button: ${e}`))

    await page.waitFor(1000)

    page
      .waitForSelector('a[download="My Profile.json"]')
      .then(
          data = await page.$eval('a[download="My Profile.json"]', e => e.getAttribute('href'))
      )
      .catch(e => console.log(`failed promise on download data link: ${e}`))

    const json = JSON.parse(data.substr(data.indexOf(',') + 1))
    expect(json['Profile']['id']).toBe('my:profile')
    expect(json['Profile']['resourceTemplates'][0]['propertyTemplates'][0]['propertyURI']).toBe('http://www.example.org')
  })
})

async function expect_sel_to_exist(sel) {
  const sel_text = !!(await page.$(sel))
  expect(sel_text).toEqual(true)
}
async function expect_value_in_sel_text(sel, value) {
  const sel_text = await page.$eval(sel, e => e.textContent)
  expect(sel_text).toBe(value)
}
