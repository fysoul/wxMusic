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
    const wxContext = cloud.getWXContext().OPENID
      return await db.collection("rec").where({
        userId:_.in([wxContext,'system']),
      }).get()
  } catch (error) {
    console.log("获取云函数失败")
  }
}