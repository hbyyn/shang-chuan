<template>
  <div class="error-page" id='error-page'>
      <div class="error-code">4<span>0</span>4</div>
      <div class="error-desc">{{$t('errorRouter.errorRouterTitle')}}</div>
      <div class="error-handle">
          <router-link to="/">
            <el-button type="primary" size="medium">{{$t('errorRouter.homePage')}}</el-button>
          </router-link>
          <el-button class="error-btn" type="primary" size="medium" @click="goBack">{{$t('errorRouter.previousPage')}}</el-button>
      </div>
  </div>
</template>

<script>
export default {
  methods: {
      goBack(){
          this.$router.go(-2);
      },
      pageResize(){
          this.$nextTick(()=>{
            var errorPage = document.getElementById('error-page');
            errorPage.style.height = document.documentElement.offsetHeight + 'px'
          })
      }
  },
  created(){
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

<style  lang="scss">
    .error-page{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100%;
        height: 100%;
        background: #f3f3f3;
        box-sizing: border-box;
        min-height: 400px;

      .error-code{
          line-height: 1;
          font-size: 250px;
          font-weight: bolder;
          color: #2d8cf0;
          span{
            color: #00a854;
        }
      }

      .error-desc{
          font-size: 30px;
          color: #777;
      }

      .error-handle{
          margin-top: 30px;
      }

      .error-btn{
          margin-left: 40px;
      }
    }
</style>
