var data;
var app=getApp()
var value='';
Page({
  data: {
    publicArray:[],
     gqFlag:-1,
     gqTimeFlag:-1,
     maskFlag:true,//隐藏马赛克(操作区域)
     msg:{},
     newListFlag:true,
     now:4,
     listArray:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (s) {
   this.setData({
    publicArray:app.globalData.storage
  })
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
    eventChannel.emit('downEvent', {data:e});
  },
  goIndexLike:function(e){
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.emit('likeEvent', {data:e});
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

 //清除缓存
 clearStorage:function(){
  var pages = getCurrentPages()    //获取加载的页面( 页面栈 )
  var currentPage = pages[pages.length - 1]  // 获取当前页面
  var prevPage = pages[pages.length - 2]    //获取上一个页面
   wx.clearStorage()
   this.setData({
     publicArray:[]
   })
   prevPage.setData({
     storage:[]
   })
   app.globalData.storage=[]
 },

 remove:function(e){
  wx.showToast({
    title: '正从该页面移除',
    icon:'none',
    duration:1500
  })
  var pages = getCurrentPages()    //获取加载的页面( 页面栈 )
  var currentPage = pages[pages.length - 1]  // 获取当前页面
  var prevPage = pages[pages.length - 2]    //获取上一个页面
  let msg=e.currentTarget.dataset.nowmusic
  let id=this.data.publicArray.findIndex((item)=>item.musicid==msg.musicid)
  if(id!=-1){
    this.data.publicArray.splice(id,1)
  }
  this.setData({
    publicArray:this.data.publicArray
  })
  // app.globalData.storage=this.data.publicArray
  currentPage.setData({
    storage:this.data.publicArray
  })
  


 }

})