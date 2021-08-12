// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:"cloud2-5gvrnfck04d8ef24"
})
var db=cloud.database();
var _=db.command
// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  try {
    if(event.url==''||event.url==null){
      return await db.collection("url_picture").where({
        // userInfo:_.or(event.userInfo,'system'),
        userInfo:_.in([event.userInfo,'system']),
        type:event.type
      }).skip(event.skip) // 跳过结果集中的前 10 条，从第 11 条开始返回
      .limit(event.limit) // 限制返回数量为 10 条
      .get()
    }else{
      return await db.collection("url_picture").where({
        userInfo:_.in([event.userInfo,'system']),
        url:event.url
      }).get()
    }   
    // .then(res => {
    //   console.log(res.data)
    // })
  } catch (error) {
    console.log("获取云函数失败")
  }
}