// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:"cloud2-5gvrnfck04d8ef24"
})
var db=cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const msg={}
  if(event.nr==''||event.nr==null){
     msg.flag=event.flag
     console.log(msg)
  }else{
    msg.nr=event.nr
    console.log(msg)
  }
  try {
    return await db.collection("journal").where({    
      _id:event._id
    }).update({
      data:msg
    })
  } catch (error) {
    console.log("云函数获取失败",error)
  }
}