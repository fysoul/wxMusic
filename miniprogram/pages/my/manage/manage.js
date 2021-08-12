// miniprogram/pages/my/manage/manage.js
var app=getApp();
var newdate=app.getDate()
Page({

  /**
   * 页面的初始数据
   */
  data: {
     work:{wc:0,no:0,gq:0},
     journal:{all:0,bj:0},
     rec:{all:0,sh:0,tj:0},
     pictrue:{all:0,sc:0},
     music:{all:0,sc:0,xz:0}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     this.getWork()
     this.getJournal()
     this.getRec()
     this.getPictrue()
  },
  
  // 获取工作
  getWork:function(){
    wx.cloud.callFunction({
       name:'get_workAll',
       success:res=>{
         let data=res.result.data
         for(let i=0;i<data.length;i++){
           if(data[i].type){
              this.data.work.wc++
           }else{
            const time=new Date(data[i].completedate).getTime()-new Date(newdate).getTime()
            const day= time/(86400*1000)
            if(day<0){
              this.data.work.gq++
            }
              this.data.work.no++
           }

           if(i==data.length-1){
              this.setData({
                 work:this.data.work
              })
           }
         }
       },fail:err=>{
       }
    })
  },

  // 获取日志
  getJournal:function(){
    wx.cloud.callFunction({
      name:'get_journal',
      success:res=>{
        let data=res.result.data
        this.data.journal.all=data.length
        for(let i=0;i<data.length;i++){
            if(data[i].flag){
              this.data.journal.bj++
            }

            if(i==data.length-1){
              this.setData({
                journal:this.data.journal
              })
            }
        } 
      },fail:err=>{
      }
    })
  },

  // 获取推荐
  getRec:function(){
    wx.cloud.callFunction({
      name:'get_rec',
      success:res=>{
        let data=res.result.data
        this.data.rec.all=data.length
        for(let i=0;i<data.length;i++){
            if(data[i].flag==1){ 
                 this.data.rec.sh++
            }else if(data[i].flag==2){
               this.data.rec.tj++
            }
            if(i==data.length-1){
              this.setData({
                rec:this.data.rec
              })
            }
        }
              
      },fail:err=>{
      }
    })
  },

  //获取图片
  getPictrue:function(){
    wx.cloud.callFunction({
      name:'get_AllPictrue',
      success:res=>{
        let data=res.result.data
        this.data.pictrue.all=data.length
        for(let i=0;i<data.length;i++){
           if(data[i].sc){
             this.data.pictrue.sc++
           }
           if(i==data.length-1){
             this.setData({
              pictrue:this.data.pictrue
             })
           }
        }
              
      },fail:err=>{
      }
    })
  }

})