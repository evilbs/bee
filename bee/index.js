const fs = require('fs');
const path = require('path');
const router = require('koa-router')();
const globby = require('globby');
const interopRequire = require('interop-require');
const PLUGIN_DIC = '../plugins';
const pluginManager = require('./pluginManager');
const client = require('../client.js');
const distPath = path.join(__dirname, '../dist');
const parse = require('co-busboy');
const os = require('os');
const unzip = require('unzip');
const fstream = require('fstream');

/**
 * bee应用程序的入口，用于启动应用程序、插件配置管理、打包前端
 */
const boostrap = {
  app: null,
}

/**
 * 启动应用程序入口
 * @param app koa app实例
 */
boostrap.start = function (app) {
  this.app = app;
  // 1. load plugin
  this.isStarting = true;
  this.loadPlugins();
  this.loadSystemActions();

  // 2. setting router 
  router.get('/rpc/:key', function* () {
    let key = this.params.key;
    let action = app.actions[key];
    if (action) {
      let result = yield action.mod.call(this);
      this.type = "application/json; charset=UTF-8";
      this.body = JSON.stringify(result);
    } else {
      this.body = 'not found rpc method';
    }
  });

  router.post('/uploadPlugin', function* () {
    var parts = parse(this);
    var part;

    while ((part = yield parts)) {
      var pluginName = part.filename.indexOf('.') > 0 ? part.filename.substring(0, part.filename.length - 4) : part.filename;

      var promise = new Promise(function (resolve, reject) {
        // 1.save
        var uploadPath = path.join(__dirname, '../upload', pluginName);
        var stream = fs.createWriteStream(uploadPath);
        part.pipe(stream);

        // 2.unzip
        var readStream = fs.createReadStream(uploadPath);
        var writeStream = fstream.Writer('plugins');
        readStream.pipe(unzip.Parse()).on('error', function () {
          resolve(false);
        }).pipe(writeStream).on('error', function () {
          resolve(false);
        });

        // 3.load plugin to memory
        writeStream.on('close', function () {
          boostrap.loadPlugin(pluginName, true).then((result) => {
            resolve(result);
            if (!result) {
              fs.unlinkSync(uploadPath);
              fs.unlinkSync(path.join(__dirname, 'plugins', pluginName));
            }
          });
        });

        writeStream.on('error', function () {
          resolve(false);
        });
      });

      var result = yield promise;
      this.body = result;
    }
  });
  app.use(router.routes());

  // 3. generate bundle js
  if (!fs.existsSync(distPath)) {
    boostrap.packClient();
  }

  log.debug('[bee core] load actions success.')
  this.isStarting = false;
} 

boostrap.loadPlugins = function (app) {
  let pluginPath = path.join(__dirname, PLUGIN_DIC);
  let pluginDirs = fs.readdirSync(pluginPath);
  let pluginSetting = pluginManager.getPlugins();
  log.debug(`[bee core] start to load plugin,${pluginPath}`);

  for (let i = 0; i < pluginDirs.length; i++) {
    let pluginName = pluginDirs[i];
    let enable = pluginSetting && pluginSetting[pluginName] ? pluginSetting[pluginName].state === 'loaded' : true;
    this.loadPlugin(pluginName, enable);
  }
}

boostrap.loadPlugin = function (pluginName, enable) {
  let app = this.app;
  let actionsNames = [];
  let dirPath = path.join(__dirname, PLUGIN_DIC, pluginName, 'handler');
  if (!fs.existsSync(dirPath)) {
    return Promise.resolve(false);
  }

  try {
    let files = ['**/*.js'];
    let beeConfigPath = path.join(__dirname, PLUGIN_DIC, pluginName, 'bee.js');
    let beeConfig = {};
    if (fs.existsSync(beeConfigPath)) {
      beeConfig = interopRequire(beeConfigPath)
    }

    if (enable) {
      globby.sync(files, { cwd: dirPath }).forEach(function (name) {
        let fullPath = path.join(dirPath, name);
        try {
          let actionName = name.substring(0, name.length - 3).replace('Handler', '');
          let mod = interopRequire(fullPath);
          app.actions = app.actions || {};
          app.actions[actionName] = {
            tag: beeConfig['tags'] ? beeConfig['tags'][actionName] || '' : '',
            mod
          };
          actionsNames.push(actionName);
        } catch (e) {
          log.error(`[bee core] load ${fullPath} error,${e}`)
        }
      });
    }

    app.plugins = app.plugins || {};
    let plugin = app.plugins[pluginName] = app.plugins[pluginName] || {};
    plugin.actions = actionsNames;
    plugin.state = enable ? 'loaded' : 'unloaded';
  } catch (e) {
    return Promise.resolve(false);
  }

  return this.resetPlugin();
}

boostrap.unloadPlugin = function (pluginName) {
  let plugin = this.app.plugins[pluginName];
  if (!plugin) {
    return false;
  }

  plugin.state = "unloaded";
  plugin.actions.forEach((actionName) => {
    delete this.app.actions[actionName];
  });

  return this.resetPlugin()
}

boostrap.resetPlugin = function () {
  let app = this.app;
  let promise = new Promise(function (resolve, reject) {
    pluginManager.savePlugins(app.plugins);
    if (boostrap.isStarting) {
      resolve(true);
    } else {
      boostrap.packClient(function (result) {
        resolve(result);
      });
    }
  });

  return promise;
}

boostrap.getActions = function (tag) {
  var actions = [];
  for (var key in app.actions) {
    var action = app.actions[key];
    if (action.tag == tag) {
      actions.push(key);
    }
  }

  return actions;
}

boostrap.loadSystemActions = function () {
  app = this.app;
  app.actions['getPlugins'] = {
    mod: function* () {
      return this.app.plugins;
    }
  };

  app.actions['loadPlugin'] = {
    mod: function* () {
      let name = this.query.name;
      let result = yield boostrap.loadPlugin(name, true);
      return result;
    }
  }

  app.actions['unloadPlugin'] = {
    mod: function* () {
      let name = this.query.name;
      let result = yield boostrap.unloadPlugin(name);
      return result;
    }
  }

  app.actions['getActions'] = {
    mod: function* () {
      let tag = this.query.tag;
      let actionNames = boostrap.getActions(tag);
      return actionNames;
    }
  }
}

/**
 * 打包前端页面
 */
boostrap.packClient = function (callback) {
  client.pack(function (result) {
    callback && callback(result);
  });
}

module.exports = {
  start: (app) => {
    boostrap.start(app);
  }
};