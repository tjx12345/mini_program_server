const router = require('koa-router')()
const db = require('../init/dbTools.js');
const path = require('path');
const baseObj = require('./baseObj.js');
// router.prefix('/shops')
const { slides, categories } = require('../init/shops.json');


router.get('/slides', async function(ctx, next) {
        ctx.body = slides;
    })
    .get('/categories', async (ctx, next) => {
        ctx.body = categories;
    })
    .post('/shops', async ctx => {
        let { latitude, longitude } = ctx.request.body;
        delete ctx.request.body.longitude;
        delete ctx.request.body.latitude;

        let obj = await db.find('shops', {}, { _sort: 'id', _order: 'desc', _limit: 1 });
        let maxId = obj[0].id + 1;
        // 插入
        let result = await db.insert('shops', [{ 
            id: maxId, 
            ...ctx.request.body, 
            ...baseObj, 
            sp: { 
                type: "Point", 
                coordinates: [longitude, latitude] 
            } 
        }]);
        ctx.body = result;

    })
    .get('/shops', async ctx => {
        let { _start, _limit, name_like, categoryId, _sort, _order, id } = ctx.request.query;

        let filter = {};

        if (categoryId) {
            filter.categoryId = categoryId - 0;
        }
        if (name_like) {
            filter.name = new RegExp(name_like);
        }
        if (id) {
            filter.id = id - 0;
        }
        let result = await db.find('shops', filter, { _limit, _start, _sort, _order })
        console.log(result)
        ctx.body = result;

    })
    .get('/shops/near',async ctx=>{
        let {longitude,latitude,categoryId} = ctx.request.query;
        longitude = parseFloat(longitude);
        latitude = parseFloat(latitude);
        let result = await db.findNear('shops',{longitude,latitude,categoryId});
        console.log(result);
        ctx.body = result;
    })

module.exports = router;