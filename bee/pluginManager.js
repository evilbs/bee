const path = require('path');
const fs = require('fs');
const pluginSettingFile = path.join(__dirname, './data/pluginSetting.json');

const pluginManager = {
  getPlugins: function () {
    let pluginSetting = false;
    try {
      let str = fs.readFileSync(pluginSettingFile);
      pluginSetting = JSON.parse(str);
    } catch (e) {
      log.error(`[plugin manage] load plugin setting file is error.`)
    }

    return pluginSetting;
  },
  savePlugins: function (plugins) {
    let result = false;
    try {
      fs.writeFileSync(pluginSettingFile, JSON.stringify(plugins));
      result = true;
    } catch (e) {
      log.error(`[plugin manage] save plugin setting file is error.`)
    }
    return result;
  }
};

module.exports = pluginManager;