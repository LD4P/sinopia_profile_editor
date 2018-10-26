describe('spoofed verso', () => {
  let verso_spoof  = require('../../source/versoSpoof.js')

  describe('profiles', () => {
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
  })

  describe('vocabularies', () => {
    it('array of length 1', () => {
      expect(verso_spoof.vocabularies).toHaveLength(1)
    })
    it('vocabulary has name', () => {
      expect(verso_spoof.vocabularies[0]['name']).toBe('Languages')
    })
    it('vocabulary has type', () => {
      expect(verso_spoof.vocabularies[0]['configType']).toBe('vocabulary')
    })
    it('vocabulary has no id', () => {
      expect(verso_spoof.vocabularies[0]['id']).toBeUndefined()
    })
  })
})
