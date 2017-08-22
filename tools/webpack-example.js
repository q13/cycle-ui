/**
 * 基于webpack打包实现
 */
const path = require('path');
const fs = require('fs');
const fsExtra = require('fs-extra');
const webpack = require("webpack");
const log4js = require('log4js');
const WebSocketServer = require('socket.io');
const logger = log4js.getLogger();

const SRC_PATH = path.normalize(__dirname + '/../examples/src');
const OUTPUT_PATH = path.normalize(__dirname + '/../examples/dist');

const browsers = ["last 2 versions", "last 3 iOS versions", "Android >= 4.0"];
//const browsers = ["chrome >= 58"];
const MODE_METHOD_MAP = new Map([['dev', 'watch'], ['prod', 'run']]);


function exer({entries, mode = 'dev'}) {
  //创建websocket io
  const io = WebSocketServer(1107, {
    path: '/',
    serveClient: false,
    // below are engine.IO options
    pingInterval: 10000,
    pingTimeout: 5000,
    cookie: false
  });

  io.on('connection', function(socket) {
    io.emit('ConnectionChannel', 'On auto reload way. Welcome!' );
  });
  /**
   * 顺序执行
   * @param {*} index
   */
  function go(index) {
    const entry = entries[index];

    const relativePagePath = path.relative(SRC_PATH + '/page', entry);
    let relativePageBasePath = path.dirname(relativePagePath);
    let pageKeyName = relativePageBasePath.split(path.sep).join('-');
    let outputPath = path.normalize(OUTPUT_PATH + '/' + pageKeyName);

    const compiler = webpack({
      // Configuration Object
      context: SRC_PATH,
      entry: {
        index: './page/' + relativePagePath
      },
      output: {
        path: outputPath,
        //publicPath: "",
        filename: "[name].js"
      },
      //cache: sharedCache,
      module: {
        rules: [{
          test: /\.js?$/,
          exclude: /(node_modules|bower_components)/,
          use: [{
            loader: 'babel-loader',
            options: {
              presets: [
                ["env", {
                  targets: {
                    browsers: browsers
                  },
                  useBuiltIns: true,
                  modules: false,
                  loose: true
                }], ["stage-0"]
              ],
              plugins: ["syntax-async-functions", "transform-regenerator"]
            }
          }]
        }]
      },
      plugins: [
        new webpack.optimize.UglifyJsPlugin({
          sourceMap: true
        }),
        function () {
          this.plugin("done", function (stats) {
            //logger.debug(stats.toJson());
          });
        }
      ],
      devtool: 'source-map'
    });
    //初始化标识
    let initReady = false;
    logger.info((function (method) {
      return method.charAt(0).toUpperCase() + method.slice(1);
    }(MODE_METHOD_MAP.get(mode))) +  ' ' + relativePagePath + ' start.');

    compiler[MODE_METHOD_MAP.get(mode)](...((mode === 'dev' ? [{
      aggregateTimeout: 300,
      poll: 1000
    }] : []).concat((err, stats) => {
      // ...
      //自定义逻辑
      if (err) {
        logger.error(err);
        return;
      }
      const jsonStats = stats.toJson();
      if (jsonStats.errors.length > 0) {
        logger.error(jsonStats.errors.join(''));
        logger.info('\n/*----------------------------------------------------------------*/\n');
      }
      //Build过程改写JSP加载资源版本号
      //console.log(pageKeyName);
      if (mode === 'prod') {
      } else if (mode === 'dev') {
        //发送version change消息
        io.emit('AutoReloadChannel', JSON.stringify({
          pageName: pageKeyName
        }));
      }

      logger.info('Build ' + relativePagePath + ' over.');

      if (index < entries.length - 1 && !initReady) {
        initReady = true;
        go(++index);
      }
    })));
  }
  go(0);
}
module.exports = exer;
