const router = require('koa-router')()
const db = require('../init/dbTools.js');
const path = require('path');
router.prefix('/musics')

router.post('/add', async function (ctx, next) {
     // 获取文字数据  和文件数据
  let { title} = ctx.request.body; //文字

  // 获取歌词和歌曲的路径(网络)
  let filePath = ctx.request.files.file.path;

  // 使用核心对象path 解析,并获取其base属性,  name +ext
  let net_filePath = '/files/' + path.parse(filePath).base;
  
  //将数据保存进数据库
  let result = await db.insert('musics',[{title,net_filePath}]);

  ctx.body = '上传成功';
  
});



module.exports = router