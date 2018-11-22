const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const onerror = require('koa-onerror')
const logger = require('koa-logger')

const users = require('./routes/users')
const musics = require('./routes/musics')
const shops = require('./routes/shops')

// 存储session的数据
global.sessionStore = {
  // '时间戳':{
  //  每个人的session
  //    user:{}
  // }
};





// error handler
onerror(app)

// middlewares
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// 自定义添加代码 开始
// let session = require('./middlewares/session.js');
let login = require('./middlewares/login.js');
// session(app);
app.use(async function(ctx,next) {
  console.log(ctx.headers);
  ctx.session = {};
  //  挂载属性
  if(ctx.headers.token) {
   ctx.session = global.sessionStore[ctx.headers.token];
  }   
  await next();
});

app.use(login);
const formidable = require('koa-formidable');
const path = require('path');

app.use(formidable({
  uploadDir:path.resolve('./public/files'), //上传目录
  keepExtensions:true // 保持原有后缀名
}));
app.use(async (ctx,next)=>{
    console.log('进来了?')
    await next()
})
// 自定义添加代码 结束



// routes

app.use(musics.routes(), musics.allowedMethods())
app.use(users.routes(), users.allowedMethods())
app.use(shops.routes(), shops.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
