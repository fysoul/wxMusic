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
    return await db.collection("work").where({    
      _id:event._id
    }).update({
      data:{
        text:event.text
      }
    })
  } catch (error) {
    console.log("云函数获取失败",error)
  }
}