// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:"cloud2-5gvrnfck04d8ef24"
})
var db=cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  // const wxContext = cloud.getWXContext()
   
  try {
     return await db.collection('support').where({}).get()
  } catch (error) {
    
  }
}