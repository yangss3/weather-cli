const os = require('os')
const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const configFile = path.resolve(os.homedir(), '.weather.config')

function validateCity(city) {
  if (!city) {
    console.log(chalk.redBright(`请指定要查询的城市`))
    console.log(
      chalk.redBright(
        `可以通过命令 ${chalk.yellowBright(
          'weather config -c[--city] <city-name>'
        )} 全局配置默认城市`
      )
    )
    console.log(
      chalk.redBright(
        `或直接在 ${chalk.yellowBright('weather [forecast]')} 命令后面指定城市名`
      )
    )
    return false
  }
  return true
}

function getParams(city) {
  let apiKey = 'S4_rNfrdag5WN7uxy'
  let location = city
  let unit = 'c'
  let language = 'zh-Hans'

  try {
    const data = fs.readFileSync(configFile, 'utf8')
    const config = JSON.parse(data)

    const lang = config.lang && config.lang.toLowerCase()
    if (['zh-hans', 'zh', 'zh-cn'].includes(lang)) {
      config.lang = 'zh-Hans'
    }

    apiKey = config.apiKey || apiKey
    location = location || config.city
    unit = config.unit || unit
    language = config.lang || language
  } catch (error) { }

  return {
    apiKey,
    location,
    unit,
    language
  }
}

function requestErrorHandler(err) {
  if (err.response) {
    const { status, data } = err.response
    switch (data.status_code) {
      case 'AP010003':
        console.log(
          chalk.redBright(
            `无效的 API key，请提供正确的 API key。\n相关信息请看 ${chalk.yellow(
              'https://www.seniverse.com/api'
            )} `
          )
        )
        break
      case 'AP010006':
        console.log(
          chalk.redBright(
            `当前的 API key 为免费版，没有权限查询该城市信息。请更换城市或提供付费版的 API key。\n相关信息请看 ${chalk.yellow(
              'https://www.seniverse.com/api'
            )} `
          )
        )
        break
      case 'AP010010':
        console.log(chalk.redBright(`找不到指定的城市，请更换其它城市名`))
        break
      default:
        console.log(chalk.redBright(data.status))
    }
  } else {
    console.log(chalk.redBright(`Please check your network connection.`))
  }
}

module.exports = {
  configFile,
  validateCity,
  getParams,
  requestErrorHandler
}
