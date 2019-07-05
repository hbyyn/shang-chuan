<template>
  <div id='footer'>
    <div class="footer">
      <!-- <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>活动管理</el-breadcrumb-item>
        <el-breadcrumb-item>活动列表</el-breadcrumb-item>
        <el-breadcrumb-item>活动详情</el-breadcrumb-item>
      </el-breadcrumb> -->
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {

      };
    },
    created(){
      // console.log(this.$route)
    }
  }
</script>
<style lang="scss">
#footer{
  position: fixed;
  display: block;
  height: 38px;
  background: #fff;
  bottom: 0px;
  width: 100%;
  z-index: 2000;
  .footer{
    margin: 0 auto;
  }
}
</style>
