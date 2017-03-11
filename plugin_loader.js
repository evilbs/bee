
const path = require('path');
const PLUGIN_DIC = './plugins';
const interopRequire = require('interop-require');
const PluginManager = require('./bee/pluginManager');

// 用于动态打包插件的前端文件进webpack 的bundle.js中
module.exports = function (source) {
  let paths = boostrap.loadPlugins();
  paths.forEach((path, index) => {
    source += 'require("../' + path + '");';
  });
  console.log(paths);
  return source;
};

var boostrap = {};
boostrap.loadPlugins = function () {
  const fs = require('fs');
  let paths = [];
  let pluginPath = path.join(__dirname, PLUGIN_DIC);
  let pluginDirs = fs.readdirSync(pluginPath);
  let pluginSetting = PluginManager.getPlugins();
  for (let i = 0; i < pluginDirs.length; i++) {
    let pluginName = pluginDirs[i];
    let enable = pluginSetting && pluginSetting[pluginName] ? pluginSetting[pluginName].state === 'loaded' : true;
    if (enable) {
      let beeConfigPath = path.join(PLUGIN_DIC, pluginName, 'client/router.js');
      if (fs.existsSync(path.join(__dirname, PLUGIN_DIC, pluginName, 'client/router.js'))) {
        paths.push(beeConfigPath);
      }
    }
  }

  return paths;
} 