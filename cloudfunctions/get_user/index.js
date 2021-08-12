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
    const res=await db.collection('user').where({
      userId:wxContext
    }).get()
    if(res.data.length){
      return {data:res.data,code:200}
    }else{
      return {code:400}
    }
  } catch (error) {
     console.log('云函数调用失败',error)
  }


}