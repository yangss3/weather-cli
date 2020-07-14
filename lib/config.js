const fs = require('fs')
const { configFile } = require('./utils')

function setDefaultConfig(config) {
  if (config.reset) {
    try {
      fs.unlinkSync(configFile)
    } catch (error) {}
  } else {
    try {
      const data = fs.readFileSync(configFile, 'utf8')
      if (data) {
        const oldConfig = JSON.parse(data)
        fs.writeFileSync(
          configFile,
          JSON.stringify({ ...oldConfig, ...config }),
          'utf8'
        )
      }
    } catch (error) {
      fs.writeFileSync(configFile, JSON.stringify(config), 'utf8')
    }
  }
}

module.exports = setDefaultConfig
