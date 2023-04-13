const path = require("path");
const fs = require("fs-extra");
const chalk = require("chalk");
const Inquirer = require("inquirer");
const util = require("util");
const downloadGitRepo = require("download-git-repo");
const ora = require('ora');
const figlet = require('figlet');

const cwd = process.cwd();

const templateMapList = [
  {
    name: 'react',
    value: "osCaiwei/react-project"
  },
  {
    name: 'angular',
    value: "osCaiwei/angular-project"
  },
  {
    name: 'vue',
    value: 'osCaiwei/vue-project'
  },
  {
    name: 'swaggerjob',
    value: 'HackerXJ/swagger-job'
  },
  {
    name: 'Loopback',
    value: 'HackerXJ/loopback4-api'
  }
]

class Creator {
  constructor(projectName, options) {
    this.projectName = projectName;
    this.options = options;
  }

  /**
   * @description 新建
   */
  async create() {
    const isOverwrite = await this.handleDirectory();
    if (!isOverwrite) return;
    const template = await this.getTemplate();
    await this.downloadTemplate(template);
    this.showTemplateHelp()
    // console.log("todo....");
  }

  /**
   * @description 检查是否有相同目录
   */
  async handleDirectory() {
    const targetDirectory = path.join(cwd, this.projectName);
    if (fs.existsSync(targetDirectory)) {
      if (this.options.force) {
        await fs.remove(targetDirectory);
      } else {
        let { isOverwrite } = await new Inquirer.prompt([
          {
            name: "isOverwrite",
            type: "list",
            message: "是否强制覆盖已存在的同名目录？",
            choices: [
              {
                name: "覆盖",
                value: true,
              },
              {
                name: "不覆盖",
                value: false,
              },
            ],
          },
        ]);
        if (isOverwrite) {
          await fs.remove(targetDirectory);
        } else {
          console.log(chalk.red.bold("不覆盖文件夹，创建终止"));
          return false;
        }
      }
    }
    return true;
  }

  /**
   * @description 获取模板类型
   */
  async getTemplate() {
    let { template } = await new Inquirer.prompt([
      {
        name: "template",
        type: "list",
        message: "请选择要使用的框架",
        choices: templateMapList,
      },
    ]);
    return template
  }

  async downloadTemplate(choiceTemplateName) {
    this.downloadGitRepo = util.promisify(downloadGitRepo);
    const templateUrl = `${choiceTemplateName}`;
    const loading = ora("正在拉取模版...");
    loading.start();
    await this.downloadGitRepo(templateUrl, path.join(cwd, this.projectName));
    loading.succeed();
  }

  showTemplateHelp() {
    console.log(
      `\r\nSuccessfully created project ${chalk.cyan(this.projectName)}`
    );
    console.log(`\r\n  cd ${chalk.cyan(this.projectName)}\r\n`);
    console.log("  npm install or yarn");
    console.log("  npm run start or yarn start\r\n");
    console.log(`
        \r\n
        ${chalk.green.bold(
          figlet.textSync("SUCCESS", {
            font: "isometric4",
            horizontalLayout: "default",
            verticalLayout: "default",
            width: 110,
            whitespaceBreak: true,
          })
        )}
    `);
  }
}

module.exports = async function (projectName, options) {
  const creator = new Creator(projectName, options);
  await creator.create();
};
