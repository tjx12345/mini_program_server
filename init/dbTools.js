var obj = {};
const MongoClient = require('mongodb').MongoClient;
const test = require('assert');
// Connection url
const url = 'mongodb://localhost:27017';
// Database Name
const dbName = 'mini_db';
let shops = require('./shops.json').shops;

function _connect(callback) {
    // Connect using MongoClient
    MongoClient.connect(url, function(err, client) {
        callback(client);
    });
}
// 初始化
_connect(function(client) {
    let c = client.db(dbName).collection('shops');
    
    c.drop();

    c.createIndex({ 'sp': '2dsphere' }, function() {
        c.insertMany(shops, function(err) {
            if (err) throw err;
            console.log('数据初始化完毕')
            client.close();
        })
    });
});


// 增删改查
obj.insert = function(c_name, dataArr) {
    return new Promise(function(res, rej) {
        _connect(function(client) {
            let c = client.db(dbName).collection(c_name);
            c.insertMany(dataArr, function(err, results) {
                client.close();
                if (err) rej(err);
                else res(results);
            });

        });
    });
}
// 查
obj.find = function(c_name, filter, options) {
    console.log(options,filter)
    return new Promise(function(res, rej) {
        _connect(function(client) {
            // skip(options._start-0||0).limit(options._limit-0||200).
            let c = client.db(dbName).collection(c_name);
            let query = c.find(filter);
            if(options._start) query = query.skip(options._start-0);
            if(options._limit) query = query.limit(options._limit-0);
            if(options._sort && options._order) query = query.sort({[options._sort]:options._order=='desc'?-1:1});

            query.toArray(function(err, documents) {
                client.close();
                if (err) rej(err);
                else res(documents);
            });

        });
    });
}

obj.findNear = function(c_name, filter) {

    return new Promise(function(res, rej) {
        _connect(function(client) {
            let c = client.db(dbName).collection(c_name);
            let lo = filter.longitude,la = filter.latitude;
            delete filter.longitude;
            delete filter.latitude;
            if (filter.categoryId) filter.categoryId -= 0;

            c.aggregate({
                $geoNear: {
                    near: { type: "Point", coordinates: [lo,la] },
                    distanceField: "dist.calculated",
                    spherical: true,
                    // maxDistance: 10000000,
                    query:filter
                }
            }, function(error, cursor) {
                if (error) throw error;
                cursor.toArray((err, documents) => {
                    client.close();
                    if (err) rej(err);
                    else res(documents);
                })
            })
        });
    });
}
// obj.findNear('test',{},function(err,documents) {
//   if(err) throw err;
//   console.log(documents);
// });
module.exports = obj;