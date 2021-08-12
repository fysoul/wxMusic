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
    if(event.flag!=null){
      return await db.collection("journal").where({
        flag:event.flag,
        userInfo:_.in([event.userInfo,'system']),
      }).get()
  }else{
    return await db.collection("journal").where({
      userInfo:_.in([event.userInfo,'system']),
    }).get()
  }

      
  } catch (error) {
    console.log("获取云函数失败")
  }
}