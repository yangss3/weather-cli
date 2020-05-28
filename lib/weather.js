const fs = require('fs');
const chalk = require('chalk');
const axios = require('axios');
const Table = require('cli-table3')
const { configFile } = require('./utils')
const API = 'https://api.openweathermap.org/data/2.5/weather';

function validateCity(city) {
  if (!city) {
    console.log(chalk.red(`You haven't specify the city`));
    console.log(
      chalk.red(
        `you can configure it globally by ${chalk.yellowBright(
          'weather config -c[--city] <city-name>'
        )}`
      )
    );
    console.log(
      chalk.red(
        `or specity the city name followed ${chalk.yellowBright('weather')} command`
      )
    );
    return false;
  }
  return true;
}

function errorHandler(err) {
  if (err.response.data) {
    const { cod, message } = err.response.data
    switch (cod.toString()) {
      case '401':
        console.log(chalk.red(`Invalid API key. Please see http://openweathermap.org/api_keys for more info.`))
        break
      case '404':
        console.log(chalk.red(`City not found. Please check your city's name or change to another one.`))
        break
      default: console.log(chalk.red(message))
    }
  }
}

module.exports = function (cityName) {
  fs.readFile(configFile, 'utf8', (err, data) => {
    let apiKey = '5f586d510721537bd49271a48768cd9c'
    let city = cityName
    let unit = 'metric'
    if (!err) { // config file exists
      const config = JSON.parse(data);
      apiKey = config.apiKey || apiKey
      city = city || config.city
      unit = config.unit || unit
    }
    if (validateCity(city)) {
      axios
        .get(`${API}?q=${city}&units=${unit}&appid=${apiKey}`)
        .then((res) => {
          const table = new Table({
            head: [chalk.blue('City'), chalk.blue('Description'), chalk.blue('Temperature')]
          })
          const name = `${res.data.name} (${res.data.sys.country})`
          const description = res.data.weather[0].description
          const { temp, temp_min, temp_max } = res.data.main
          const temperature = `${temp} [${temp_min}, ${temp_max}]`
          table.push(
            [name, description, temperature]
          )
          console.log(table.toString())
        }).catch(errorHandler);
    }
  });
};
