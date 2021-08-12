var app=getApp()
// var iac= wx.createInnerAudioContext()
var iac=wx.getBackgroundAudioManager();//获取全局的背景音乐
var fee=0;//默认不付费
var z=0;//转的次数
var musicId=-1;//当前播放src音乐的ID
var x=0;//第几页
var canplayId=-1;//全局判断音乐是否可以播放
var otherPage={};//其他页面传入的数据
var resData={};//
var pageNumber=0;//判断来自哪个页面
var netNumber=-1;//网络歌曲点击的id
var ImgAndLyr={};
var value;//新建歌单的名
var nowList=-1;//当前歌单用的是哪个数组,用于返回渲染歌单页面
var lyrTime=[];//空时间数组
var toggleNumber=0;
var px=0;//歌词移动距离
var lryFlag=true;
var sepNumber=0;//手指滑动次数
var lyrClear;
Page({
  data: {
    musicArr:[],//来自数据库的所有歌曲
    search:[],//接收的歌曲数组(来自网易接口的音乐)
    playMusic:[],//当前播放歌曲的数组
    leftFlag:false,//主页面和搜索页面滑动动画
    canplayId:-1,//可以播放的歌曲序号,默认没有歌曲
    gqFlag:-1,//歌曲点击增色
    gqTimeFlag:-1,//歌曲点击动画
    nowMusic:{},//当前音乐的信息
    playFlag:false,//判断当前播放状态
    value:'',//文本框同步
    animationRotate:{},//动画转
    change:0,//定义播放状态,0自然播放,1单曲循环,2随机播放
    time:{now:'00:00',duration:'00:00',progress:0,millisecond:0},
    nowArr:0,
    storage:[],//缓存数组
    fromNet:-1,
    newListFlag:true,
    maskFlag:true,
    listArray:[],//歌单数组
    listHave:[],//当前歌曲添加到歌单是否已存在
    msg:'',//当前操作的数据
    lyrIndex:0,//当前播放的时间和歌词数组
    lyrTop:0,
    huIndex:0
  },
 
  // 根据当前播放环境来获取当前播放的歌曲
  checkNow:function(id){
    let x=this.data.nowArr
    this.data.nowMusic.img=ImgAndLyr.img
    this.data.nowMusic.lyr=ImgAndLyr.lyr
    if(x<=5){
      this.data.nowMusic=(x==1?this.data.arr1[id]:x==2?this.data.arr2[id]:x==4?this.data.storage[id]:x==5?this.data.search[id]:this.data.musicArr[id])
       this.setData({
         nowMusic:this.data.nowMusic
       })
     }else{
       let now=x-6;
       this.data.nowMusic=this.data.listArray[now].music[id]
       this.setData({
        nowMusic:this.data.nowMusic
      })
     }
  },

  // 播放
  changePlay:function(id){
    let e={'currentTarget':{'dataset':{'music':this.data.nowMusic,'nowarr':this.data.nowArr,'index':id}}}
    this.play(e)
  },

  //根据当前播放环境返回下次播放id
  getId:function(index){
    let id=canplayId;//获取之前点击播放的序号
    let arr;
    let x=this.data.nowArr
     if(x<6){
      arr=(x==1?this.data.arr1.length:x==2?this.data.arr2.length:x==4?this.data.storage.length:x==5?this.data.search.length:this.data.musicArr.length)
     }else{
       arr=this.data.listArray[x-6].music.length
     }

    if(this.data.change==2){
      id=Math.floor(Math.random()*arr);//随机播放
    }else{
        if(index>=3){
          id=index==3?(id<=0?arr-1:--id):(id>=arr-1?0:++id)
        }else{
           id=this.data.change==0?(id>=arr-1?0:++id):id
        }
    }
    console.log('返回播放的id',id,'当前上下曲',this.data.change)//0,1重复,2?随机
    return id
  },

   //操作后,把数组更改
 getNewArr:function(obj,add){//add(true为添加的对象,false为修改的对象)
  wx.hideLoading()
  this.data.search.splice(netNumber,1,obj)
  if(netNumber!=-1){
     this.setData({
       search:this.data.search,
       msg:obj
     })
  }
  if(this.data.nowMusic.musicid==obj.musicid){
    this.data.nowMusic=obj
  }
  let number=this.data.storage.findIndex((item)=>obj.musicid===item.musicid)
  if(number!=-1){this.data.storage.splice(number,1,obj)}
  if(add){
    this.data.musicArr.unshift(obj)
  }else{
    let index=this.data.musicArr.findIndex((item)=>obj.musicid===item.musicid)
    this.data.musicArr.splice(index,1,obj)
  }          
  this.setData({
    nowMusic:this.data.nowMusic,
    musicArr:this.data.musicArr,
    storage:this.data.storage
  })
  console.log('修改后nowMusic',this.data.nowMusic)
  console.log('修改后musicArr',this.data.musicArr)
  console.log('修改后storage',this.data.storage)
  return {nowMusic:this.data.nowMusic,musicArr:this.data.musicArr,storage:this.data.storage}
},

//更改其他页面的数据
otherPage:function(obj){
  var pages = getCurrentPages()    //获取加载的页面( 页面栈 )
  var currentPage = pages[pages.length - 1]  // 获取当前页面
  var prevPage = pages[pages.length - 2]    //获取上一个页面
  if(obj.list>0){
    let list=this.data.listArray
    for(var i=0;i<list.length;i++){
       let id=list[i].music.findIndex((item)=>item.musicid===obj.musicid)
       if(id!=-1){
        list[i].music.splice(id,1,obj)
       }
       if(i==list.length-1){
         this.setData({
          listArray:list
         })
         app.globalData.listArray=list
       }
    } 
  }
  if(pageNumber!=4){
    if(pageNumber==3){
      currentPage.setData({
        publicArray:this.data.listArray[nowList].music,
        msg:obj
      })
      return
    }
      let json=this.getNowArr(pageNumber)
      currentPage.setData({
        publicArray:json.arr,
        msg:obj
      })
      return
  }
  currentPage.setData({
    publicArray:this.data.storage,
    msg:obj
  })
  wx.showToast({
    title: '执行完毕',
    icon:'none',
    duration:1500
  })
},

//根据传入的now返回当前哪类的数组(0,4,5传入无效)
getNowArr:function(now){//0所有数据库数组,1下载,2收藏,3歌单(6,7,8..子歌单数组),4历史,5网络歌曲
  let arr=[]
  for (const k in this.data.musicArr) {
    if(now==1){
      if(this.data.musicArr[k].src){
         arr.push(this.data.musicArr[k])
      }
    }else if(now==2){
      if(this.data.musicArr[k].like){
         arr.push(this.data.musicArr[k])
      }
    } 
  }
      let json=JSON.stringify(arr)
      let js='{"arr' +now + '":'+json+'}'
      js=JSON.parse(js);
      this.setData(js)
     for (const k in arr) {
      arr[k].img=encodeURIComponent(arr[k].img)
     }
    let jsonArr=JSON.stringify(arr)
    for (const k in arr) {
      arr[k].img=decodeURIComponent(arr[k].img)
     }
    return {'json':jsonArr,'js':js,'arr':arr}
},

   //检测src是否存在,存在就用本地地址
   checkSrc:function(url,musicId){
    if(url&&url!='undefined'){
      iac.src=url;
      iac.play()
      return
    }
    iac.src='https://music.163.com/song/media/outer/url?id='+musicId+'.mp3';
    iac.play()
  },

    //初始函数
    start:function(){  
      this.setData({
        lyrIndex:0,//当前播放的时间和歌词数组
        lyrTop:0,
        huIndex:0,
        lyrText:[],
      })
      lyrTime=[]
      app.lyrShow(this,0,'animationLyr',0,1)
      
     
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:async function (options) {
      this.getDBMusic()
      this.getMusicList()
      wx.getStorage({
        key: 'storage',
        success:res=> {
          let data=res.data
          for(let i=0;i<data.length;i++){
              data[i].img=decodeURIComponent(data[i].img)
            }
          this.setData({
            storage:data
          })
          app.globalData.storage=this.data.storage
        }
      })
  },
  //页面显示
  onShow:async function(){
    const userInfo=await app.checkuser()
    if(!userInfo){
      wx.showToast({
        title: '请授权在使用',
        icon:'none',
        duration:1500
      })
      setTimeout(()=>{
        wx.switchTab({
          url: '../my/my',
        })
      },1500)
     
    }
  },
  //页面隐藏
  onHide: function () {
    let data=this.data.storage
    for(let k=0;k<data.length;k++){
      data[k].img=decodeURIComponent(data[k].img)
    }
    wx.setStorage({
      key:"storage",
      data:data
    })
    

  },
  //页面卸载
  onUnload: function () {
    let data=this.data.storage
    for(let k=0;k<data.length;k++){
      data[k].img=decodeURIComponent(data[k].img)
    }
    wx.setStorage({
      key:"storage",
      data:data
    })
    // app.globalData.musicData=this.data
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
    //当歌曲可以播放时,获取当前播放的歌曲
    iac.onCanplay(()=>{
      this.checkNow(canplayId)
      this.setData({
        canplayId:canplayId,
        playFlag:true,
      })
      wx.hideLoading()
       
      let index=this.data.storage.findIndex((item)=>this.data.nowMusic.musicid===item.musicid)//当前歌曲是否在播放历史中,有就返回它的下标,没有就-1  
       let obj=index>=0?this.data.storage.splice(index,1)[0]:this.data.nowMusic
       this.data.storage.unshift(obj)
       if(this.data.storage.length>100){
         this.data.storage.length--
       }
       var pages = getCurrentPages()    //获取加载的页面( 页面栈 )
       var currentPage = pages[pages.length - 1]  // 获取当前页面
       this.setData({
        storage:this.data.storage
       })
       if(currentPage.route=='pages/music/storage/storage'){
          currentPage.setData({
            publicArray:this.data.storage
          })
       }
    })

    //监听音频的停止事件
    iac.onStop(()=>{
      this.setData({
        nowMusic:{}
      })
    })

    // 暂停事件
    iac.onPause(()=>{
        this.setData({
          playFlag:false,
        })
    })

    // 开始播放事件
    iac.onPlay(() => {
      this.checkNow(canplayId)
      this.duration(this.data.nowMusic.duration)
      this.setData({
        playFlag:true,
      })
      wx.hideLoading()
    })

    // 错误事件触发
    iac.onError((e)=>{
      wx.hideLoading()
      if(fee==1){
        wx.showToast({
          title: '付费音乐 努力中...',
          icon:'none',
          duration:2000
        })
      }else{
        if(this.data.nowMusic.src){
          this.data.nowMusic.src='undefined'
          this.setData({
            nowMusic:this.data.nowMusic
          })
          this.changePlay(canplayId)
        }
        wx.showToast({
          title: '正在尝试连接',
          icon:'none',
          duration:2000
        })
      }  
      canplayId=this.data.canplayId;//当发生错误时,把上次可以播放的歌曲序号赋值给全局
      this.setData({
        // nowMusic:{},
        canplayId:-1,
        playFlag:false
      })
    })

    iac.onTimeUpdate(()=>{
      z++
      this.rotateAni(z)
      this.data.time.progress=iac.currentTime*100000/this.data.time.millisecond
      let m=Math.floor(iac.currentTime/60)
      let s=Math.floor(iac.currentTime-m*60)
      m=m<10?'0'+m:m
      s=s<10?'0'+s:s
      this.data.time.now=m+':'+s
      this.setData({
       time:this.data.time
      })

      if(lyrTime[this.data.lyrIndex]<=iac.currentTime){
        this.setData({
          lyrIndex:++this.data.lyrIndex
        })
        px=this.data.lyrIndex*-28
        if(lryFlag){
            this.setData({
              huIndex:this.data.lyrIndex
            })
            app.lyrShow(this,500,'animationLyr',px+'px',1)
        }
       
      }
      
    })

 
    iac.onEnded(()=>{
      this.start()
      this.setData({
        canplayId:-1,
        playFlag:false,
        nowMusic:{},
      })
      let id=this.getId(0);//传入比3小的数,表示不是点击的上一曲和下一曲
      this.checkNow(id)
      this.changePlay(id)

    })

   iac.onNext(()=>{
    let obj={'currentTarget':{'dataset':{'index':4}}}
    this.playNext(obj)
   })

   iac.onPrev(()=>{
    let obj={'currentTarget':{'dataset':{'index':3}}}
    this.playNext(obj)
   })

  },

  //搜素歌曲
  search:function(e){
    let reg=/\S/g.test(e.detail.value)
    if(!reg||e.detail.value==''){
      wx.showToast({
        title: '没有数据哟',
        icon:'none',
        duration:1500
      })
     return
    }
    //初始化
    x=0;
      this.setData({
        value:e.detail.value,
        search:[],
        fromNet:-1
      })
    //搜索的歌名
     this.getMusic()
  },

  //请求返回音乐数据
  getMusic:function(){
    wx.showLoading({
      title:'加载中',
    })
    let type=1;// 1:单曲 ，10：专辑 ，100：歌手，1000：歌单，1004：MV
    let total=false;//是否返回歌曲总数
    let limit=20;//一页返回多少数据
    let offset=limit*x;//从哪个位置开始查?,为limit的整数倍
    wx.request({
      url: 'https://music.163.com/api/search/get/web?csrf_token=hlpretag=&hlposttag=&s='+this.data.value+'&type='+type+'&offset='+offset+'&total='+total+'&limit='+limit,
      success:res=>{
        wx.hideLoading()
        let data=res.data.result.songs
        let arr=[];
        let obj={}
        for (let k=0;k<data.length;k++) {

          let number=this.data.musicArr.findIndex((item)=>item.musicid==data[k].id)
          if(number!=-1){
            arr.push(this.data.musicArr[number])
            continue;
          }
          obj.name=data[k].name
          let au1=data[k].artists[1]?'/'+data[k].artists[1].name:''
          let au2=data[k].artists[2]?'/'+data[k].artists[2].name:''
          obj.author=data[k].artists[0].name+au1+au2
          obj.duration=data[k].duration
          obj.gd=data[k].album.name
          // obj.id=k+(x*data.length)
          obj.number=k>=9?(k+1):'0'+(k+1)
          obj.musicid=data[k].id
          obj.fee=data[k].fee
          arr.push(obj)
          obj={}
        } 
        x++
        if(data==null||this.data.search.length>=100){
          wx.showToast({
            title: '没有更多了',
            icon:'none',
            duration:2000
          })
          return
        }
        this.setData({
           search:this.data.search.concat(arr),
           gqFlag:-1,
           canplayId:-1,
           leftFlag:true,
        })
        


      },fail:err=>{
        wx.hideLoading()
       
      }
    })
  },

  // 切换到主页面
  goMusic:function(){
     this.setData({
      leftFlag:!this.data.leftFlag
     })
  },

  // 点击歌曲显示的样式
  gqFlag:function(e){   
    this.setData({
      gqFlag:e.currentTarget.dataset.index,
      gqTimeFlag:e.currentTarget.dataset.index,
    })
    setTimeout(()=>{
      this.setData({
        gqTimeFlag:-1,
      })
    },200)
  },

  // 总播放
  play:async function(e){
    this.start()
    wx.showToast({
      title: '缓冲中',
      icon:'none',
      duration:1500
    })
      this.data.fromNet=e.currentTarget.dataset.nowarr==5?e.currentTarget.dataset.index:-1
      fee=e.currentTarget.dataset.music.fee//赋值给全局fee,用于判断是否付费
      musicId=e.currentTarget.dataset.music.musicid//给下面src的get请求参数
      canplayId=e.currentTarget.dataset.index//可以播放的id传给全局,用于canplay监听事件把
      //歌名/专辑/歌手/样式图片
      iac.title = e.currentTarget.dataset.music.name
      // iac.epname = e.currentTarget.dataset.music.gd
      iac.singer =  e.currentTarget.dataset.music.author
      var img=e.currentTarget.dataset.music.img
      var lyr=e.currentTarget.dataset.music.lyr
      var src=e.currentTarget.dataset.music.src
      this.setData({
        nowArr:e.currentTarget.dataset.nowarr,//当前播放环境是本地还是网络
        fromNet:this.data.fromNet,
        nowMusic:e.currentTarget.dataset.music
      })
      if(e.currentTarget.dataset.nowarr==5){
        for (const k in this.data.musicArr) {
          if(this.data.musicArr[k].musicid==musicId){
            // canplayId=parseInt(k);//播放一样的歌,将网络音乐的信息转为本地信息,避免重复添加到数据库
            // this.setData({
            //     // nowArr:0,//当前播放环境是本地还是网络
            //     nowMusic:this.data.musicArr[k],
            //     // fromNet:-1
            // })
            //歌名/专辑/歌手/样式图片
            // iac.title =this.data.musicArr[k].name,
            // iac.singer = this.data.musicArr[k].author
            img=this.data.musicArr[k].img    
            lyr=this.data.musicArr[k].lyr
            src=this.data.musicArr[k].src
            break
          }
      
       }
      }    
        if((img&&img!='undefined')&&(lyr&&lyr!='undefined')){
              iac.coverImgUrl =img
              ImgAndLyr.img=img
              ImgAndLyr.lyr=lyr
              this.closeShow()
              this.changeLyr(lyr)
              this.checkSrc(src,musicId)
        }else{
          wx.request({
            url: 'https://api.muxiaoguo.cn/api/163music?id='+musicId,
            success:res=>{
              iac.coverImgUrl =res.data.data.albumPicurl||'cloud://cloud2-5gvrnfck04d8ef24.636c-cloud2-5gvrnfck04d8ef24-1306243438/upload_picture/1625741246879.png'            
              ImgAndLyr.img=res.data.data.albumPicurl||''
              ImgAndLyr.lyr=res.data.data.lyrics||''
              if(ImgAndLyr.lyr!=''||ImgAndLyr.lyr!=null){
                this.closeShow()
                this.changeLyr(ImgAndLyr.lyr)
            } 
            this.checkSrc(src,musicId)       
            },fail:err=>{
            }
          })
        }
        // this.checkSrc(src,musicId)
        
  },

  // 转换时间为分currentTime
  duration:function(t){
     let m=Math.floor(t/1000/60);
     let s=Math.floor((t-m*60000)/1000)
     m=m<10?'0'+m:m
     s=s<10?'0'+s:s
     let duration=m+':'+s
     this.data.time.duration=duration
     this.data.time.millisecond=t
     this.setData({
      time:this.data.time
     })
  },

  //暂停/播放
  pause:function(){
    if(!this.data.playFlag){
      this.setData({
        playFlag:true
      })
      iac.play()
    }else{
      this.setData({
        playFlag:false
      })
      iac.pause()
    }
  },
  //播放
  playNext:function(da){
    let index=da.currentTarget.dataset.index;//3表示上一曲,4表示下一曲
    let id=this.getId(index);
    this.checkNow(id)
    this.changePlay(id)
  },

  //改变播放方式
  change:function(ch){
    let change=ch.currentTarget.dataset.change
    change=change>=2?0:++change
     this.setData({
       change:change
     })
  },

  //拖动事件
  changing:function(e){
    let value=e.detail.value/100000
    let m=value*this.data.time.millisecond
    this.data.time.progress=e.detail.value
    this.setData({
      time: this.data.time
    })
    iac.seek(m)
    let lyr=lyrTime.findIndex((item)=>item>m)
    if(lyr!=-1){
      this.setData({
        lyrIndex:lyr,
        huIndex:this.data.lyrIndex
      })
      px=this.data.lyrIndex*-56
      app.lyrShow(this,500,'animationLyr',px+'rpx',1)
    }
  },

  // 触底加载
  load:function(e){
    this.getMusic()
  },

  //转动
  rotateAni: function (n) {
    this.animation = wx.createAnimation({
      duration:300,
      timingFunction: 'linear',
      delay: 0,
      transformOrigin: '50% 50% 0',
      })
    this.animation.rotate(20*n).step()
    this.setData({
     animationRotate: this.animation.export()
    })
   },
 

  //获取数据库音乐
  getDBMusic:function(){
      wx.cloud.callFunction({
        name:'get_music',
        success:res=>{
          let data=res.result.data.reverse()
          this.setData({
            musicArr:data,
          })
        },fail:err=>{
        }
      })
  },

   //下载
   download:function(o){
    let obj=o.currentTarget.dataset.nowmusic
   if(obj.src){
     wx.showToast({
       title: '你已下载过',
       icon:'none',
       duration:1500
     })
     return
   }
   wx.showToast({
    title: '正在下载',
    icon:'none',
    duration:1500
  })
   wx.downloadFile({
     url: 'https://music.163.com/song/media/outer/url?id='+obj.musicid+'.mp3',
     success:res=>{
       wx.getFileSystemManager().saveFile({
         tempFilePath:res.tempFilePath,
         success:re=>{
           if(obj.number){
             this.add(re.savedFilePath,0,obj)
           }else{
             wx.cloud.callFunction({
               name:'update_music',
               data:{
                 _id:obj._id,
                 src:re.savedFilePath               
               },success:res=>{
                 obj.src=re.savedFilePath 
                 this.getNewArr(obj,false)
                 if(pageNumber!=0){
                   this.otherPage(obj)
                 }
                 wx.showToast({
                   title: '执行完毕',
                   icon:'none',
                   duration:1500
                 })
                 
               },fail:err=>{
               }
             })
           }
         },fail:er=>{
         }
       })
     },fail:err=>{
     }
   })
 },



  add:function(data,id,obj){//根据第二个参数来判断执行的是下载还是收藏或者增加歌单,0下载,1收藏,2,歌单
    wx.showLoading({
      title: '正在执行',
      mask:true
    })
    let music=obj
    if(id==0){
      music.src=data
      music.like=false
      music.list=0
    }else if(id==1){
      music.src=''
      music.like=true
      music.list=0
    }else{
      music.src=''
      music.like=false
      music.list=1
    } 
    delete music.number
    if(music.id){
      delete music.id
    }
    wx.cloud.callFunction({
      name:'add_music',
      data:{
        music:music
      },
      success:res=>{
        //对歌单特殊处理
        music._id=res.result._id   
        if(id==2){
          data!=null?this.updateList(data,music):this.newList(value,music)
        }
        this.getNewArr(music,true)
        if(pageNumber!=0){
          this.otherPage(obj)
        }
      },fail:err=>{
        wx.hideLoading()  
      }
    })
  },
  
  //修改收藏状态
  changeLike:function(o){
    let obj=o.currentTarget.dataset.nowmusic
      if(obj.number){
        this.add(null,1,obj)
      }else{
        wx.showLoading({
          title: '正在执行',
        })
        wx.cloud.callFunction({
          name:'update_music',
          data:{
            _id:obj._id,
            like:!obj.like
          },success:res=>{
            wx.showToast({
              title: '执行完毕',
              icon:'none',
              duration:1500
            })
            obj.like=!obj.like
            this.getNewArr(obj,false)
            if(pageNumber!=0){
              this.otherPage(obj)
            }
            wx.hideLoading()
          },fail:err=>{
            wx.hideLoading()
          }
        })
      }
  },

// 去下载页面
  goDown:function(){ 
    let json=this.getNowArr(1)
    wx.navigateTo({
      url: 'down/down?data='+json.json,
      events: {
        strEvent: e=>{
          this.play(e.data)
        },
        downEvent:e=>{
          pageNumber=1
          this.download(e.data)
        },
        likeEvent:e=>{
          pageNumber=1
          this.changeLike(e.data)
        },
        listEvent:e=>{
          pageNumber=1
          if(e.data.currentTarget.dataset.creat){
            value=e.data.currentTarget.dataset.creat
            this.addNewList(e.data)
          }else{
            this.addCloudList(e.data)
          }
        },
        textEvent:e=>{
          pageNumber=1
          this.musicList()
        },
        removeEvent:e=>{
          pageNumber=1
          let obj=e.data.currentTarget.dataset.nowmusic
          this.removeCloud(obj)
        }
      },
    })
  },

  

  // 去历史页4
  goStorage:async function(){
    app.globalData.storage=this.data.storage
    let arr=this.data.storage
    for (const k in arr) {
      arr[k].img=encodeURIComponent(arr[k].img)
    }
    let json=JSON.stringify(arr)
    wx.navigateTo({
      url: 'storage/storage?data='+json,
     events: {
        strEvent: e=>{
          pageNumber=4
          this.play(e.data)
         
        },
        downEvent:e=>{
          pageNumber=4
          this.download(e.data)
        },
        likeEvent:e=>{
          pageNumber=4
          this.changeLike(e.data)
        },
        listEvent:e=>{
          pageNumber=4
          if(e.data.currentTarget.dataset.creat){
            value=e.data.currentTarget.dataset.creat
            this.addNewList(e.data)
          }else{
            this.addCloudList(e.data)
          }
        }, removeEvent:e=>{
          pageNumber=4
          this.removeCloud(e)
        }
      },

    })
  },

   // 去收藏页
   goLike:async function(){
    let json=this.getNowArr(2)
    wx.navigateTo({
      url: 'like/like?data='+json.json,
     events: {
        strEvent: e=>{
          pageNumber=2
          this.play(e.data)
        },
        downEvent:e=>{
          pageNumber=2
          this.download(e.data)
        },
        likeEvent:e=>{
          pageNumber=2
          this.changeLike(e.data)
          
        },
        listEvent:e=>{
          pageNumber=2
          if(e.data.currentTarget.dataset.creat){
            value=e.data.currentTarget.dataset.creat
            this.addNewList(e.data)
          }else{
            this.addCloudList(e.data)
          }
        },
        removeEvent:e=>{
          let obj=e.data.currentTarget.dataset.nowmusic
          pageNumber=2
          this.removeCloud(obj)
        }
      },
    })
  },


  // 去歌单页
  goList:async function(){

    let data=this.data.listArray
    for(let i=0;i<data.length;i++){
      data[i].url=encodeURIComponent(data[i].url)
      for (const k in data[i].music) {
        data[i].music[k].img=encodeURIComponent(data[i].music[k].img)
      }
    }
    let jsonArr=JSON.stringify(data)
    wx.navigateTo({
      url: 'list/list?data='+jsonArr,
     events: {
        strEvent: e=>{
          pageNumber=3
          this.play(e.data)
        },
        downEvent:e=>{
          pageNumber=3
          nowList=e.nowList
          this.download(e.data)
        },
        likeEvent:e=>{
          pageNumber=3
          nowList=e.nowList
          this.changeLike(e.data)
        },
        listEvent:e=>{
          pageNumber=3
          nowList=e.nowList
          if(e.data.currentTarget.dataset.creat){
            value=e.data.currentTarget.dataset.creat
            this.addNewList(e.data)
          }else{
            this.addCloudList(e.data)
          }
        },
        removeEvent:e=>{
          pageNumber=3
          nowList=e.nowList

        }
      },
    })
    for (const h in data) {
      data[h].url=decodeURIComponent(data[h].url)
      for (const n in data[h].music) {
        data[h].music[n].img=decodeURIComponent(data[h].music[n].img)
      }
    }
  },


  //添加到歌单
  musicList:function(){
   
    if(!this.data.nowMusic.musicid){
        wx.showToast({
          title: '选中的歌曲有误',
          icon:'none',
          duration:1500
        })
        return
    }
    let arr=this.data.listArray
    let arrHave=[]
    for(let i=0;i<arr.length;i++){
      let number=arr[i].music.findIndex((item)=>item.musicid===this.data.nowMusic.musicid||item._id===this.data.nowMusic._id)
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
    this.setData({
      msg:this.data.nowMusic
    })
    app.slideupshow(this,800,'animationList',0,1)
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
  //取消新建歌单
  closeListMask:function(){
      this.setData({
        newListFlag:true
      })
  },

  //增加歌单
  addCloudList:async function(e){
    let index= e.currentTarget.dataset.index
    let obj= e.currentTarget.dataset.msg
    // if(obj instanceof Array){
    //   console.log('为数组')
    // }else{
    //   console.log('为对象')
    // }
    if(obj.number){
      this.add(index,2,obj)
    }else{
      this.updateList(index,obj)
    }
  },

  //更新歌单
  updateList:function(index,obj){
    wx.showLoading({
      title:'正在执行',
    })
    wx.cloud.callFunction({
      name:'update_musicList',
      data:{
        _id:this.data.listArray[index]._id,
        listId:obj._id
      }, 
      success:res=>{
        this.data.listArray[index].music.push(obj)
        this.setData({
          listArray:this.data.listArray
        })
        app.globalData.listArray=this.data.listArray
        var pages = getCurrentPages()    //获取加载的页面( 页面栈 )
        var currentPage = pages[pages.length - 1]  // 获取当前页面
        currentPage.closeMusicList()
        currentPage.setData({
          listArray:this.data.listArray,
        })
        wx.hideLoading()
        wx.showToast({
          title: '添加成功',
          duration:1500
        })
      },fail:err=>{
        wx.hideLoading()
      }
    })
  },

  //获取歌单
  getMusicList:function(){
    wx.cloud.callFunction({
      name:'get_musicList',
      success:res=>{
        this.setData({
          listArray:res.result.list
        })
        app.globalData.listArray=res.result.list
      },fail:err=>{
      }
    })
  },

  //获取新建歌单名
  value:function(e){
      value=e.detail.value.trim()
  },
     //新建歌单,需要上传到云数据库
   newList:function(text,obj){
     let img;
     let arr=[];
     let time=app.getDate()
     if(obj instanceof Array){
      img=obj[0].img||''
      for (const k in obj) {
         arr.push(obj[k]._id)
      }
     }else{
       img=obj.img||''
       arr.push(obj._id)
       obj=[obj]
     }
     wx.showLoading({
       title: '正在新建',
     })
    wx.cloud.callFunction({
      name:"add_musicList",
      data:{
        url:img,
        listName:text,
        list:arr,
        time:time,
        des:'',
        type:0
      },
      success:r=>{
        wx.hideLoading()
        wx.showToast({
          title: '上传成功',
          icon:"none"
        })
        let click=this.data.listArray.length
        let object={_id:r.result._id,des:'',list:arr,time:time,url:img,listName:text,type:0,music:obj}
        this.data.listArray.push(object)
        this.setData({
          listArray:this.data.listArray,
        })
        var pages = getCurrentPages()    //获取加载的页面( 页面栈 )
        var currentPage = pages[pages.length - 1]  // 获取当前页面
        currentPage.closeMusicList()
        currentPage.setData({
          listArray:this.data.listArray,
          newListFlag:true
        })
        app.globalData.newList=object
        app.globalData.listArray=this.data.listArray
        if(currentPage.route=='pages/music/music'){
          wx.navigateTo({
            url: 'list/list?click='+click,
          })
        }else{
          wx.navigateTo({
            url:'../list/list?click='+click,
          })
        }
      },fail:err=>{
        wx.hideLoading()
      }
    })      
   },

   //上传并添加新建歌单
   addNewList:function(e){
     value=value?value:e.currentTarget.dataset.creat
     if(value==''||value==null){
      wx.showToast({
        title: '新建歌名有误',
        icon:'none',
      })
      return
     }
    let obj=e.currentTarget.dataset.msg
    if(obj.number){
      this.add(null,2,obj)
      value=''
    }else{
      this.newList(value,obj)
      value=''
    }      
   },

   // 去操作区域(马赛克)
  goMask:function(e){
    netNumber=e.currentTarget.dataset.now
      this.setData({
        maskFlag:false,
        msg:e.currentTarget.dataset.item
      })
  },
  //取消马赛克
  closeMask:function(){
    this.setData({
      maskFlag:true,
    })
  },

  //图片动画(显示歌词)
  closeShow:function(){
     app.toggleShow(this,800,'animationLeft','-51vw',1)
     app.toggleShow(this,800,'animationRight','51vw',1)
  },

  //处理歌词
  changeLyr:function(text){
   let lyrtime=[];
   let lyrText=[];
   let arr=text.split('\n')
   arr.splice(arr.length-1,1)//把最后的空串删除
   for(let i=0;i<arr.length;i++){
      let rel=arr[i].slice(1,10).split(':')
      let m=parseInt(rel[0])*60
      let s=parseFloat(rel[1])
      let t=Math.floor((m+s)*100)/100
      lyrtime.push(t)
      if(arr[i].split(']',2)[1]==''){
        lyrText.push('---')
      }else{
        lyrText.push(arr[i].split(']',2)[1])
      }
   
   }
   lyrTime=lyrtime
   this.setData({
    lyrText:lyrText
   })
  },


  showHeight:function(e){
    let clientY=e.touches[0].clientY
    let lyrY=56*(lyrTime.length+2)
    let sep=0
    sepNumber++
    lryFlag=false
    clearTimeout(lyrClear)
    if(toggleNumber==0){
      toggleNumber=clientY
      return
    }
    if(sepNumber%3==0){
     px=px+((clientY-toggleNumber)/460)*lyrY
    if(px>=0){
        px=0
    }
    if(-px>=lyrY){
      px=-lyrY
    }
      app.lyrShow(this,600,'animationLyr',px+'rpx',1)
    }
    toggleNumber=clientY
  },

  //手指抬起
  closeHeight:function(){
    toggleNumber=0
    lyrClear=setTimeout(()=>{
      px=this.data.lyrIndex*-56
      app.lyrShow(this,500,'animationLyr',px+'rpx',1)
      this.setData({
        huIndex:this.data.lyrIndex
      })
      lryFlag=true
    },2000)
  },

  remove:function(e){
    wx.showToast({
      title: '该页面不支持删除',
      icon:'none',
      duration:1500
    })
  },

  removeCloud:function(obj){
    wx.cloud.callFunction({
      name:'remove_music',
      data:{
        _id:obj._id
      },
      success:res=>{
        this.removeOther(obj)
      },fail:err=>{
      }
    })
  },

  removeOther:function(obj){
    var pages = getCurrentPages()    //获取加载的页面( 页面栈 )
    var currentPage = pages[pages.length - 1]  // 获取当前页面
    var prevPage = pages[pages.length - 2]    //获取上一个页面

    let index=this.data.musicArr.findIndex((item)=>item._id===obj._id)
    if(index!=-1){
      this.data.musicArr.splice(index,1)
    }
    let list=this.data.listArray
    for(let i=0;i<list.length;i++){
         let number=list[i].music.findIndex((item)=>item._id==obj._id)
         if(number!=-1){
          list[i].music.splice(number,1)
         }
    }
    this.setData({
      listArray:list
    })
    app.globalData.listArray=list
    let json=this.getNowArr(pageNumber)
    currentPage.setData({
      publicArray:json.arr,
    })
  },






  


})