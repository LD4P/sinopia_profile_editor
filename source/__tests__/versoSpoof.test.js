// Copyright 2018 Stanford University see Apache2.txt for license

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

  describe('ontologies', () => {
    it('array of length 5', () => {
      expect(versoSpoof.ontologies).toHaveLength(5)
    })
    it('ontology has id', () => {
      expect(versoSpoof.ontologies[0]['id']).toBe('Bibframe-ontology')
    })
    it('ontology has name', () => {
      expect(versoSpoof.ontologies[0]['name']).toBe('Bibframe-ontology')
    })
    it('ontology has type', () => {
      versoSpoof.ontologies.forEach(ont => {
        expect(ont['configType']).toBe('ontology')
      })
    })
  })

  describe('owlOntUrlToXmlMappings', () => {
    it('array of length 5', () => {
      expect(versoSpoof.owlOntUrlToXmlMappings).toHaveLength(5)
    })
    it('mapping has url', () => {
      expect(versoSpoof.owlOntUrlToXmlMappings[0]['url']).toBe('http://id.loc.gov/ontologies/bibframe.rdf')
    })
    it('mapping has xml', () => {
      expect(versoSpoof.owlOntUrlToXmlMappings[0]['xml']).toBeDefined()
    })
  })

  describe('propertyTypes', () => {
    it('array of length 1', () => {
      expect(versoSpoof.propertyTypes).toHaveLength(1)
    })
    it('propertyType has name', () => {
      expect(versoSpoof.propertyTypes[0]['name']).toBe('propertyTypes')
    })
    it('propertyType has type', () => {
      expect(versoSpoof.propertyTypes[0]['configType']).toBe('propertySettings')
    })
    it('propertyType has json', () => {
      expect(versoSpoof.propertyTypes[0]['json']).toEqual(['literal', 'resource', 'lookup'])
    })
    it('propertyType has no id', () => {
      expect(versoSpoof.propertyTypes[0]['id']).toBeUndefined()
    })
  })
})
