const koa = require('koa');
const app = koa();
const serve = require('koa-static'); 
const log4js = require('log4js');
global.log = log4js.getLogger(); 
const bee = require('./bee'); 

// hello world....  欢迎使用，测试 git 

function start() {
  app.use(serve('.'));
  bee.start(app);
  app.listen(3000);
  log.debug('[bee core] start success.')
}

module.exports = { start }