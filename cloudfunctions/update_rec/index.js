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
    var rec={}
    if(event.flag>0){
        rec.flag=event.flag
    }else{
      rec.type=event.type,
      rec.title=event.title,
      rec.text=event.text
    }
    return await db.collection("rec").where({
      _id:event._id
    }).update({
      data:rec
    })
  } catch (error) {
    console.log("云函数获取失败",error)
  }
}