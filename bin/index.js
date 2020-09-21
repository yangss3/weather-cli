#!/usr/bin/env node
const { Command } = require('commander')
const program = new Command()
const enhanceErrorMessages = require('../lib/enhanceErrorMessages')

program
  .storeOptionsAsProperties(false)
  .version(`weather-cli ${require('../package.json').version}`)
  .name('weather')
  .usage(`[city] | <command> [options]`)

program.arguments('[city]').action(city => {
  require('../lib/weather')(city)
})

program
  .command('config')
  .description('配置默认的选项')
  .option('-k, --api-key <api-key>', '设置 API key. (默认使用免费版的 API key)')
  .option('-c, --city <city-name>', '设置要查询的城市 (可以是中文名、拼音、英文名)')
  .option('-u, --unit <unit>', '设置温度单位 (摄氏温度c/华氏温度f，默认c)')
  .option('--lang <language>', '设置显示语言 (中文zh-Hans，英文en，默认中文)')
  .option('-l, --list [key]', '列出默认配置')
  .option('--reset', '重置默认配置')
  .action(cmd => {
    const opts = cmd.opts()
    if (opts.list) {
      require('../lib/list-config')(opts.list)
    } else if (Object.keys(opts).length) {
      require('../lib/config')(opts)
    } else {
      cmd.help()
    }
  })

program
  .command('forecast [city]')
  .description('预测未来的天气情况')
  .option('-s, --start <start>', '预测的起始日期，0 代表当天，1 代表明天，以此类推。默认1')
  .option('-d, --days <days>', '预测的天数，默认2天')
  .action((city, cmd) => {
    require('../lib/forecast')(city, cmd.opts())
  })

enhanceErrorMessages()

program.parse(process.argv)
