async function expectSelTextContentToMatch(sel, expected) {
  await page.waitForSelector(sel)
  const textContent = await page.$eval(sel, e => e.textContent)
  return expect(textContent).toMatch(expected)
}
async function expectSelTextContentNotToMatch(sel, expected) {
  const textContent = await page.$eval(sel, e => e.textContent)
  return expect(textContent).not.toMatch(expected)
}
async function expectSelTextContentTrimmedToMatch(sel, expected) {
  await page.waitForSelector(sel)
  const textContent = await page.$eval(sel, e => e.textContent)
  return expect(textContent.trim()).toMatch(expected)
}
async function expectSelValueToBe(sel, expected) {
  await page.waitForSelector(sel)
  const value = await page.$eval(sel, e => e.value)
  return expect(value).toBe(expected)
}
async function expectSelTextContentToBe(sel, expected) {
  await page.waitForSelector(sel)
  const textContent = await page.$eval(sel, e => e.textContent)
  return expect(textContent).toBe(expected)
}
async function expectSelTextContentNotToBe(sel, value) {
  await page.waitForSelector(sel)
  const textContent = await page.$eval(sel, e => e.textContent)
  return expect(textContent.trim()).not.toBe(value)
}
async function expectSelTextContentTrimmedToBe(sel, expected) {
  await page.waitForSelector(sel)
  const textContent = await page.$eval(sel, e => e.textContent)
  return expect(textContent.trim()).toBe(expected)
}
async function expectSelToExist(sel) {
  await page.waitForSelector(sel)
  const selector = !!(await page.$(sel))
  return expect(selector).toEqual(true)
}
async function expectSelNotToExist(sel) {
  const selector = !!(await page.$(sel))
  return expect(selector).toEqual(false)
}

module.exports = {
  expectSelTextContentToMatch,
  expectSelTextContentNotToMatch,
  expectSelTextContentTrimmedToMatch,
  expectSelValueToBe,
  expectSelTextContentToBe,
  expectSelTextContentNotToBe,
  expectSelTextContentTrimmedToBe,
  expectSelToExist,
  expectSelNotToExist
}
