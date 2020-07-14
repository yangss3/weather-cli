const qs = require('querystring')
const chalk = require('chalk')
const axios = require('axios')
const Table = require('cli-table3')
const { validateCity, getParams, requestErrorHandler } = require('./utils')

const API = 'https://api.seniverse.com/v3/weather'

module.exports = function (city) {
  const { apiKey: key, location, unit: units, language } = getParams(city)

  if (validateCity(location)) {
    axios
      .get(`${API}/now.json?${qs.stringify({ key, location, units, language })}`)
      .then(res => {
        const { location, now } = res.data.results[0]
        const name = `${location.name} (${location.country})`
        const description = now.text
        const temperature = now.temperature

        const head =
          language === 'en'
            ? ['City', 'Description', 'Temperature']
            : ['城市', '描述', '气温']

        const table = new Table({
          head: head.map(h => chalk.blue(h))
        })
        table.push([name, description, temperature])
        console.log(table.toString())
      })
      .catch(requestErrorHandler)
  }
}
