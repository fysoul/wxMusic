// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:"cloud2-5gvrnfck04d8ef24"
})
var db=cloud.database();
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const msg={}
  if(typeof(event.list)=='number'){
     msg.list=_.inc(event.list)
     console.log(msg)
  }else if(event.src){
    msg.src=event.src
    console.log(msg)
  }else{
    msg.like=event.like
    console.log(msg)
  }
  try {
    return await db.collection("music_down").where({    
      _id:event._id
    }).update({
      data:msg
    })
  } catch (error) {
    console.log("云函数获取失败",error)
  }
}