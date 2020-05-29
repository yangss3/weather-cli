const fs = require('fs')

module.exports = listKey => {
  try {
    const data = fs.readFileSync(require('./utils').configFile, 'utf8')
    const config = JSON.parse(data)
    if (['apiKey', 'apikey', 'api-key', 'api_key'].includes(listKey)) {
      listKey = 'apiKey'
    }
    if (listKey === true || listKey === 'all') {
      for (const key in config) {
        console.log(`${key}: ${config[key]}`)
      }
    } else if (listKey in config) {
      console.log(`${listKey}:  ${config[listKey]}`)
    }
  } catch (error) {}
}
