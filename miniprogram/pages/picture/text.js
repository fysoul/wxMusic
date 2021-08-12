 // 图片自适应
function heightAnd() {
  for (const key in this.data.new) {
    wx.getImageInfo({
        src: this.data.new[key].img,
        success:res=> {
         if(res.width>=340){
           this.data.new[key].width=340
           this.data.new[key].height=340/(res.width/res.height)
            this.setData({
              new:this.data.new
            })
         }else{
          this.data.new[key].width=res.width
          this.data.new[key].height=res.width/(res.width/res.height)
           this.setData({
             new:this.data.new
           })
         }           
        }
      })

      
          
    }
}