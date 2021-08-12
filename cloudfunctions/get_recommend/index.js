// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:"cloud2-5gvrnfck04d8ef24"
})
var db=cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext().OPENID
    console.log(event)
  try {
    return await db.collection('recommend').where({
      flag:event.flag
    }).limit(4).get()
  } catch (error) {
    console.log('云函数调用失败',error)
  }
}