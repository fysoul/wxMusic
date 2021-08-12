
var app=getApp()
var otherPage=0;
var value='';
var edg=4;
var removeTime;
var removeIndex=-1
Page({

  /**
   * 页面的初始数据
   */
  data: {
      publicArray:[],//当前显示数组
      newListFlag:true,
      now:6,//当前显示数组的标号
     gqFlag:-1,
     gqTimeFlag:-1,
     maskFlag:true,//隐藏马赛克(操作区域)
     closeList:true,//添加歌单的马赛克
     msg:{},
     addList:{},
     listArray:[],//自建歌单数组
     supArray:[],//推荐歌单数组
     hotArray:[],//热门歌单数组
     listMsg:{},//当前显示歌单的信息
     userMsg:app.globalData.userInfo,
     click:-1,//记录操作的是哪个数组
     coverFlag:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (s) {
    if(s.click){
      app.toggleShow(this,0,'animationListShow',0,1)
      let click=parseInt(s.click)
      otherPage=2//给了个固定值
      this.setData({
        listMsg:app.globalData.newList,
        publicArray:app.globalData.newList.music,
        click:click,
        userMsg:app.globalData.userInfo,
      })
      return
    }

    this.setData({
      listArray:app.globalData.listArray,
      userMsg:app.globalData.userInfo
    })
    this.getListType()
  },

  // 传给主页面信息,用于播放
  upload:function(e){
    this.setData({
      gqFlag:e.currentTarget.dataset.index,
      gqTimeFlag:e.currentTarget.dataset.index,
    })
    setTimeout(()=>{
      this.setData({
        gqTimeFlag:-1,
      })
    },200)
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit('strEvent', {data:e});
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  onHide:function(){
    this.closeRemove()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      listArray:app.globalData.listArray
    })
    
  },
// 去操作区域(马赛克)
goMask:function(e){
  let obj=e.currentTarget.dataset.item
   obj.listNumber=e.currentTarget.dataset.listNumber
    this.setData({
      maskFlag:false,
      msg:obj,
    })
},
//取消马赛克
closeMask:function(){
  this.setData({
    maskFlag:true,
  })
},

// 去主页面执行下载操作
goIndexDown:function(e){
  var pages = getCurrentPages()    //获取加载的页面( 页面栈 )
  var currentPage = pages[pages.length - 1]  // 获取当前页面
  var prevPage = pages[pages.length - 2]    //获取上一个页面
  const eventChannel = this.getOpenerEventChannel()
  eventChannel.emit('downEvent', {data:e,nowList:this.data.click});
},
goIndexLike:function(e){
  const eventChannel = this.getOpenerEventChannel()
  eventChannel.emit('likeEvent', {data:e,nowList:this.data.click});
},
 //添加到歌单
 musicList:function(){
  let arr=this.data.listArray
  let arrHave=[]
  for(let i=0;i<arr.length;i++){
    let number=arr[i].music.findIndex((item)=>item.musicid===this.data.msg.musicid||item._id===this.data.msg._id)
    if(number!=-1){
      arrHave.push(i)
    }else{
      arrHave.push(-1)
    }
    if(i==arr.length-1){
       this.setData({
        listHave:arrHave
       })
    }
  }
  app.slideupshow(this,800,'animationList',0,1)
},

 //获取新建歌单名
 value:function(e){
  value=e.detail.value.trim()
},
//上传并添加新建歌单
addNewList:function(e){
  if(value!=''||value!=null){
    e.currentTarget.dataset.creat=value
  }
  const eventChannel = this.getOpenerEventChannel()
  eventChannel.emit('listEvent', {data:e});
},
//传递参数到主页面
addCloudList:function(e){
  const eventChannel = this.getOpenerEventChannel()
  eventChannel.emit('listEvent', {data:e});
},
//取消新建歌单
closeListMask:function(){
  this.setData({
    newListFlag:true
  })
},
//关闭添加歌单
closeMusicList:function(){
  app.slideupshow(this,800,'animationList','100vh',1)
},
//添加新的歌单
goNewList:function(){
 this.setData({
   newListFlag:false
 })
},








  //创建歌单
  creatList:function(){
    this.setData({
      closeList:false
    })
  },
  // 取消创建歌单(马赛克)
  closeList:function(){
    this.setData({
      closeList:true
    })
  },

  //添加歌单
  valueText:function(e){
    this.data.addList.value=e.detail.value.trim()
     this.setData({
      addList:this.data.addList
     })
  },

  //选择图片
  changeImag:function(){
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths[0]
        this.data.addList.img=tempFilePaths
        this.setData({
          addList:this.data.addList
        })
      },
    })
  },

  //添加到数据库
  addCloud:function(){
      if(this.data.addList.value==null||this.data.addList.value==''){
         wx.showToast({
           title: '请填写歌名',
           icon:'none',
           duration:1500
         })
         return
      }
      this.data.addList.img?this.uploadFile():this.cloud('')
  },
 
  //上传图片
  uploadFile() {
    wx.showLoading({
      title: '正在上传',
    })
    wx.cloud.uploadFile({
      cloudPath:"music_listPictrue/"+(new Date()).valueOf()+'.png', // 文件名
      filePath:this.data.addList.img, // 文件路径
      config:{env:"cloud2-5gvrnfck04d8ef24"},
      success: res => {
        this.cloud(res.fileID)
        wx.hideLoading()
      },
      fail: err => {
        wx.hideLoading()
      }
    })
  },

  //需要上传到云数据库
  cloud:function(url){
    wx.cloud.callFunction({
      name:"add_musicList",
      data:{
        url:url,
        listName:this.data.addList.value,
        list:[],
        time:app.getDate(),
        des:'',
        type:0
      },
      success:r=>{
        wx.hideLoading()
        wx.showToast({
          title: '上传成功',
          icon:"none"
        })
        this.closeList()
        // 应该开始就定义对象来操作
        let obj={
          url:url,
          listName:this.data.addList.value,
          list:[],
          time:app.getDate(),
          des:'',
          type:0,
          _id:r.result._id,
          music:[]
        }
        
        var pages = getCurrentPages()    //获取加载的页面( 页面栈 )
        var currentPage = pages[pages.length - 1]  // 获取当前页面
        var prvPage=pages[pages.length - 2]//上一个页面
        this.data.listArray.push(obj)
        this.setData({
          listArray:this.data.listArray
        })
        prvPage.setData({
          listArray:this.data.listArray
        })
        app.globalData.listArray=this.data.listArray
      },fail:err=>{
      }
    })      
  },


  // 获取热门歌单和推荐歌单
  getListType:function(){
    wx.cloud.callFunction({
      name:'get_musicListType',
      success:res=>{
        for(let i=0;i<res.result.data.length;i++){
          if(res.result.data[i].type==1){
             this.data.hotArray.push(res.result.data[i])           
          }else{
             this.data.supArray.push(res.result.data[i]) 
          }
        }
        this.setData({
          hotArray:this.data.hotArray,
          supArray:this.data.supArray
        })

      },fail:err=>{
      }
    })
  },

  // 显示和隐藏歌单内的歌曲
  activeList:function(e){

    if(this.data.coverFlag==false){ 
      return
    }
    app.toggleShow(this,600,'animationListShow',0,1)
    let index=e.currentTarget.dataset.index
    app.globalData.nowObject=this.data.listArray[index]
      this.setData({
        listMsg:this.data.listArray[index],
        publicArray:this.data.listArray[index].music,
        click:index,
        now:index+6
      })
  },

  showRemove:function(e){
    removeIndex=e.currentTarget.dataset.index
    this.setData({
      coverFlag:false
    })
  },

  //返回主页面和关闭显示
  goIndex:function(){
    if(this.data.click!=-1&&otherPage==0){
      app.toggleShow(this,600,'animationListShow','100vw',1)
      this.setData({
        click:-1
      }) 
      return
    }
    wx.navigateBack({
      delta:1
    })
  },

   //删除歌曲
 remove:function(e){
 
  wx.showToast({
    title: '正在移除歌单',
    icon:'none'
  })
  let id=e.currentTarget.dataset.nowmusic._id
  let number=e.currentTarget.dataset.nowmusic.listNumber
  this.removeList(id,number)
},

//删除歌单或歌单内的歌曲
removeList:function(id,number){
  let index=this.data.click
  wx.cloud.callFunction({
    name:'remove_list',
    data:{
      _id:this.data.listArray[index]._id,
      list:id
    },
    success:res=>{
      this.data.listArray[index].music.splice(number,1)
      this.setData({
        listArray:this.data.listArray,
        publicArray:this.data.listArray[index].music
      })
      app.globalData.listArray=this.data.listArray
    },
    fail:err=>{
    },
  })
},

removeAllList:function(e){
  
  if(removeIndex==-1){
    return
  }
  wx.showLoading({
    title: '正在删除',
  })
  wx.cloud.callFunction({
    name:"remove_list",
    data:{
      _id:this.data.listArray[removeIndex]._id
    },
    success:res=>{
      wx.hideLoading()
      wx.showToast({
        title: '删除歌单成功',
        icon:'none',
        duration:1500
      })      

      if(this.data.listArray[removeIndex].url){ 
          wx.cloud.deleteFile({
            fileList: [this.data.listArray[removeIndex].url],
            success: res => {
            },
            fail: console.error
          })
      }
      this.closeRemove()
      this.data.listArray.splice(removeIndex,1)
      this.setData({
        listArray:this.data.listArray
      })
      var pages = getCurrentPages()    //获取加载的页面( 页面栈 )
      var currentPage = pages[pages.length - 1]  // 获取当前页面
      var prvPage=pages[pages.length - 2]//上一个页面
      prvPage.setData({
        listArray:this.data.listArray
      })
      app.globalData.listArray=this.data.listArray
    },
    fail:err=>{
      wx.hideLoading()
    }
  })
},
//关闭删除歌单
closeRemove:function(){
  this.setData({
    coverFlag:true
  })
  // clearInterval(removeTime)
  // this.rotateAni(0)
},

rotateAni: function (edg) {
  this.animation = wx.createAnimation({
    duration:300,
    timingFunction: 'linear',
    delay: 0,
    transformOrigin: '50% 50% 0',
    })
  this.animation.rotate(edg).step()
  this.setData({
    animationCreate: this.animation.export()
  })
 },



  

})