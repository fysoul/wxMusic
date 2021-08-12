// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:"cloud2-5gvrnfck04d8ef24"
})
var db=cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
      var typeOrSc={}
      if(event.tag<=4&&event.tag>=0){
        typeOrSc.type=event.tag
      }else{
        typeOrSc.sc=event.sc
      }

  try {
    return await db.collection("url_picture").where({
      url:event.url
    }).update({
      data:typeOrSc  
    })
  } catch (error) {
    console.log("云函数获取失败",error)
  }
}