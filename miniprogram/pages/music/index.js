// miniprogram/pages/index/index.js
var  n=1;
var newdate;
var app=getApp()
var musicNumber=1;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    src:'cloud://cloud2-5gvrnfck04d8ef24.636c-cloud2-5gvrnfck04d8ef24-1306243438/system/20.jpg',
    imgFlag:false,
    animationData:{},
    flag:-1,
    height:45,
    show:-1,
    desflag:true,
    closeflag:false,
    arrayTime:[],
    journal:[],
    rec:[],
    user:[],
    loginFlag:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.getRecommend()
    this.getwork()
    this.getjournal()
    this.getSupport()
    newdate=app.getDate()
    this.getImage()
  }, 
  getImage:function(){
     wx.getImageInfo({
       src: this.data.src,
       success:res=>{
         this.setData({
           imgFlag:true
         })
       }
     })
  },

  //获取未完成的工作
  getwork:function(){
    wx.cloud.callFunction({
      name:"get_workAll",
      data:{
        type:false
      },
      success:res=>{
        let data=res.result.data
        let arr=[]
        for(let i=0;i<data.length;i++){
          const time=new Date(data[i].completedate).getTime()-new Date(newdate).getTime()
          const day= time/(86400*1000)
          if(day<2&&day>0){
            arr.push(data[i].name)
          }        
          if(i==data.length-1){
             this.setData({
              arrayTime:arr
             })
          }
        }
      },fail:err=>{
      }
    })
  },
  //获取标记的日志
  getjournal:function(){
    wx.cloud.callFunction({
      name:'get_journal',
      data:{
        flag:true
      },success:res=>{
        let arr=[]
        let data=res.result.data
        for(let i=0;i<data.length;i++){
          let date=[]
          if(/\//g.test(data[i].xc)){
             date=data[i].xc.split('/')
          }       
          const time=new Date(date[0]).getTime()-new Date(newdate).getTime()
          const day= time/(86400*1000)
          if(day>0&&day<2){
            arr.push(date[1].split(' ')[1])
          }
          if(i==data.length-1){
             this.setData({
              journal:arr 
             })
          }
        }
      },fail:err=>{
      }
    })
  },

  //获取随机推荐
  getRecommend:function(){
      wx.cloud.callFunction({
        name:'get_recommend',
        data:{
          flag:2//获取审核成功的
        },success:res=>{
          
          this.data.rec=res.result.data
          this.setData({
            rec:this.data.rec
          })
          this.getHeight()
        },fail:err=>{
        }
      })
  },

  // 获取支持
  getSupport:function(){
    wx.cloud.callFunction({
      name:'get_support',
      success:res=>{
        this.data.user=res.result.data
        this.setData({
          user: this.data.user
        })
      },fail:err=>{
      }
    })
  },


  // 去音乐收藏
  goMusic:function(e){
    this.flag(e)
    musicNumber++
    wx.navigateTo({
      url: '../like/like?number='+(musicNumber-1),
    })
  },

  // onShow:function(){

  // },
// 去图片
  goPicture:function(e){
    this.flag(e)
    wx.navigateTo({
      url: '../picture/picture?number='+(musicNumber-1),
    })
   
  },
  // 去日志
  goGournal:function(e){
    this.flag(e)
    wx.navigateTo({
      url: '../journal/journal',
    })
  },
  // 去工作
  goWork:function(e){
    this.flag(e)
    wx.navigateTo({
      url: '../work/work',
    })
  },

  
  showText: function (n) {
    this.animation = wx.createAnimation({
      duration: 200,
      timingFunction: 'ease',
      delay: 0,
      transformOrigin: '50% 50% 0',
      })
      this.rotateAni(n)
   },
   rotateAni: function (n) {
    this.animation.rotate(90*n).step()
    this.setData({
     animationData: this.animation.export(),
    })
    setTimeout(()=>{
      this.setData({
        closeflag:true
       })
    },300)
   },


   //点击音乐等样式
   flag:function(e){
     let id=e.currentTarget.dataset.id
     this.setData({
       flag:id
     })
     setTimeout(()=>{
      this.setData({
        flag:-1
      })
     },300)
   },

   //获取每日推荐里面每个内容的高
   getHeight:function(){
    var query = wx.createSelectorQuery();
    query.selectAll(".tj").boundingClientRect((rect)=> {
      this.setData({
        height:rect[0].height
      })
  }).exec();
   },

  //  点击简介
   des:function(e){
      let id=e.currentTarget.dataset.id
      if(this.data.desflag){
        this.setData({
          showID:id,
          desflag:false
        })
      }else{
        this.setData({
          showID:-1,
          desflag:true
        })
      }

   },

  //  关闭
  close:function(){
     this.showText(1)
  }


})