// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:"cloud2-5gvrnfck04d8ef24"
})
var db=cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  try {
    // event:{}
    // event.
    return await db.collection("url_picture").add({
      data:event
    })
  } catch (error) {
    console.log("获取云函数失败")
  }
}