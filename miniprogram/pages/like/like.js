var iac=wx.getBackgroundAudioManager();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     animationData:{},
     animationflag:true,
     pictureArray:[],//图片数组
     selectFlag:-1,
     publicArray:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    setInterval(()=>{
      this.setData({
        animationflag:!this.data.animationflag
      })
    },2000)
  },

  onShow:function(){
    this.getPictrue()
    this. getLikeMusic()
  },

  play:function(e){
    this.setData({
      selectFlag:e.currentTarget.dataset.number
    })

    var src=e.currentTarget.dataset.music.src
    let img=e.currentTarget.dataset.music.img
    if(img&&img!='undefined'){
      iac.coverImgUrl =img
    }else{
      iac.coverImgUrl =''
    }
    iac.title = e.currentTarget.dataset.music.name
    iac.singer =  e.currentTarget.dataset.music.author
    let musicId=e.currentTarget.dataset.music.musicid
    if(src&&src!='undefined'){
      iac.src=src
    }else{
      iac.src='https://music.163.com/song/media/outer/url?id='+musicId+'.mp3';
    }
    iac.play()
  },

  getPictrue:function(){
    wx.cloud.callFunction({
      name:'get_like_pictrue',
      success:res=>{
        this.setData({
          pictureArray:res.result.data
        })
      
      },fail:err=>{}

    })
  },

  // 删除收藏
  del:function(e){
    let id=e.currentTarget.dataset.id
    wx.showModal({
      title: '',
      content:'确认移除',
      success:re=>{
        if(re.confirm){
          wx.cloud.callFunction({
            name:'update_picture',
            data:{
              url: this.data.pictureArray[id].url,
              sc:false
            },success:res=>{
              this.data.pictureArray.splice(id,1)
              this.setData({
               pictureArray:this.data.pictureArray
              })
            },fail:err=>{
            }
          })
        }
      }
    })

    
  },

  // 下载
  download:function(e){
    let id=e.currentTarget.dataset.id
    wx.showModal({
      title: '',
      content:'确认下载',
      success:re=>{
        if(re.confirm){
          wx.showLoading({
            title: '正在下载',
          })
          wx.cloud.downloadFile({
            fileID:this.data.pictureArray[id].url,
            success: function (res) {　　
              wx.hideLoading()
              wx.saveImageToPhotosAlbum({//保存到本地
                filePath:res.tempFilePath,
                success(res) {
                  wx.showToast({
                    title: '保存成功',
                    icon: 'success',
                    duration: 2000
                  })
                },
                fail: function (err) {
                  wx.hideLoading()
                  if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
                    wx.openSetting({
                      success(settingdata) {
                        if (settingdata.authSetting['scope.writePhotosAlbum']) {
                          console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                        } else {
                          console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                        }
                      }
                    })
                  }
                }
              })
            }
          }) 
        }
      }
    })
      
  },


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
   },

   getLikeMusic:function(){
     wx.cloud.callFunction({
       name:'get_music',
       data:{
         like:true
       },
       success:res=>{
         this.setData({
           publicArray:res.result.data
         })
       },fail:err=>{
       }
     })
   },

   removeMusic:function(e){
     wx.showLoading({
       title: '正在删除',
     })
     wx.cloud.callFunction({
       name:'remove_music',
       data:{
         _id:e.currentTarget.dataset.music._id
       },success:res=>{
         wx.hideLoading()
         wx.showToast({
           title: '删除成功',
           icon:'none',
           duration:1500
         })
         this.data.publicArray.splice(e.currentTarget.dataset.id,1)
         this.setData({
          publicArray:this.data.publicArray
         })
       },fail:err=>{
         wx.hideLoading()
       }
     })
   },
    //返回主页面和关闭显示
  goIndex:function(){
    wx.navigateBack({
      delta:1
    })
  },


  
})