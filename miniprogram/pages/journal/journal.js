// miniprogram/pages/journal/journal.js
const app=getApp()
var te={text1:'',text2:'',text3:'',text4:''};
var  select='';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    system:{windowHeight:app.globalData.windowHeight,windowWidth:app.globalData.windowWidth},
    array:[],//接收数据库里面的数据
    isSelect:false,
    addFlag:false,
    addPage:{height:app.globalData.windowHeight-56+'px'},
    animationData:{},
    animationText:{},//文本动画
    show:false,
    day:'',
    selectId:0,
    update:{nr:'',flag:true},
    bj:0,//记录标记的个数
    pageNumber:0,//要去的页面,初始第一页
    go:800,
    kong:'',
    bgcolor:false,
    address:'',//位置信息
    date:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var year=new Date().getFullYear();
    var month=new Date().getMonth()+1;
    var day=new Date().getDate();
    month=month<10?('0'+month):month
    day=day<10?('0'+day):day
    
    this.data.date=year+'-'+month+'-'+day
    this.setData({
      date:this.data.date
    })
    this.getGournal()
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },



  //切换
 isSelect:function(){
    if(!this.data.addFlag){
      this.showModal()
      
    }else{
      this.hideModal()
    }
    te={}
    this.setData({
      isSelect:!this.data.isSelect,
      day:'',
      address:''
    })
    setTimeout(()=>{
      this.setData({
        isSelect:!this.data.isSelect
      })
    },100)
    
 },



//记录添加的文本值
 addText:function(e){
    const id=e.currentTarget.dataset.id
    if(id<5){
      if(id==4){
        te.text4=e.detail.value;
        this.setData({
          day:e.detail.value
        })
        return
      }
       id==1?te.text1=e.detail.value:id==2?te.text2=e.detail.value:te.text3=e.detail.value
    }else{
      
      if(te.text4!=''&&te.text4!=null){
        id==5?select=' / 旅行':id==6?select=' / 工作':id==7?select=' / 休息':select=' / 娱乐'
        this.setData({
          selectId:id,
          day:te.text4+select
        })
        setTimeout(()=>{
          this.setData({
            selectId:0
          })
          this.show()
        },200)
        
      }else{this.show()}
    }
 },
//添加到云数据库
addCloud:function(){

  var flag2=/^\s/g.test(te.text2)
  var flag3=/^\s/g.test(te.text3)
  if(te.text2==null||te.text2==''||te.text3==null||te.text3==''){
  wx.showToast({
        title: '标题/内容为必填',
        icon:"none",
        duration:1500
       })
        return
    }else if(flag2||flag3){
      wx.showToast({
            title: '开头不能为空',
            icon:"none",
            duration:1500
      })
           return
    }
         wx.showLoading({
          title:'努力添加中',mask:true
        })     
        let xc=te.text4+select
        let address=this.data.address
        xc=='undefined'||xc==null?xc='':xc
        if(te.text1!='undefined'&&te.text1!=''&&te.text1!=null){
          address=te.text1       
        }
          wx.cloud.callFunction({
            name:'add_journal',
            data:{
              dw:address,
              sj:this.data.date,
              bt:te.text2,
              nr:te.text3,
              xc:xc,
              flag:false
            },success:res=>{
              this.hideModal()
              wx.hideLoading()
              this.getGournal()
            },fail:err=>{
              wx.hideLoading()
            }
          })
},
//查询所有数据
getGournal:function(){
  this.setData({
    bj:0
  })
  wx.cloud.callFunction({
    name:'get_journal',
    success:res=>{
      this.setData({
        array:res.result.data.reverse()
      })
      this.getBj()
    },fail:err=>{
    }
  })
},
//向总数据获取标记的条数
getBj:function(){
  this.data.bj=0
  for(let k=0;k<this.data.array.length;k++){
    if(this.data.array[k].flag){
      this.data.bj++
    }
    if(k==this.data.array.length-1){
      this.setData({
        bj:this.data.bj
      })
    }
}
},

//删除当前页面
removeGournal:function(e){
  wx.showLoading({
    title: '正在删除',
  })
  if (this.data.array.length-1==e.currentTarget.dataset.id) {
    wx.showToast({
      title: '无法删除系统日志',
      icon:'none',
      duration:2000
    })
    return
  }
  wx.cloud.callFunction({
    name:'remove_gournal',
    data:{
      _id:this.data.array[e.currentTarget.dataset.id]._id
    },success:res=>{
      this.data.array.splice(e.currentTarget.dataset.id,1)
      this.setData({
        array:this.data.array
      })
      this.getBj()
      wx.hideLoading()
      wx.showToast({
        title: '删除成功',
        icon:'success',
        duration:1500
      })
    },fail:err=>{
      wx.hideLoading()
    }
  })
},
//修改页面内容
updateGournal:function(e){
    wx.showModal({
      title: '',
      content: '确认修改',
      success:res=>{
        if (res.confirm) {
          wx.showLoading({
            title: '正在修改',
          })
          wx.cloud.callFunction({
            name:'update_journal',
            data:{
              _id:this.data.array[e.currentTarget.dataset.id]._id,
              nr:this.data.update.nr
            },success:res=>{
              this.data.update.flag=true
              this.setData({
                update:this.data.update
              })
              wx.showToast({
                title: '修改成功',
                icon:'success',
                duration:1500
              })
              wx.hideLoading()
            },fail:err=>{
              wx.hideLoading()
            }
          })
        } else if (res.cancel) {
            this.data.update.flag=true
              this.setData({
                update:this.data.update
              })
        }

      }
    })

 
  
},
//修改标记状态
updateFlag:function(e){
  // this.gouser()
  let id=e.currentTarget.dataset.id
  wx.showLoading({
    title:'标记更新中',
    mask:true
  })
  wx.cloud.callFunction({
    name:'update_journal',
    data:{
      _id:this.data.array[id]._id,
      flag:!this.data.array[id].flag,
    },success:res=>{
      this.data.update.flag=true
      this.data.array[id].flag=!this.data.array[id].flag,
      this.setData({
        update:this.data.update,
        array:this.data.array
      })
      this.getBj()
      wx.showToast({
        title:'更新成功',
        icon:'success',
        duration:1500
      })
      wx.hideLoading()
    },fail:err=>{
      wx.hideLoading()
    }
  })
},
//改变修改状态
goUpdate:function(e){
  wx.showToast({
    title: '文本可修改',
    icon:"none",
    duration:1500
  })
  this.data.update.flag=false
  this.data.update.nr=this.data.array[e.currentTarget.dataset.id].nr,
  this.setData({
    update:this.data.update
  })
},
//记录多行文本框的内容
updateText:function(e){
  this.data.update.nr=e.detail.value
   this.setData({
       update:this.data.update
   })
},

// 去某个页面
goPage:function(e){
  //先把切换时间设为0,在切换页面
  this.setData({
    go:0,
  })
  let pageNumber=parseInt(e.detail.value)-1
  if(pageNumber<0||pageNumber>this.data.array.length-1){
    wx.showToast({
      title: '请检查你输入的页码',
      icon:'none',
      duration:1500
    })
      return
  }
  this.setData({
    pageNumber:pageNumber,
    kong:''
  })
},
//页面切换
togglePage:function(e){
  this.data.update.flag=true;
  this.setData({
    go:800,
    bgcolor:true,
    update:this.data.update
  })

},
//切换时改变背景色
change:function(e){
  this.setData({
    bgcolor:false,
    pageNumber:e.detail.current
  })
  
},

//获取定位
getDw:function(e){
  wx.showLoading({
    title: '正在获取区域',
    mask:true
  })
 wx.getLocation({
  type: 'gcj02',
  success:res=> {
    const latitude = res.latitude
    const longitude = res.longitude
    // const speed = res.speed
    // const accuracy = res.accuracy
    // const keyword='娱乐场'
    //最小范围10m
    const boundary='nearby('+res.latitude+','+res.longitude+',10)'
    const key='W5GBZ-CS4K6-6QBSP-E4WX5-OC75Q-67BH7'
    const url='https://apis.map.qq.com/ws/place/v1/search?boundary='+boundary+'&key='+key+'&page_size=1'
    wx.request({
      url:url,
      success:re=>{
        this.data.address=re.data.data[0].ad_info.province+re.data.data[0].ad_info.city+re.data.data[0].ad_info.district
        te.text1=''
        this.setData({
          address:this.data.address
        })
        wx.hideLoading()
      },fail:er=>{wx.hideLoading()}
    })
    // wx.openLocation({
    //   latitude,
    //   longitude,
    //   scale: 18,success:res=>{
    //     console.log('获取位置成功',res)
    //   }
    // })
  },fail:err=>{
    wx.hideLoading();
    if(err.errMsg=='getLocation:fail auth deny'){
      this.getLocation()
    }else{
      wx.showToast({
        title: '请确认位置信息已打开',
        icon:'none',
        duration:1500
      })
    }
  }
 })
},

//获取定位权限
getLocation:function(){
  var that = this
  wx.authorize({
    scope: 'scope.userLocation',//发起定位授权
    success: function () {
      console.log('有定位授权')
    //授权成功，此处调用获取定位函数
    }, fail() {
//如果用户拒绝授权，则要告诉用户不授权就不能使用，引导用户前往设置页面。
      console.log('没有定位授权')
      wx.showModal({
        cancelColor: 'cancelColor',
        title: '没有授权无法获取位置信息',
        content: '是否前往设置页面手动开启',
        success: function (res) {
          if (res.confirm) {
            wx.openSetting({
              withSubscriptions: true,
            })
          } else {
            wx.showToast({
              icon: 'none',
              title: '您取消了定位授权',
            })
          }
        }, fail: function (e) {
        }
      })
    }
  })
},



//添加页面的文字动画
 show:function(){ 
  if(this.data.show){
    this.showText(1000,'1rpx')
  }else{
    this.showText(1000,'351rpx')
  }
   this.setData({
     show:!this.data.show
   })
 },




 // 显示遮罩层
 showModal: function () {
   var that=this;
   that.setData({
      addFlag:true
   })
   var animation = wx.createAnimation({
     duration: 600,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
     timingFunction: 'ease',//动画的效果 默认值是linear
   })
   this.animation = animation
  
   setTimeout(()=>{
    this.fadeIn();//调用显示动画
   },100)
 },

 // 隐藏遮罩层
 hideModal: function () {
   var that=this; 
   var animation = wx.createAnimation({
     duration: 1000,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
     timingFunction: 'ease',//动画的效果 默认值是linear
   })
   this.animation = animation
   that.fadeDown();//调用隐藏动画   
   setTimeout(function(){
     that.setData({
      addFlag:false
     })      
   },720)//先执行下滑动画，再隐藏模块
   
 },

 //动画集
 fadeIn:function(){
   this.animation.translateY(0).step()
   this.setData({
     animationData: this.animation.export()//动画实例的export方法导出动画数据传递给组件的animation属性
   })
     
 },
 fadeDown:function(){
   this.animation.translateY(-this.data.addPage.height).step()
   this.setData({
     animationData: this.animation.export(),  
   })
 }, 


 //文本动画
 showText: function (time,px) {
  var animation = wx.createAnimation({
    duration:time,
    timingFunction: 'linear',
  })
  this.animation = animation
  this.animation.translateY(px).step()
  this.setData({
    animationText: this.animation.export(),  
  })
 }


})