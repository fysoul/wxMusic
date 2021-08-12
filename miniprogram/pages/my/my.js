// miniprogram/pages/my/my.js
const app=getApp()
Page({
  data: {
     user:app.globalData.userInfo,
     pageNumber:null,
     animationData:{},
     animationLog:{},
     selectFlag:-1
  },
  onLoad:async function (options) {
     const userInfo=await app.checkuser()
     if(userInfo){
       this.setData({
         user:app.globalData.userInfo,
         pageNumber:1
       })
       this.showText(500,'-100vw')
     }
    
  },
  
  // 获取用户权限
  getUser:function(){
     wx.getUserProfile({
       desc: '开启权限才可使用',
       success:res=>{
        this.showText(500,'-100vw')
        this.setData({
          user:res.userInfo,
          pageNumber:1
        })
         wx.cloud.callFunction({
           name:'add_user',
           data:{
             userInfo:{nickName:res.userInfo.nickName,avatarUrl:res.userInfo.avatarUrl,gender:res.userInfo.gender}
           }
         })
       }
     })
  },

  goPerson:function(e){
    let id=e.currentTarget.dataset.id
    if(id==2){
      wx.showToast({
        title: '该功能暂未开放',
        icon:'none'
      })
      return
    }
    this.setData({
      selectFlag:id
    })
    setTimeout(()=>{
      this.setData({
        selectFlag:-1
      })
    },200)
    let url=id==0?'person/person?img='+this.data.user.avatarUrl:id==1?'/pages/rec/rec?name='+this.data.user.nickName:id==2?'':id==3?'manage/manage':''
    setTimeout(()=>{
      wx.navigateTo({
        url:url,
      })
    },100)
    
  },












  //动画执行
  //文本动画
 showText: function (time,px) {
  var animation = wx.createAnimation({
    duration:time,
    timingFunction: 'linear',
  })
  this.animation = animation
  this.animation.translateX(px).step()
  this.setData({
    animationData: this.animation.export(),  
  })
 }

})