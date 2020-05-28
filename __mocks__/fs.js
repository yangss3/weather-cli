const fs = jest.createMockFromModule('fs')

let config

fs.unlinkSync = path => config = undefined

fs.writeFileSync = (path, data, mode) => config = data

fs.readFileSync = (path, mode) => {
  if (config === undefined) throw new Error('config file does not exist')
  return config
}

module.exports = fs