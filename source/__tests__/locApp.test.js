/*global page*/

describe('Sinopia Profile Editor Homepage', () => {

  beforeAll(async () => {
    await page.goto('http://127.0.0.1:8000')
  })

  it('displays "Profiles on Server" text on page', async () => {
    await expect(page).toMatch('Profiles on Server')
  })

});
