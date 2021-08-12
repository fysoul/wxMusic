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
    const wxContext = cloud.getWXContext().OPENID
  // const {userInfo}=event
  // userInfo.userId= wxContext
  var rec={}
  rec.text=event.text;
  rec.title=event.title;
  rec.type=event.type;
  rec.userId=wxContext;
  rec.flag=event.flag;
    return await db.collection("rec").add({
      data:rec
    })
  } catch (error) {
    console.log("获取云函数失败")
  }
}