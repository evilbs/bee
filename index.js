const koa = require('koa');
const app = koa();
const log4js = require('log4js');
const multer = require('koa-multer');
global.log = log4js.getLogger();

const bee = require('./bee');
bee.start(app);
app.listen(3000);
log.debug('[bee core] start success.');