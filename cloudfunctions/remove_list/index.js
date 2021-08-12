// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:"cloud2-5gvrnfck04d8ef24"
})
var db=cloud.database();
var _=db.command
// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event)
  try {
    if(event.list){
      return await db.collection('music_list').where({
        _id:event._id
      }).update({
        data:{
          //  list:_.pull(_.in(event.))
           list:_.pull(event.list)
        }
      })
    }else{
      return await db.collection('music_list').where({
        _id:event._id
      }).remove()
    }
   
  } catch (error) {
    console.log('云函数调用失败',error)
  }
}