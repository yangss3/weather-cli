#!/usr/bin/env node
const { Command } = require('commander');
const program = new Command();
const enhanceErrorMessages = require('../lib/enhanceErrorMessages')

program
  .storeOptionsAsProperties(false)
  .version(`weather-cli ${require('../package.json').version}`)
  .name('weather')
  .usage(`[city] | <command> [options]`);

program.arguments('[city]').action((city) => {
  require('../lib/weather')(city);
});

program
  .command('config')
  .description('set default configuration')
  .option('-k, --api-key <api-key>', 'set API key')
  .option('-c, --city <city-name>', 'set city ID')
  .option('-u, --unit <unit>', 'set temperature unit')
  .option('-l, --list [key]', 'list default configuration')
  .action((cmd) => {
    const opts = cmd.opts();
    if (opts.list) {
      require('../lib/list-config')(opts.list);
    } else if (opts.apiKey || opts.city || opts.unit) {
      require('../lib/config')(opts);
    } else {
      cmd.help();
    }
  });

enhanceErrorMessages()

program.parse(process.argv);

