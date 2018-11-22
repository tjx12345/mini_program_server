const session = require('koa-session');

module.exports = async app =>{
  app.keys = ['shhhhh']; // 数字签名的加密依赖 
   // 这个是因为你需要保证传递的cookie数据不被串改
  // 多发一个cookie(就是另一个cookie的数字签名)

  // 配置session的stroe
  let store = {  // 吧session数据作为内存处理,当然,还有配置数据库存储的方式
    storage: {},  
    set:function (key,sess) {
        this.storage[key] = sess;
    },
    get:function (key) {
      return this.storage[key];
    },
    destroy:function (key) {
      delete this.storage[key];
    }
  };
  app.use(session({store:store},app));
}