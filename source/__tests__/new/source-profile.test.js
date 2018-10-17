describe('Sinopia Profile Source Field', () => {

  beforeAll(async () => {
    await page.goto('http://localhost:8000/#/profile/create/')
  })

  it('finds in the profile', async () => {
    const label = await page.$eval('#profile > div > table > tbody > tr:nth-child(4) > td:nth-child(1) > label', e => e.textContent)
    await expect(label).toMatch(/Source/)
  })
})
