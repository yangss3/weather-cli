const setDefaultConfig = require('../lib/config')
const fs = require('fs')
const { configFile } = require('../lib/utils')

describe('initial config', () => {
  beforeEach(() => {
    fs.unlinkSync(configFile)
  })

  test('configure apiKey', () => {
    const config = { apiKey: '123456789' }
    setDefaultConfig(config)
    const res = JSON.parse(fs.readFileSync(configFile, 'utf8'))
    expect(res).toEqual(config)
  })

  test('configure city', () => {
    const config = { city: 'shanghai' }
    setDefaultConfig(config)
    const res = JSON.parse(fs.readFileSync(configFile, 'utf8'))
    expect(res).toEqual(config)
  })

  test('configure unit', () => {
    const config = { unit: 'metric' }
    setDefaultConfig(config)
    const res = JSON.parse(fs.readFileSync(configFile, 'utf8'))
    expect(res).toEqual(config)
  })

  test('configure apiKey, city, unit', () => {
    const config = { apiKey: '123456789', city: 'shanghai', unit: 'metric' }
    setDefaultConfig(config)
    const res = JSON.parse(fs.readFileSync(configFile, 'utf8'))
    expect(res).toEqual(config)
  })
})

describe('update config', () => {
  beforeAll(() => {
    fs.unlinkSync(configFile)
  })

  const initConfig = {
    apiKey: '123456789',
    city: 'shanghai',
    unit: 'metric'
  }

  test('initial apiKey, city, unit', () => {
    setDefaultConfig(initConfig)
    const res = JSON.parse(fs.readFileSync(configFile, 'utf8'))
    expect(res).toEqual(initConfig)
  })

  test('update apiKey', () => {
    const config = { apiKey: '987654321' }
    setDefaultConfig(config)
    const res = JSON.parse(fs.readFileSync(configFile, 'utf8'))
    expect(res.apiKey).toBe('987654321')
    expect(res.city).toBe('shanghai')
    expect(res.unit).toBe('metric')
  })

  test('update city', () => {
    const config = { city: 'chongqing' }
    setDefaultConfig(config)
    const res = JSON.parse(fs.readFileSync(configFile, 'utf8'))
    expect(res.apiKey).toBe('987654321')
    expect(res.city).toBe('chongqing')
    expect(res.unit).toBe('metric')
  })

  test('update unit', () => {
    const config = { unit: 'FF' }
    setDefaultConfig(config)
    const res = JSON.parse(fs.readFileSync(configFile, 'utf8'))
    expect(res.apiKey).toBe('987654321')
    expect(res.city).toBe('chongqing')
    expect(res.unit).toBe('FF')
  })

  test('update city, unit', () => {
    const config = { city: 'foshan', unit: 'imperial' }
    setDefaultConfig(config)
    const res = JSON.parse(fs.readFileSync(configFile, 'utf8'))
    expect(res.apiKey).toBe('987654321')
    expect(res.city).toBe('foshan')
    expect(res.unit).toBe('imperial')
  })
})

