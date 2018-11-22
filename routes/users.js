const router = require('koa-router')()
router.prefix('/users')
var rp = require('request-promise');
var WXBizDataCrypt = require('./WXBizDataCrypt')
const appid = 'wx93e2bafc07fd4fb1';
const secret = '17cd58e8bc695b074c0cf34852a05f79';
let sessionKey = '';
let openid = '';

router.post('/login', async function(ctx, next) {
        console.log('开始请求')
        let body = await rp.get({ json: true, uri: `https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${ctx.request.body.code}&grant_type=authorization_code` });

        // session_key":"ZwIFoc35bSObT1uq3bOAFw==","openid":
        sessionKey = body.session_key;
        openid = body.openid;

        // 记住这个客户端的登录信息,下次访问,也能有该信息
        ctx.session.user = {
            username: ctx.request.body.username,
            sessionKey,
            openid
        };
        // 响应登录成功状态码
        ctx.body = { code: '001', msg: '登录成功', user: ctx.session.user };

    })
    .post('/getinfo', async function(ctx, next) {
        let { signature, encryptedData, iv } = ctx.request.body;
        var pc = new WXBizDataCrypt(appid, sessionKey)
        var data = pc.decryptData(encryptedData, iv);
        ctx.body = data;
    })
    .put('/logout', async ctx => {
        ctx.session = null;
        ctx.body = '退出成功'
    })

module.exports = router