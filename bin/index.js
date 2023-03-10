#! node
const chalk = require('chalk')
const program = require('commander');
const createOrm = require('../lib/orm')


program
  // 配置脚手架名称
  .name('clilighth')
  // 配置命令格式
  .usage(`<command> [option]`)
  // 配置版本号
  .version(require('../package.json').version);

// 给提示增加
program.on('--help', () => {
  console.log();
  console.log(
    `Run ${chalk.cyan(
      'clilighth <command> --help'
    )} for detailed usage of given command.
  `)
});


program
  .version(require('../package').version, '-v, --version')
  .command('new <project-name>')
  .description('new orm project')
  .option('-f, --force', 'overwrite target directory if it exists')
  .action((projectName, options) => {
    // 引入create模块，并传入参数
    console.log("projectname", projectName);
    createOrm(projectName, options);
  })

program.parse(process.argv)


