var nowArray=[]
var nowObject={}
App({

  onLaunch: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env:"cloud2",
        env:"cloud2-5gvrnfck04d8ef24",
        traceUser: true
       
      })
    }
    this.globalData = {loginFlag:false,userInfo:{nickName:'',avatarUrl:''},nowObject:{},listArray:[],listNumber:-1,
  newList:{},storage:[]}
    wx.getSystemInfo({
      success: (result) => {
        this.globalData.windowHeight=result.windowHeight
        this.globalData.windowWidth=result.windowWidth
      },
    })
    this.globalData.loginFlag=this.checkuser()


    
  },
  // player: kugouPlayer.player, //这样设置之后，在各页面就能通过getApp().player拿到全局播放器对象

  
  //判断用户登录状态
  async checkuser(){
    if(this.globalData.userInfo&&this.globalData.userInfo.nickName&&this.globalData.userInfo.avatarUrl)return true
     var res=await wx.cloud.callFunction({
        name:'get_user'
      })
      if(res.result.code==200){
        this.globalData.userInfo=res.result.data[0]
        return true
      }else{
        return false
      }
      
  },

  //定义全局动画纵向
  slideupshow:function(that,time,param,px,opacity){
    var animation = wx.createAnimation({
      duration: time,
      timingFunction: 'linear',
    });
    animation.translateY(px).opacity(opacity).step();
    var json = '{"' + param + '":""}'
    json = JSON.parse(json);
    json[param] =animation.export()
    //设置动画
    that.setData(json)
  },

   //定义全局动画横向
   toggleShow:function(that,time,param,px,opacity){
    var animation = wx.createAnimation({
      duration: time,
      timingFunction: 'linear',
    });
    animation.translateX(px).opacity(opacity).step();
    var json = '{"' + param + '":""}'
    json = JSON.parse(json);
    json[param] =animation.export()
    //设置动画
    that.setData(json)
  },

   //定义全局动画纵向
   lyrShow:function(that,time,param,px,opacity){
    var animation = wx.createAnimation({
      duration: time,
      timingFunction: 'linear',
    });
    // top(px)
    animation.translateY(px).opacity(opacity).step();
    var json = '{"' + param + '":""}'
    json = JSON.parse(json);
    json[param] =animation.export()
    //设置动画
    that.setData(json)
  },


  getDate:function(){
    var year=new Date().getFullYear();
    var month=new Date().getMonth()+1;
    var day=new Date().getDate();
    month=month<10?('0'+month):month
    day=day<10?('0'+day):day
    let newdate=year+'-'+month+'-'+day
    return newdate
  },
})
