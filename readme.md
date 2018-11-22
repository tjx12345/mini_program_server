登录案例:
post:/users/login -> code,username -> openid
post:/users/getinfo ->signature,encryptedData,iv ->数据
put:/users/logout



后端接口:
分页查找GET:
http://127.0.0.1:3000/shops?_start&_limit=2&categoryId=9
条件查找GET:
http://127.0.0.1:3000/shops?name_like=xxx&categoryId=9

按评分GET:
http://127.0.0.1:3000/shops?_sort=score&_order=desc&categoryId=2

详情页面GET:
http://127.0.0.1:3000/shops?id=xxx

添加商品POST:
http://127.0.0.1:3000/shops
{
​	address: "湖北省武汉市洪山区珞狮南路"
​	categoryId: 1
​	latitude: 30.49984
​	longitude: 114.34253
​	name: "1"
​	phone: "2"
}
离我最近GET
http://127.0.0.1:3000/shops/near