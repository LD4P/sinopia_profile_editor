describe('Sinopia Profile Editor Homepage', () => {

  beforeAll(async () => {
    await page.goto('http://127.0.0.1:8000')
    // await page.waitFor(1000)
  })

  it('displays "Profiles on Server" text on page', async () => {
    await expect(page).toMatch('Create a new Profile or Import one from your files')
  })

  it('has the header links', async () => {
    await expect(page).toMatch('a', { text: 'Biblographic Editor' })
    await expect(page).toMatch('a', { text: 'Help and Resources' })
  })

  it('has a link to the create new profile page', async () => {
    const link = await page.$eval('.new-profile', e => e.getAttribute('href'))
    expect(link).toMatch(/#\/profile\/create/)
  })

  it('has the import profile button', async () => {
    await expect(page).toMatch('Import')
  })

  it('has the footer info', async () => {
    await expect(page).toMatch('funded by the Andrew W. Mellon Foundation')
    await expect(page).toMatch('a', { text: 'Linked Data for Production 2 (LD4P2)' })
  })

  it('loads our angular app', async () => {
    const app = await page.$eval('html', e => e.getAttribute('ng-app'))
    expect(app).toMatch(/locApp/)
  })
});
