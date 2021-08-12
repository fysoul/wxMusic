
var app=getApp();
var index=0;//从第几页开始查,固定一页查询5条数据
var click=false;//判断多行文本是否处于点击(修改)状态
var complete=false;//判断未完成和已完成的点击的状态
var  nameFlag=true;//定义
var n=1;//马赛克转的次数
var timeMask=900;//马赛克转一圈所需的时间毫秒
var clearTime;
var imageFlag=0;//判断图片状态
Page({

  /**
   * 页面的初始数据
   */
  data: {
    system:{windowHeight:app.globalData.windowHeight,windowWidth:app.globalData.windowWidth},
    isShow:true,
    qx:app.globalData.windowHeight-500,//取消的高度
    upload:{cloudPath:'',filePath:'',name:'上传文档类型资料,其他文件下载无效',size:''},//上传的文件信息,cloudPath不是真正的云id
    addxm:{name:'',nowdate:'2021-01-01',completedate:'',text:''},//上传项目名称丶日期和内容
    all:[],//查询所有的数据
    pagexm:[],//页面显示的项目
    completeFlag:false,//已完成和未完成,默认初始页面未完成
    xiaziFlag:true,
    arrayDay:[],//定义一个保存倒计时的数组
    saveFlag:false,//修改的状态
    update:{_id:'',id:-1,text:'',cloudPath:'',https:''},//记录选中(修改)的项目的id和内容,_id数据库,id:-1默认不选中

    //滑动效果
    hideModal: true, //模态框的状态  true-隐藏  false-显示
    animationData: {},//加载的动画效果
    mask:false,//是否显示全局马赛克
    animationMask:{},
    animationZuo:{},
    animationMr:{},

    //页数
    page:{total:1,number:1,length:0},//total总页数,number当前第几页

    //图片
    image:['cloud://cloud2-5gvrnfck04d8ef24.636c-cloud2-5gvrnfck04d8ef24-1306243438/system/left.png','cloud://cloud2-5gvrnfck04d8ef24.636c-cloud2-5gvrnfck04d8ef24-1306243438/system/right.png'],//两张背景图片

    //下载文件的变量路径
    filePath:'',
    caozuo:false,//操作(完成和删除)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    this.getAllWork() 
    var year=new Date().getFullYear();
    var month=new Date().getMonth()+1;
    var day=new Date().getDate();
    month=month<10?('0'+month):month
    day=day<10?('0'+day):day
    this.data.addxm.nowdate=year+'-'+month+'-'+day
    this.setData({
        addxm:this.data.addxm
    })
  },
     //定义动画效果
  rotateAni: function (n) {
    this.animation.rotate(360*n).step()
    this.setData({
     animationMask: this.animation.export()
    })
   },
  
//去添加项目页面
  goBook:function(){
    this.setData({
      isShow:false
    })
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

 // 查询所有数据
getAllWork:function(){

  for(let i=0;i<2;i++){
    wx.getImageInfo({
      src:this.data.image[i],
      success:res=>{
        if(i==1){
          this.showModal('0rpx',1000,'linear')
        }
      }
    })
   
  }
  this.animation = wx.createAnimation({
    duration: timeMask,
    timingFunction: 'linear',
    delay: 0,
    transformOrigin: '50% 50% 0',
    })
  this.setData({
    mask:true//先显示再执行动画
  })
      //持续执行
      this.rotateAni(n)
      n++//单独执行一次
      clearTime=setInterval(()=>{
        this.rotateAni(n)
        n++
        },timeMask)
  wx.cloud.callFunction({
    name:'get_workAll',
    data:{
      type:this.data.completeFlag
    },success:res=>{
      this.setData({
        all:res.result.data
      })
     
      if(res.result.data<=0){
        clearInterval(clearTime)
        this.setData({
          mask:false
        })
        setTimeout(() => {
          this.hideModal(-(this.data.system.windowWidth/2)+'px',1300,'linear')
        }, 1800);
      }
      this.getPage()   
    },fail:err=>{
      clearInterval(clearTime)
    }
  })
},

//获取页面数和当前页面数据
getPage:function(){
  this.setData({
    pagexm:[]
  })
  this.data.page.total=this.data.all.length%5==0?this.data.all.length/5:Math.floor(this.data.all.length/5)+1;//计算有多少页
  this.data.page.length=this.data.all.length
  let number=this.data.page.number-1
  let len=number*5+5
      len=len<this.data.all.length?len:this.data.all.length
  for(let i=number*5;i<len;i++){
     this.data.pagexm.push(this.data.all[i])
      if(i==len-1){ 
         this.setData({
            pagexm:this.data.pagexm,
            page:this.data.page,            
         })
         
         //处理文本显示
         if(this.data.update.id!=-1&&this.data.update.id<this.data.pagexm.length){
          this.data.update.text=this.data.pagexm[this.data.update.id].text        
          this.setData({
            update:this.data.update          
         })
        }else{
          //表示没选中,可以设this.data.update.id=-1
          this.data.update.text=''
          this.setData({
            update:this.data.update          
         })
        }
         this.timing()
        
      }
  }
},


// 取消添加让状态回到原来的样子
qx:function(){
  this.data.upload.filePath='';
  this.data.upload.cloudPath='';
  this.data.upload.name='上传文档类型资料,其他文件下载无效';
  this.data.upload.size='';
  this.data.addxm.completedate=''
  this.data.addxm.name=''
  this.data.addxm.text=''
  this.setData({
      upload:this.data.upload,
      addxm:this.data.addxm,
      isShow:true
  })
},

//上传文件
  add:function(e){
   if(this.data.upload.cloudPath!=''){
    var https='https://636c-cloud2-5gvrnfck04d8ef24-1306243438.tcb.qcloud.la/'+this.data.upload.cloudPath//用于下载永久路径
    wx.cloud.uploadFile({
      cloudPath:this.data.upload.cloudPath,
      filePath:this.data.upload.filePath,
      success: resa => {      
      this.add_work(resa.fileID,https)
  
      },fail:err=>{
      wx.hideLoading()
    
    }
    })
   }else{
    this.add_work('','')
   }
    
    
  },

  //添加到数据库
  add_work:function(path,https){
    wx.cloud.callFunction({
      name:'add_work',
      data:{ 
        name:this.data.addxm.name,
        completedate:this.data.addxm.completedate,
        nowdate:this.data.addxm.nowdate,
        text:this.data.addxm.text,
        cloudPath:path,
        type:false,
        https:https
      },success:res=>{
        wx.hideLoading()
        wx.showToast({
          title: '刷新生效',
          icon:true
        })
        this.qx()
      },fail:err=>{ wx.hideLoading();}
    })
  },



  // 保存文件的临时路径
  upload:function(e) {
    if(this.data.addxm.name==''){
       wx.showToast({
         title: '请先填写项目名称',
         icon:'none',
         duration:2000
       })
       return
    }
    wx.chooseMessageFile({
    count: 1, //可选择最大文件数 （最多100）
    type: 'all', //文件类型，all是全部文件类型
    success:res=>{
    const filePath = res.tempFiles[0].path //文件本地临时路径
    // 上传文件
    const filename=new Date().getTime()+res.tempFiles[0].name
    const cloudPath= 'work/'+this.data.addxm.name+'/' + filename //云存储路径
    this.data.upload.filePath=filePath;
    this.data.upload.cloudPath=cloudPath;
    this.data.upload.name=res.tempFiles[0].name;
    this.data.upload.size=res.tempFiles[0].size;
    this.setData({
        upload:this.data.upload
    })
    },
    fail:er=>{
    }
   })
  },

  //完成时间(添加)
  completeTime:function(e){
     this.data.addxm.completedate=e.detail.value
     this.setData({
       addxm: this.data.addxm
     })
  },

  //项目名称(添加)
  blur:function(e){  
    if((/\s/g.test(e.detail.value))){
      nameFlag=false
    }else{
      nameFlag=true
    }
    this.data.addxm.name=e.detail.value
    this.setData({
      addxm:this.data.addxm
    })
  },

  //添加内容
  addTextarea:function(e){
     this.data.addxm.text=e.detail.value
     this.setData({
       addxm:this.data.addxm
     })
  },

  // 添加之前检查有必填的内容没
  check:function(){
    if(!nameFlag){
      wx.showToast({
        title: '项目名不能包含空格',
        icon:'none',
        duration:1500
      })
      return
    }
    const name=this.data.addxm.name//项目名
    const completedate=this.data.addxm.completedate//项目完成时间
    const text=this.data.addxm.text//项目内容
    const cloudPath=this.data.upload.cloudPath//项目文件路径
     if(name!=''&&completedate!=''){
       if(text!=''||cloudPath!=''){
        wx.showLoading({
          title: '正在添加',
          mask:true
        })
           this.add();
       }else{
         wx.showToast({
           title: '资料或内容必填一项',
           icon:'none',
           duration:2000
         })
       }
     }else{
      wx.showToast({
        title: '名称或时间不能为空',
        icon:'none',
        duration:2000
      })
     }
  },


  //倒计时
  timing:function(){
    const arr=[]
    for (const key in this.data.pagexm) {
      const time=new Date(this.data.pagexm[key].completedate).getTime()-new Date(this.data.addxm.nowdate).getTime()
      const day= time/(86400*1000)
      arr.push(day)
      if(key==this.data.pagexm.length-1){
        this.setData({
          arrayDay:arr,
          mask:false
        })
        
          setTimeout(() => {
            this.hideModal(-(this.data.system.windowWidth/2)+'px',1300,'linear')
          }, 1800);

        clearInterval(clearTime)
      }
    }  
  },

  //选中项目名
  select:function(e){
    this.data.update.id=e.currentTarget.dataset.id;
    this.data.update.text=this.data.pagexm[e.currentTarget.dataset.id].text
    this.data.update._id=this.data.pagexm[e.currentTarget.dataset.id]._id
    this.data.update.cloudPath=this.data.pagexm[e.currentTarget.dataset.id].cloudPath
    this.data.update.https=this.data.pagexm[e.currentTarget.dataset.id].https
     this.setData({
      update:this.data.update
     })
  },

  //点击未完成或已完成
  CompleteFlag:function(e){ 

     //const只读
    var number=e.currentTarget.dataset.number;
    number=number=='1'?true:false
    if(this.data.completeFlag==number){//如果和前一次状态相同就不需要请求数据库
        return
    }
    this.data.page.number=1//从第一页开始查
    this.data.page.length="正在查询"//解决加载显示前一项的数据
    this.setData({
      page:this.data.page,
      completeFlag:number,
      update:{_id:'',id:-1,text:'',cloudPath:'',https:''},
      xiaziFlag:true
    })
    this.getAllWork()
  },

  //修改
  xiugai:function(){
    wx.showToast({
      title: '限制解除',
      icon:'none',
      duration:1500
    })
     this.setData({
       saveFlag:true
     })
     this.showModal(this.data.system.windowWidth-100+'px',600,'ease')
  },
  
  //  撤销
  chexiao:function(){
    this.hideModal(this.data.system.windowWidth+'px',600,'ease')
  },

  //修改内容
  updateTextarea:function(e){
    click=true;
    this.data.update.text=e.detail.value
    this.setData({
      update:this.data.update
    })
 },

  //修改文本内容
  update:function(){
    if(click&&this.data.update.id!=-1){
      click=false
    }else{
      return
    }
    
    wx.showLoading({
      title: '正在修改',
    })
    wx.cloud.callFunction({
      name:'update_work',
      data:{
        text:this.data.update.text,
        _id:this.data.update._id
      },success:res=>{
        wx.hideLoading()
        wx.showToast({
          title: '刷新生效',
          icon:'success',
          duration:2000
        })
      },fail:err=>{
        wx.hideLoading()
      }
    })
  },

  //操作
  caozuo:function(){
    this.setData({
      caozuo:!this.data.caozuo
    })
  },
//下载和复制
downFlag:function(){
  this.setData({
    xiaziFlag:!this.data.xiaziFlag
  })
},


  //未完成和完成相互移动
  moveType:function(e){
    this.select(e)
    if(this.data.pagexm.length<=1){
      wx.showToast({
        title: '请保留一条数据',
        icon:'none',
        duration:1500
      })
      return
    }
    wx.showLoading({
      title:'正在移动'
    })
    wx.cloud.callFunction({
      name:'update_workType',
      data:{
        _id:this.data.update._id,
        type:!this.data.completeFlag
      },success:res=>{
       this.changeAll()
        wx.hideLoading()
      },fail:err=>{
        wx.hideLoading()

      }
    })
  },

  //下载文件
  //不使用云路径下载,在手机端会失败,应该向网络(https)发起永久下载的路径
download:function(e){
  this.select(e)
  if(this.data.update.https==''){
    wx.showToast({
      title: '未上传文件',
      icon:'none',
      duration:2000
    })
    return
  }
  wx.showLoading({
    title:'下载中'
    ,mask:true
  })
      wx.downloadFile({
        url:this.data.update.https,
        success:re=>{
          var index1 = re.tempFilePath.lastIndexOf(".");
          var index2 = re.tempFilePath.length;
          var postf= re.tempFilePath.substring(index1+1);//后缀名
          wx.getFileSystemManager().saveFile({
            tempFilePath:re.tempFilePath,
            // filePath:wx.env.USER_DATA_PATH +'/work', 
            success:r=> {
                wx.hideLoading()
                wx.showToast({
                  title: '文件已保存至：' + r.savedFilePath,
                  icon: 'none',
                  duration: 1500
                })            
              // 打开该文件
                wx.openDocument({
                  filePath: r.savedFilePath,
                  fileType:postf,
                  success: function (s) {
                  },fail:cuo=>{
                  }
                })
            },fail:er=>{
                wx.hideLoading()
          }

          })
         },fail:error=>{
         wx.hideLoading()
        }
      })              
},

//移除云存储文件
shanchu:function(){
 
  wx.cloud.deleteFile({
    //当项目重名时,不可直接删除文件夹,应删除该文件夹下的文件,当文件删除完,文件夹会自动删除
    fileList: [this.data.update.cloudPath],
    success: res => {
     wx.hideLoading()
     
    },
    fail: console.error
  })
},

//移除文件(数据库和云存储)
remove:function(e){
  this.select(e)
  if(this.data.pagexm.length<=1){
    wx.showToast({
      title: '请保留一条数据',
      icon:'none',
      duration:1500
    })
    return
  }
  wx.showLoading({
    title: '正在删除',
    mask:true
  })
  wx.cloud.callFunction({
    name:'remove_work',
    data:{
      _id:this.data.update._id
    },
    success:res=>{
      this.shanchu()
      this.changeAll()
    
    },fail:err=>{
      wx.hideLoading()
      
    }
  })
},

//删除或改动all里面的数据
changeAll:function(){
  let number=(this.data.page.number-1)*5+this.data.update.id
  this.data.all.splice(number,1)
  this.setData({
    all:this.data.all
  })
  this.getPage()
},


//切换页面
toggle:function(e){
  this.data.page.number=e.currentTarget.dataset.page
  this.setData({
    page:this.data.page
  })
  this.getPage()
  
},

// 长按复制
copy:function(e){
  let that=this;
  this.select(e)
  if(this.data.update.https==''){
    wx.showToast({
      title: '未上传文件',
      icon:'none',
      duration:1500
    })
     return
  }
  wx.setClipboardData({
    data: that.data.update.https, //复制的数据
    success (res) {
      wx.showToast({
        title: '下载链接复制成功',
        icon:'success',
        duration:1500
      })
      wx.getClipboardData({
        success (res) {
        }
      })
    }
  })
},


 


  showModal: function (x,time,ease) {
     var that=this;
     that.setData({
       hideModal:false
     })
     var animation = wx.createAnimation({
       duration:time,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
       timingFunction:ease,//动画的效果 默认值是linear
     })
     this.animation = animation 
     if(x==this.data.system.windowWidth-100+'px'){
       setTimeout(function(){
        that.fadeIn(x);//调用显示动画
       },200)   
     }else{
      that.fadeIn(x);
     }
  
   },

  //  隐藏遮罩层
   hideModal: function (y,time,ease) {
     var that=this; 
     var animation = wx.createAnimation({
       duration:time,//动画的持续时间 默认400ms   数值越大，动画越慢   数值越小，动画越快
       timingFunction:ease,//动画的效果 默认值是linear
     })
     this.animation = animation
     that.fadeDown(y);//调用隐藏动画 
     if(y==this.data.system.windowWidth+'px'){
        setTimeout(function(){
          that.setData({
            hideModal:true,
            saveFlag:false
          })   
        },400)//先执行下滑动画，再隐藏模块
    }
   },
 
   //动画集
   fadeIn:function(x){
     this.animation.translateX(x).step()
     if(x==this.data.system.windowWidth-100+'px'){
        this.setData({
          animationData: this.animation.export()//动画实例的export方法导出动画数据传递给组件的animation属性
        })
     }else{
        this.setData({
          animationZuo: this.animation.export(),
          animationMr: this.animation=this.animation.translateX(this.data.system.windowWidth/2+'px').step().export()
        })
     }
   },

   fadeDown:function(y){
     this.animation.translateX(y).step()
     if(y==this.data.system.windowWidth+'px'){
      this.setData({
        animationData: this.animation.export(),//动画实例的export方法导出动画数据传递给组件的animation属性
        animationMr: this.animation.export()
      })
      }else{
          this.setData({
            animationZuo: this.animation.export(),
            animationMr: this.animation=this.animation.translateX(this.data.system.windowWidth+'px').step().export()
          })
      }
   },
   
})