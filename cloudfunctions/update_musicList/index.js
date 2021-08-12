// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:"cloud2-5gvrnfck04d8ef24"
})
var db=cloud.database();
var _= db.command
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log(event)
 try {
   return await db.collection('music_list').where({
     _id:event._id
   }).update({
     data:{
        list:_.push([event.listId])
     }
   })
 } catch (error) {
   console.log('云函数调用失败')
 }
}