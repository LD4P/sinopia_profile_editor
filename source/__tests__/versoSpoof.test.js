describe('spoofed verso', () => {
  let versoSpoof  = require('../../source/versoSpoof.js')

  describe('profiles', () => {
    it('array of length 30', () => {
      expect(versoSpoof.profiles).toHaveLength(30)
    })
    it('profile has id', () => {
      expect(versoSpoof.profiles[0]['id']).toBe('profile:bf2:AdminMetadata')
    })
    it('profile has name', () => {
      expect(versoSpoof.profiles[0]['name']).toBe('Metadata for BIBFRAME Resources')
    })
    it('profile has type', () => {
      versoSpoof.profiles.forEach(p => {
        expect(p['configType']).toBe('profile')
      })
    })
  })

  describe('vocabularies', () => {
    it('array of length 1', () => {
      expect(versoSpoof.vocabularies).toHaveLength(1)
    })
    it('vocabulary has name', () => {
      expect(versoSpoof.vocabularies[0]['name']).toBe('Languages')
    })
    it('vocabulary has type', () => {
      expect(versoSpoof.vocabularies[0]['configType']).toBe('vocabulary')
    })
    it('vocabulary has no id', () => {
      expect(versoSpoof.vocabularies[0]['id']).toBeUndefined()
    })
  })

  describe('ontologies', () => {
    it('array of length 5', () => {
      expect(versoSpoof.ontologies).toHaveLength(5)
    })
    it('ontology has name', () => {
      expect(versoSpoof.ontologies[0]['name']).toBe('Bibframe-ontology')
    })
    it('ontology has type', () => {
      versoSpoof.ontologies.forEach(ont => {
        expect(ont['configType']).toBe('ontology')
      })
    })
    it('ontology has no id', () => {
      expect(versoSpoof.ontologies[0]['id']).toBeUndefined()
    })
  })
})
