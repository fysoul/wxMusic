// miniprogram/pages/rec/rec.js
var type=-1,title='',text='',_id='';//需要添加的推荐初始
var nickName=''
Page({

  /**
   * 页面的初始数据
   */
  data: {
    animationData0:{},
    animationData1:{},
    animationData2:{},
    animationData3:{},
    animationData4:{},
    flag:false,
    selectnum:-1,
    array:[],
    textflag:false,
    updateFlag:false,
    firstFlag:true,
    textData:{type:-1,title:'',text:'',_id:'',id:-1}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function (res) {
    nickName=res.name
      this.getRec()
      setTimeout(()=>{
        this.setData({
          flag:true
        })
      },200)
     
   
  },

  // 去上传
  load:function(e){
    wx.showLoading({
      title: '请耐心等待',
      mask:true
    })
    type=this.data.array[e.currentTarget.dataset.id].type;
    title=this.data.array[e.currentTarget.dataset.id].title
    text=this.data.array[e.currentTarget.dataset.id].text
    _id=this.data.array[e.currentTarget.dataset.id]._id
     wx.cloud.callFunction({
       name:'add_recommend',
       data:{
          type:type,
          title:title,
          text:text,
          nickName:nickName,
          id:_id,
          flag:1
       },success:res=>{
           wx.cloud.callFunction({
             name:'update_rec',
             data:{
               _id:_id,
                flag:1
             },success:re=>{
              wx.hideLoading()
              wx.showToast({
                title: '上传成功',
                icon:'success'
              }) 
              this.data.array[e.currentTarget.dataset.id].flag=1
              this.setData({
                array:this.data.array
              })
             },fail:er=>{ wx.hideLoading()}
           })        
       },fail:err=>{
        wx.hideLoading()
       }
     })
  },

  // 增加到数据库
  addRec:function(){
    var  reg=/^\s/g.test(title)
    if(type<0||type>4){
      wx.showToast({
        title: '请选择类型',
        icon:'none'
      })
      return
    }else if(reg||title==''){
      wx.showToast({
        title: '标题开头不能为空',
        icon:'none'
      })
      return
    }
    wx.showLoading({
      title: '正在添加',
    })
    wx.cloud.callFunction({
      name:'add_rec',
      data:{
        type:type,
        title:title,
        text:text,
        flag:0
      },success:res=>{
        wx.hideLoading()
        wx.showToast({
          title: '添加成功',
          icon:'success',
          mask:true,
          duration:1500
        })
        let object={}
        object._id=res.result._id,
        object.type=type,
        object.title=title,
        object.text=text,
        object.flag=0
        this.data.array.unshift(object)
        this.setData({
          array:this.data.array
        })
        title='',text=''
        this.setData({
          textflag:true
        })
      },fail:err=>{
        wx.hideLoading()
      }
    })
  },

  // 获取数据库数据
  getRec:function(){
     wx.cloud.callFunction({
       name:'get_rec',
       success:res=>{
         let data=res.result.data;
         this.data.array=data.reverse()
         this.setData({
           array:this.data.array
         })
       },fail:err=>{
       }
     })
  },

  // 删除数据库
  removeRec:function(e){

    wx.showModal({
      title:'',
      content:"确认删除",
      success:res=>{
        if(res.confirm){
          wx.showLoading({
            title:'正在移除'
          })
           wx.cloud.callFunction({
             name:'remove_rec',
             data:{
                _id:this.data.array[e.currentTarget.dataset.id]._id
             },success:res=>{
               wx.hideLoading()
               wx.showToast({
                 title: '移除成功',
                 icon:'success',
                 duration:1500
               })
               this.data.array.splice(e.currentTarget.dataset.id,1)
               this.setData({
                 array: this.data.array
               })
             },fail:err=>{
              wx.hideLoading()
             }
           })
        }
      }
    })
    
  },

updateRec:function(e){
  wx.showLoading({
    title:'正在修改',
  })
    wx.cloud.callFunction({
      name:'update_rec',
      data:{
        type:type,
        title:title,
        text:text,
        _id:this.data.textData._id
      },success:res=>{
        wx.hideLoading()
        wx.showToast({
          title: '修改成功',
          icon:'success',
          duration:1500
        })
        this.data.array[e.currentTarget.dataset.id].type=type
        this.data.array[e.currentTarget.dataset.id].title=title
        this.data.array[e.currentTarget.dataset.id].text=text
        this.setData({
          array:this.data.array
        })
      },fail:err=>{
        wx.hideLoading()
      }
    })
},

  //选中的标签
  addTag:function(e){
    let id=e.currentTarget.dataset.id
    this.setData({
      selectnum:id,
      selectTag:id
    })
    setTimeout(()=>{
      this.setData({
        selectTag:-1
      })
    },100)
    type=id
    // ==0?'动漫':id==1?'影视':id==2?'音乐':id==3?'娱乐':'其他'
  },
  //选中的标题和文本
  addTitle:function(e){
    let id=e.currentTarget.dataset.id
    if(id==5){
      title=e.detail.value
    }else{
      text=e.detail.value
    }

  },

  //选中已添加到数据库的文本
  select:function(e){
    title='',text='',type=-1
     this.setData({
       number:e.currentTarget.dataset.id,
       updateFlag:false,
       selectnum:-1
     })
  },
  //去修改
  goUpdate:function(e){
    wx.showToast({
      title: '成功显示 可修改',
      icon:"none",
      duration:1500
    })
    //由于之前定义的全局变量多处已经用到,本应定义保存在数据里面,就又在数据里定义了对象保存当前选中数据
    this.data.textData.type=this.data.array[e.currentTarget.dataset.id].type;
     this.data.textData.title=this.data.array[e.currentTarget.dataset.id].title;
     this.data.textData.text=this.data.array[e.currentTarget.dataset.id].text;
     this.data.textData._id=this.data.array[e.currentTarget.dataset.id]._id;
     this.data.textData.id=e.currentTarget.dataset.id
     type=this.data.array[e.currentTarget.dataset.id].type;
     title=this.data.array[e.currentTarget.dataset.id].title
     text=this.data.array[e.currentTarget.dataset.id].text
     this.setData({
      updateFlag:true,
      number:e.currentTarget.dataset.id,
      textData:this.data.textData,
      selectnum:this.data.array[e.currentTarget.dataset.id].type
     })
     

  },

  showTag: function () {
    this.animation = wx.createAnimation({
      duration: 600,
      timingFunction: 'linear',
      delay: 0,
      transformOrigin: '50% 50% 0',
      })
      
      setTimeout(()=>{
        this.rotateAni4()
      },1300)
      setTimeout(()=>{
        this.rotateAni3()
      },1000)
      setTimeout(()=>{
        this.rotateAni2()
      },700)
      setTimeout(()=>{
        this.rotateAni1()
      },400)
      setTimeout(()=>{
        this.rotateAni()
        this.setData({
          flag:true
        })
      },100)
   },
 
})