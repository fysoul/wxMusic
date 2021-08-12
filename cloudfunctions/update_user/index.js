// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:"cloud2-5gvrnfck04d8ef24"
})
var db=cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext().OPENID
  var user={}
      if(event.nickName!=null){
        user.nickName=event.nickName
      }else{
        user.avatarUrl=event.url
      }
  try {
    return await db.collection('user').where({
       userId:wxContext
    }).update({
      data:user
    })
  } catch (error) {
     console.log('函数调用失败',error)
  }
}