<template>
  <div id="about">
    <div id='aboutBox'>
      <img src="../../assets/img/logo.jpg" alt="logo" width="200">
      <div>
        <span>{{$t('about.edition')}}：</span>
        <span>1.00.00</span>
      </div>
      <div>
        <span>{{$t('about.copyright')}}：</span>
        <span>{{$t('about.copyrightTitle')}}</span>
      </div>
      <div>
        <a href="http://www.well-co.cn/" :alt="$t('company')">{{$t('company')}}</a>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {

      }
    },
    methods: {
      //适配页面
      pageResize(){
        this.$nextTick(()=>{
          var about = document.getElementById('about');
          var aboutBox = document.getElementById('aboutBox');
          if(document.documentElement.scrollHeight > document.documentElement.offsetHeight){
            about.style.height = 400 + 'px'
          }else{
            about.style.height = document.documentElement.scrollHeight -180 + 'px'
          }
        })
      }
    },
    mounted(){
      let _this = this;
      _this.pageResize();
      window.onresize = ()=>{
        _this.pageResize();
      }
    },
    destroyed(){
      window.onresize = null;
    }
  }

</script>
<style lang="scss">
#about{
  background-color: #fff;
  border-radius: 4px;
  position: relative;
  #aboutBox{
    position: absolute;
    width: 620px;
    height: 240px;
    left: 50%;
    margin-left: -310px;
    top: 50%;
    margin-top: -120px;
    background-color: #efefef;
    border-radius: 4px;
    img{
      position: absolute;
      top: 15px;
      left: 200px;
    }
    div:nth-child(2){
      position: relative;
      top: 140px;
      left: 20px;
    }
    div:nth-child(3){
      position: relative;
      top: 150px;
      left: 20px;
    }
    div:nth-child(4){
      position: relative;
      top: 160px;
      left: 20px;
      // text-align: center;
    }
  }
}
</style>
