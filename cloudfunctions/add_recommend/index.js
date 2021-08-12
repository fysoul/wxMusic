// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:"cloud2-5gvrnfck04d8ef24"
})
var db=cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext().OPENID
    try {
      var rec={}
      rec.text=event.text;
      rec.title=event.title;
      rec.type=event.type;
      rec.nickName=event.nickName;
      rec.userId=wxContext;
      rec.id=event.id;
      rec.flag=event.flag
        return await db.collection("recommend").add({
          data:rec
        })
    } catch (error) {
      
    }
}