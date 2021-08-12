// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:"cloud2-5gvrnfck04d8ef24"
})
var db=cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  const wxContext = cloud.getWXContext().OPENID
  try {
    return await db.collection("music_list").add({
      data:{
        url:event.url,
        listName:event.listName,
        list:event.list,
        time:event.time,
        des:event.des,
        type:event.type,
        userId:wxContext
      }
     
    })
  } catch (error) {
    console.log("获取云函数失败")
  }
}