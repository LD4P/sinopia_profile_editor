/**
Copyright 2018 The Board of Trustees of the Leland Stanford Junior University

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
**/
describe('Sinopia Profile Editor does not export an invalid Profile', () => {

  beforeAll(async () => {
    await page.goto('http://localhost:8000/#/profile/create/true')
  })

  describe('shows an error message', () => {
    it('modal displayed', async () => {
      await expect(page).toClick('a', { text: 'Export'})
      const sel_text = await page.$eval('#alert_text', e => e.textContent)
      expect(sel_text).toMatch('Parts of the form are invalid')
    })

    it('closes the alert modal', async () => {
      page
        .waitForSelector('#alertClose')
        .then(async () => await page.click('#alertClose'))
        .catch(error => console.log(`promise error for closing alert modal: ${error}`))
    })
  })
})
