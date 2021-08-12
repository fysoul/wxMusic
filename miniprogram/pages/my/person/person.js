var userName='';//用于保存修改用户名
Page({

  /**
   * 页面的初始数据
   */
  data: {
      userArray:{},
      imgFlag:false,
      nameFlag:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.userArray.avatarUrl=options.img
    this.setData({
      userArray:this.data.userArray
    })
      this.getUser()
  },

  getUser:async function(){
    var res=await wx.cloud.callFunction({
      name:'get_user'
    })
    if(res.result.code==200){
      this.data.userArray=res.result.data[0],
      this.setData({
        userArray: this.data.userArray
      })
    }

 },

 imgFlag:function(){
   this.setData({
    imgFlag:!this.data.imgFlag
   })
 },
 
//  修改头像
 // 上传图片
 upload(){
  // 选择一张图片
  wx.chooseImage({
    count: 1,
    sizeType: ['original', 'compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      // tempFilePath可以作为img标签的src属性显示图片
      const tempFilePaths = res.tempFilePaths[0]
      this.uploadFile(tempFilePaths) 
    },
  })
},

shanchu:function(){
  wx.cloud.deleteFile({
    fileList: [this.data.userArray.avatarUrl],
    success: res => {
    },
    fail: console.error
  })
},

//上传操作
uploadFile(filePath) {
  wx.showLoading({
    title: '正在上传',
  })
  wx.cloud.uploadFile({
    cloudPath:"user_picture/"+(new Date()).valueOf()+'.png', // 文件名
    filePath: filePath, // 文件路径
    config:{env:"cloud2-5gvrnfck04d8ef24"},
    success: res => {
      wx.cloud.callFunction({
        name:"update_user",
        data:{
          url:res.fileID,
        },
        success:r=>{
          wx.hideLoading()
          wx.showToast({
            title: '上传成功',
            icon:"success"
          })
          this.shanchu()
          this.data.userArray.avatarUrl= res.fileID
          this.setData({
            userArray:this.data.userArray
          })
          this.imgFlag()
        },fail:err=>{
        }
      })
    },
    fail: err => {
    }
  })
},

//去修改用户名
goName:function(){
    this.setData({
      nameFlag:!this.data.nameFlag
    })
},

// 获取要修改的用户名
getName:function(e){
  userName=e.detail.value
},
// 在数据库修改用户名
updateName:function(){
  let reg=/^\s/.test(userName)
  if(userName==''){
    wx.showToast({
      title: '请输入正确的用户名',
      icon:'none'
    })
    return
  }else if(reg){
    wx.showToast({
      title: '开头不能为空',
      icon:'none'
    })
    return
  }
  wx.showLoading({
    title: '正在修改用户名',
  })
    wx.cloud.callFunction({
      name:'update_user',
      data:{
         nickName:userName
      },
      success:res=>{
        wx.hideLoading()
        wx.showToast({
          title: '修改成功',
          icon:'success',
        })
        this.data.userArray.nickName=userName
        userName=''
        this.setData({
          userArray:this.data.userArray
        })
        this.goName()
      },fail:err=>{
      }

    })
}






})
