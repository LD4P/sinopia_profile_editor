/*global page*/

describe('Sinopia Profile Editor Homepage', () => {

    beforeAll(async () => {
        await page.goto('http://127.0.0.1:8000')
    })

    it('has a link to the create new profile page', async () => {
        const link = await page.$eval('.new-profile', e => e.getAttribute('href'))
        expect(link).toMatch(/#\/profile\/create/)
    })

    it('loads our angular app', async () => {
        const app = await page.$eval('html', e => e.getAttribute('ng-app'))
        expect(app).toMatch(/locApp/)
    })
});
