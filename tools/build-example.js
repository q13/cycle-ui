/**
 * 执行入口
 */

const path = require('path');
const fs = require('fs');
const fsExtra = require('fs-extra');
const walk = require('walk');
const program = require('commander');
const log4js = require('log4js');
const logger = log4js.getLogger();
const exer = require('./webpack-example.js');
const packageData = require('../package.json');

const modeMap = new Map([
  ['prod', '生产模式'],
  ['dev', '开发模式']
]);
logger.level = 'debug';

program.version(packageData.version)
  .usage('[options]')
  .option('-M, --mode <m>', '打包模式')
  .parse(process.argv);
//执行打包脚本，默认是开发模式
//console.log(program.file + "------------------------test");
//console.info(program);
const mode = program.mode;
const args = program.args;
logger.info('进入' + modeMap.get(mode) + '执行打包');
logger.info('Version ' + packageData.version);

const SRC_PATH = path.normalize(__dirname + '/../examples/src');

var pageIndexPath = []; //存放待打包的目录
var sf = args[0]; //用户指定的打包文件入口
if (sf) {
  sf = sf.split(',');
} else {
  sf = [];
}

walk.walk(path.normalize(SRC_PATH + '/page'), {
  'followLinks': false
}).on('file', function (root, fileStats, next) {
  //和目录同名的文件作为entry被打包
  if (path.extname(fileStats.name) === '.js' && (root.split(path.sep).pop() == path.basename(fileStats.name, '.js'))) {
    pageIndexPath.push(path.join(root, fileStats.name));
  }
  next();
}).on('errors', function (root, nodeStatsArray, next) {
  next();
}).on('end', function () {
  //console.log(pageIndexPath);
  if (pageIndexPath.length) {
    if (sf.length) { //当include表示遍历所有的page
      pageIndexPath = pageIndexPath.filter(function (itemData) {
        return sf.some(function (itemData2) {
          return itemData.indexOf(path.normalize(itemData2)) !== -1;
        });
      });
    }
    logger.info('当前收集待打包的文件：\n' + pageIndexPath.join('\n\n'));
    if (pageIndexPath.length > 0) {
      exer({
        entries: pageIndexPath,
        mode: mode
      });
    } else {
      logger.error('当前筛选出待打包的文件为空，请检查路径筛选信息！');
    }
  }
});
