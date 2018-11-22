
module.exports = async (ctx,next) => {

  // add-music   edit-music delete-music
  // /login   /register
  let regex = /^\/user/; // 判断是否是登录和注册
  let isNonCheck = regex.test(ctx.request.url);

  if (isNonCheck)return await next(); // 是登录和注册,直接放行

  console.log(ctx.session);

  // 如果用户没有登录 !ctx.session.user
  if (ctx.session== undefined || !ctx.session.user) {
    ctx.body = `<div>
          <a href="/user/login">没有登录,去登录</a>
    </div>`;
    return ;
  }
  // 如果登录放行
  await next();
}