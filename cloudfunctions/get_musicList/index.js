// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:"cloud2-5gvrnfck04d8ef24"
})
// var db=cloud.database();
const _ = cloud.database().command
var $ = cloud.database().command.aggregate
// 云函数入口函数
exports.main = async (event, context) => {
  try {
    const wxContext = cloud.getWXContext().OPENID
    return await cloud.database().collection("music_list").aggregate().match({
       userId:_.in([wxContext,'system']),
    }).lookup({
      from:"music_down",
      localField:'list',
      foreignField: '_id',
      as: 'music'
    })
    // .replaceRoot({
    //   newRoot: $.mergeObjects([$.arrayElemAt(['$uapproval', 0]), '$$ROOT'])
    // })
    // .project({
    //   uapproval: 0,
    // })
    .end({
      success:function(res){
        return res;
      },
      fail(error) {
        return error;
      }
    })
  } catch (error) {
    console.log('云函数调用失败')
  }
  
}