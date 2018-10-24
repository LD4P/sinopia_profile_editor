describe('Sinopia Profile Adherence Field', () => {

  beforeAll(async () => {
    await page.goto('http://localhost:8000/#/profile/create/').then({waitUntil: 'networkidle2'})
  })
  
  it('finds in the profile', async () => {
    const label = await page.$eval('#profile > div > table > tbody > tr:nth-child(4) > td:nth-child(1) > label', e => e.textContent)
    await expect(label).toMatch(/Adherence/)
    const field = await page.$eval('#profile > div > table > tbody > tr:nth-child(4) > td:nth-child(2) > input', e => e)
    await expect(field)
  })

  it('mouse hover displays help', async () => {
    const popover = await page.$eval('#profile > div > table > tbody > tr:nth-child(4) > td:nth-child(2) > input', e => e.getAttribute('popover'))
    await expect(popover).toMatch(/What rules this profile follows/)
  })
})
