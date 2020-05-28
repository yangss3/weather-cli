const os = require('os')
const path = require('path')

exports.configFile = path.resolve(os.homedir(), '.weather.config')