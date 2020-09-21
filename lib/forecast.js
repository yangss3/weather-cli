const qs = require('querystring')
const chalk = require('chalk')
const axios = require('axios')
const Table = require('cli-table3')
const { validateCity, getParams, requestErrorHandler } = require('./utils')

const API = 'https://api.seniverse.com/v3/weather'

module.exports = function (city, { start = 1, days = 2 }) {
  const { apiKey: key, location, unit: units, language } = getParams(city)
  if (validateCity(location)) {
    axios
      .get(
        `${API}/daily.json?${qs.stringify({
          key,
          location,
          units,
          language,
          start,
          days
        })}`
      )
      .then(res => {
        const { location, daily } = res.data.results[0]
        const head =
          language === 'en'
            ? ['Date', 'Description', 'Temperature']
            : ['日期', '描述', '气温']

        const weatherData = daily.map(d => {
          return [
            d.date,
            d.text_day === d.text_night
              ? d.text_day
              : `${d.text_day} ~ ${d.text_night}`,
            `${d.low} ~ ${d.high}`
          ]
        })

        const table = new Table({
          head: head.map(h => chalk.blueBright(h))
        })
        table.push(...weatherData)

        console.log(chalk.yellowBright(`\n ${location.name}:`))
        console.log(table.toString())
        
        if (daily.length < days) {
          console.log(chalk.redBright(
            `\n(提示: 当前的 API key 为免费版，只能预测后两天的天气情况。要查询更多日期，请提供付费版的 API key。 \n相关信息请看 ${chalk.yellow(
              'https://www.seniverse.com/api'
            )})`
          ))
        }
      })
      .catch(requestErrorHandler)
  }
}
