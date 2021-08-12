var h=0;//记录元素的高度
var array=[0,0];//瀑布流二列的最终的top值,初始为0
var arr=[];//
var number=0;//请求数据库,返回第几页
var pageNumber=8;//请求数据库,返回一页有几条数据
var x=0;//记录向上刷新的次数
var imgFlag=true;//判断是否还有图片数据
var thisda='500rpx';
var loading=true;//当加载时，是否执行其他
var imgId=0;
var scFlag=false;//判断是否点击收藏状态
const app = getApp();//获取app.js中的数据

Page({

  /**
   * 页面的初始数据
   */
  data: {
    opcatiy:0,//上传透明样式
    ys:0,
    flag:false,//上拉刷新提示信息是否显示
    op:0,//上拉信息提示信息样式变化
    time:null,
    position:[],//动漫图片的位置
    position1:[],//风景图片的位置
    position2:[],//人物图片的位置
    position3:[],//头像图片的位置
    position4:[],//其他图片的位置
    height:app.globalData.windowHeight-110+'px',//初始的图片盒子高度
    imageUrl:[],//动漫图片的地址
    imagerl1:[],//风景图片地址
    imagerl2:[],//人物图片地址
    imagerl3:[],//头像图片地址
    imagerl4:[],//其他图片地址
    mask:app.globalData.windowHeight-110,    //马赛克的高度
    hideModal: true, //模态框的状态  true-隐藏  false-显示
    animationData: {},//加载的动画效果
    title:[0,1,2,3,4],
    is:0,//设置当前选中
    isSelect:false,//是否上传状态
    tag:0,//上传选择的是哪个标签
    check:false,//是否显示图片的详情信息
    img:{src:'',sc:false,height:0,type:0},//点击查看大图信息
    xiugai:{height:0,opacity:0},//过渡显示
    system:{windowHeight:app.globalData.windowHeight,windowWidth:app.globalData.windowWidth}//显示屏的宽高
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(res) {
    this.getPicture(0)
  },

 





  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (res) {
    
  },
  
  // 上传获取焦点事件
  focus:function(){
    this.setData({
      ys:8
    })
  },
  // 上传失去焦点事件
  blur:function(){
    this.setData({
      ys:0
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (res) {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

    if(this.data.check||!loading){//当处于加载状态或大图状态不允许加载信息
      return
    }
    x++;
      var time=setInterval(() => {
        this.setData({
          op:this.data.op+0.1
        })
        if(this.data.op>=1){
          clearInterval(time)
        }
      },90);
        this.getPicture(this.data.is)    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  // 滚动条事件
  onPageScroll:function(e) {
    wx.getSystemInfo({
      success: (result) => {
        var obj=wx.createSelectorQuery();         
        obj.select('#al').boundingClientRect(function (rect) {
             h=rect.height
          })
          obj.exec();
          if(e.scrollTop+25<h-result.windowHeight){
              this.setData({
                op:0
              })
          }
      },
    })
  },


  //自定义函数
  // 上传图片
  upload(){
    // 选择一张图片
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePaths = res.tempFilePaths[0]
        this.uploadFile(tempFilePaths) 
      },
    })
  },
  //上传操作
  uploadFile(filePath) {
    wx.showLoading({
      title: '正在上传',
    })
    wx.cloud.uploadFile({
      cloudPath:"upload_picture/"+(new Date()).valueOf()+'.png', // 文件名
      filePath: filePath, // 文件路径
      config:{env:"cloud2-5gvrnfck04d8ef24"},
      success: res => {
        wx.cloud.callFunction({
          name:"add_picture",
          data:{
            url:res.fileID,
            // 0:动漫,1:风景,2:人物,3.头像,4.其他
            type:this.data.tag,
            sc:false
          },
          success:r=>{
            wx.hideLoading({
              success: (res) => {},
            })
            wx.showToast({
              title: '刷新生效',
              icon:'success',
              duration:1500
            })      
          },fail:err=>{
            wx.hideLoading()
          }
        })
      },
      fail: err => {
        wx.hideLoading()
      }
    })
  },

   
  //获取图片信息
  getPicture:function(re){
    if(imgFlag){
      if(loading==false){
          return
      }
      //加载显示
    this.showModal()
    wx.cloud.callFunction({
      name:"get_picture",
      data:{
        skip:number*pageNumber,
        limit:pageNumber,
        type:re
      },
      success:res=>{
        this.setData({
          imageUrl:this.data.imageUrl.concat(res.result.data),       
        })
        if(res.result.data.length<8&&x>0){
           imgFlag=false
           this.hideModal()
           this.setData({
             flag:true
           })
           

           return
        }
        number++     
      },fail:err=>{
      }
    })
    }       
    
  },

  //加载图片信息
  load:function(){
    setTimeout(()=>{
      var obj=wx.createSelectorQuery();         
      obj.selectAll('.size').boundingClientRect(rect=> {
           for(var key=0;key<rect.length;key++){               
             var he=array[0]
             var index=0    
             for(var i=0;i<array.length;i++){
              if(array[i]<he){
                  index=i
                  he=array[i]
              }
            }
            arr.push({left:index*(rect[key+x*8].width+10),top:he})
            this.setData({
              position:arr
            })
            array[index]=he+rect[x*8+key].height+10
            this.setData({
              height:array[index]-10+"px"
            })
              var x1=x*8+key;//记录当前的值
              if(x1==rect.length-1){
                if(rect.length%8!=0){
                  this.setData({
                    flag:true
                  })                  
                }
                this.hideModal()
              }
              

           }    
        })
        obj.exec()
    },100)
    
  },

  // 显示遮罩层
  showModal: function () {
   loading=false;//当在加载时不允许再次去获取信息
    var that=this;
    that.setData({
      hideModal:false
    })
    var animation = wx.createAnimation({
      duration: 600,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease',//动画的效果 默认值是linear
    })
    this.animation = animation 
    setTimeout(function(){
      that.fadeIn();//调用显示动画
    },200)   
  },

  // 隐藏遮罩层
  hideModal: function () {
    loading=true;//当加载完成时，取消加载限制
    var that=this; 
    var animation = wx.createAnimation({
      duration: 800,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
      timingFunction: 'ease',//动画的效果 默认值是linear
    })
    this.animation = animation
    that.fadeDown();//调用隐藏动画   
    setTimeout(function(){
      that.setData({
        hideModal:true
      })      
    },720)//先执行下滑动画，再隐藏模块
    
  },

  //动画集
  fadeIn:function(){
    this.animation.translateX(0).step()
    this.setData({
      animationData: this.animation.export()//动画实例的export方法导出动画数据传递给组件的animation属性
    })
      
  },
  fadeDown:function(){
    this.animation.translateX(-400).step()
    this.setData({
      animationData: this.animation.export(),  
    })
  }, 


// 切换图片类型
 toggle:function(e){
  var tagNumber=parseInt(e.currentTarget.dataset.id)
  this.xianshi(tagNumber)
 },
xianshi:function(tagNumber){
  if(!loading){return} //如果正在加载,不允许再次访问
  h=0;//记录元素的高度
  array=[0,0];//瀑布流二列的最终的top值,初始为0
  arr=[];//
  number=0;//请求数据库,返回第几页
  x=0;//记录向上刷新的次数
  imgFlag=true
   this.setData({
     is:tagNumber,
     position:[],
     imageUrl:[],
     height:app.globalData.windowHeight-110+'px',
     flag:false,//上拉刷新提示信息是否显示
   })
  this.getPicture(tagNumber)
},




//  选择标签的类型
change:function(e){
  this.setData({
    tag:parseInt(e.currentTarget.dataset.index)
  })
},

goUp:function(){
  this.showModal()
  this.setData({
    isSelect:true
  })
},

// 取消上传
qx:function(){
  this.hideModal()
  this.setData({
    isSelect:false
  })
},

//查看操作/大图片
check:function(e){
  wx.showLoading({
    title: '加载中',
    mask:true
  })
        imgId=parseInt(e.currentTarget.dataset.id)
        this.data.img.src=this.data.imageUrl[imgId].url
        if(!scFlag){//又重新去获取没修改过的收藏状态,当点击了收藏状态就不再去获取
          this.data.img.sc=this.data.imageUrl[imgId].sc
        }
        this.data.img.type=this.data.imageUrl[imgId].type
        this.setData({         
          img:this.data.img
        })
        wx.getImageInfo({
          src:this.data.img.src,
          success:result=>{
            this.data.img.height=350/(result.width/result.height)+30
            this.setData({
              check:!this.data.check,
              img:this.data.img
            })
            wx.hideLoading({
              success: (res) => {},
            })
          },fail:err=>{
            wx.hideLoading({
              success: (res) => {},
            })
          }
        })
         
},

// 关闭大图显示
close:function(){
  this.data.xiugai.height=0
  this.data.xiugai.opacity=0
  this.setData({
  check:!this.data.check,
  xiugai:this.data.xiugai
  })
},

// 收藏
shoucang:function(){
 var sc=!this.data.img.sc
  wx.cloud.callFunction({
    name:'update_picture',
    data:{
      url:this.data.img.src,
      sc:sc
    },success:res=>{
      this.data.img.sc=sc
      scFlag=true
      this.setData({
        img:this.data.img
      })
      wx.hideLoading({
        success: (res) => {},
      })
    },fail:err=>{
      wx.hideLoading({
        success: (res) => {},
      })
    }
  })
},
// 获取单个图片信息
get_pictureId:function(){
  wx.showLoading({
    title: '正在执行操作',
  })
  wx.cloud.callFunction({
    name:'get_picture',
    data:{
        url:this.data.img.src,
    },
    success:res=>{
      this.data.img.sc=res.result.data[0].sc
      this.setData({
        img:this.data.img
      })
      this.shoucang()
      wx.hideLoading()
    },
    fail:err=>{
      wx.hideLoading()
    }
  })
},

//下载文件
xiazai:function(){
  wx.showLoading({
    title: '正在下载',
  })
  wx.cloud.downloadFile({
    fileID:this.data.img.src,//这个地方的fileID就是云存储文件的fileID
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
                } else {
                }
              }
            })
          }
        }
      })
    }
  })
},

//移除文件(数据库和云存储)
shanchu:function(){
  wx.cloud.deleteFile({
    fileList: [this.data.img.src],
    success: res => {
     wx.hideLoading()
     this.setData({
       check:false,
     })
     this.xianshi(this.data.is)
    },
    fail: console.error
  })
},
//删除数据库的信息
remove_picture:function(){
  wx.showLoading({
    title: '正在移除',
    mask:true
  })
  wx.cloud.callFunction({
    name:'remove_picture',
    data:{
      url:this.data.img.src
    },
    success:res=>{
      this.shanchu()
      wx.hideLoading()
    },fail:err=>{
      wx.hideLoading()
    }
  })
},

//显隐修改大图类型的操作
xiugai:function(){
  if(this.data.xiugai.height==0){
    this.data.xiugai.height=60
    this.data.xiugai.opacity=1
    this.setData({
      xiugai:this.data.xiugai
    })
  }else{
    this.data.xiugai.height=0
    this.data.xiugai.opacity=0
    this.setData({
      xiugai:this.data.xiugai
    })
  }
},
//修改大图的类型
updateTag:function(e){
  var typeId=parseInt(e.currentTarget.dataset.xiugai)
  
  if(typeId==this.data.img.type){
    wx.showToast({
      title: '当前类型无需修改',
      icon:'none',
      duration:2000
    })
    return
  }
  wx.showLoading({
    title:'正在修改'
  })
   wx.cloud.callFunction({
     name:'update_picture',
     data:{
       url:this.data.img.src,
       tag:typeId
     },success:res=>{
       wx.hideLoading()
       wx.showToast({
         title: '更改类型成功,刷新生效',
         icon:'none',
         duration:2000,
       })
       this.xiugai()
     },fail:err=>{
       wx.hideLoading()
     }
   })
},
})


