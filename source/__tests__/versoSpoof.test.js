describe('profiles from spoofed verso', () => {
  let verso_spoof  = require('../../source/versoSpoof.js')

  it('array of length 30', () => {
    expect(verso_spoof.profiles).toHaveLength(30)
  })
  it('profile has id', () => {
    expect(verso_spoof.profiles[0]['id']).toBe('profile:bf2:AdminMetadata')
  })
  it('profile has name', () => {
    expect(verso_spoof.profiles[0]['name']).toBe('Metadata for BIBFRAME Resources')
  })
  it('profile has type', () => {
    verso_spoof.profiles.forEach(p => {
      expect(p['configType']).toBe('profile')
    })
  })
});
