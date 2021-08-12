// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:"cloud2-5gvrnfck04d8ef24"
})
var db=cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext().OPENID
  var obj={}
  obj.userId=wxContext
  if(event.like){
    obj.like=true
  }
  
  try {
     return await db.collection('music_down').where(obj).get()
  } catch (error) {
      console.log('获取云函数失败',error)
  }

}