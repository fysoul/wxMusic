// miniprogram/pages/middle/middle.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      isSelect:-1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  //点击
  go:function(e){
    let id=e.currentTarget.dataset.id
    if(id==5){
      wx.showToast({
        title: '请解锁后使用',
        icon:'none',
        duration:2000
      })
      return
    }
    this.setData({
      isSelect:id
    })
    setTimeout(()=>{
      this.setData({
        isSelect:-1
      })
    },100)
    
 },
  
})