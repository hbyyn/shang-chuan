<template>
  <div id="loginInfo">
    <el-form :inline="true" :model="dateQuery" class="demo-form-inline" id="loginInfoQuery">
      <el-form-item :label="$t('loginInfo.dtlIntime')" style="margin-bottom:10px;">
        <el-date-picker v-model="startInTime" type="datetime" :placeholder="$t('common.firstTime')" align="right" :picker-options="startInDatePicker"></el-date-picker>
        <el-date-picker v-model="endInTime" type="datetime" :placeholder="$t('common.endTime')" align="right" default-time="23:59:59" :picker-options="endInDatePicker"></el-date-picker>
      </el-form-item>
      <el-form-item :label="$t('loginInfo.dtlOuttime')" style="margin-bottom:10px;">
        <el-date-picker v-model="startOutTime" type="datetime" :placeholder="$t('common.firstTime')" align="right" :picker-options="startOutDatePicker"></el-date-picker>
        <el-date-picker v-model="endOutTime" type="datetime" :placeholder="$t('common.endTime')" align="right" default-time="23:59:59" :picker-options="endOutDatePicker"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{$t('common.query')}}</el-button>
      </el-form-item>
    </el-form>
    <el-table id="loginInfoTable" :data="loginInfoData" border style="width:100%;" size="mini">
      <!-- <el-table-column prop="dtlSeq" :label="$t('loginInfo.dtlSeq')"></el-table-column> -->
      <el-table-column prop="clientId" :label="$t('loginInfo.clientId')" ></el-table-column>
      <el-table-column prop="dtlCreator" :label="$t('loginInfo.dtlCreator')" ></el-table-column>
      <el-table-column prop="dtlCreateTime" :label="$t('loginInfo.dtlCreateTime')" ></el-table-column>
      <el-table-column prop="dtlIp" :label="$t('loginInfo.dtlIp')" ></el-table-column>
      <el-table-column prop="loginId" :label="$t('loginInfo.loginId')" ></el-table-column>
      <el-table-column prop="dtlIntime" :label="$t('loginInfo.dtlIntime')" ></el-table-column>
      <el-table-column prop="dtlOuttime" :label="$t('loginInfo.dtlOuttime')" ></el-table-column>
      <el-table-column prop="dtlDesc" :label="$t('loginInfo.dtlDesc')" ></el-table-column>
    </el-table>
    <el-pagination id="loginInfoPage" :class="{activeBackground: active}" style="border: 1px solid #ebeef5;border-top:0px;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="10" :pager-count="5" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
  </div>
</template>
<script>
export default {
  data() {
    return {
      startInDatePicker: this.changeInStart(),
      endInDatePicker: this.changeInEnd(),
      startInTime: '',
      endInTime: '',
      startOutDatePicker: this.changeOutStart(),
      endOutDatePicker: this.changeOutEnd(),
      startOutTime: '',
      endOutTime: '',
      typeDisabled: true,
      dateQuery: {},
      loginInfoData: [],
      //当前页码
      currentPage: 1,
      //每页多少条
      pageTotal: 10,
      //数据总数
      total: 0,
      active: true
    };
  },
  watch:{
    startInTime: function () {
      this.endInDatePicker = this.changeInEnd();
      this.startInDatePicker = this.changeInStart();
    },
    endInTime: function () {
      this.endInDatePicker = this.changeInEnd();
      this.startInDatePicker = this.changeInStart();
    },
    startOutTime: function () {
      this.endOutDatePicker = this.changeOutEnd();
      this.startOutDatePicker = this.changeOutStart();
    },
    endOutTime: function () {
      this.endOutDatePicker = this.changeOutEnd();
      this.startOutDatePicker = this.changeOutStart();
    }
  },
  methods: {
    changeInStart(){
      let self = this
      if (self.endInTime) {
        return {
          disabledDate(time) {
            return time.getTime() > self.endInTime;
          }
        }
      } else {
        return {
          disabledDate(time) {
            return false;
          }
        }
      }
    },
    changeInEnd(){
      let self = this
      if(self.startInTime){
        return {
          disabledDate(time) {
            return time.getTime() < self.startInTime;
          }
        }
      }else{
        return {
          disabledDate(time) {
            return false;
          }
        }
      }
    },
    changeOutStart(){
      let self = this
      if (self.endOutTime) {
        return {
          disabledDate(time) {
            return time.getTime() > self.endOutTime;
          }
        }
      } else {
        return {
          disabledDate(time) {
            return false;
          }
        }
      }
    },
    changeOutEnd(){
      let self = this
      if(self.startOutTime){
        return {
          disabledDate(time) {
            return time.getTime() < self.startOutTime;
          }
        }
      }else{
        return {
          disabledDate(time) {
            return false;
          }
        }
      }
    },
    //获取列表数据
    getEchart(pageIndex, pageSize,startLoginTime,endLoginTime,startLogoutTime,endLogoutTime) {
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG + "/api/weblogindtl/select",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            sessionStorage.getItem("loginPrefix") +
            " " +
            sessionStorage.getItem("loginToken")
        },
        data: {
          'pageIndex': pageIndex,
          'pageSize': pageSize,
          'startLoginTime': startLoginTime,
          'endLoginTime': endLoginTime,
          'startLogoutTime': startLogoutTime,
          'endLogoutTime': endLogoutTime
        }
      })
        .then(res => {
          if (res.data.statusCode == 200) {
            this.total = res.data.data.count;
            this.loginInfoData = [];
            res.data.data.resultObjects.forEach(val => {
              this.loginInfoData.push({
                dtlSeq: val.dtlSeq,
                clientId: val.clientId,
                dtlCreator: val.dtlCreator,
                dtlCreateTime: val.dtlCreateTime.replace('T',' '),
                dtlIp: val.dtlIp,
                loginId: val.loginId,
                dtlIntime: val.dtlIntime,
                dtlOuttime: val.dtlOuttime,
                dtlDesc: val.dtlDesc
              });
            });
            this.pageResize();
          } else if (res.data.statusCode == 407 || res.data.statusCode == 402) {
            this.$router.push({ path: "/login" });
            this.$message({
              showClose: true,
              duration: 2000,
              type: "warning",
              message: this.$t("common.logoutTitle")
            });
          }
        })
        .catch(res => {
          // console.log(res)
        });
    },

    //切换页码
    handleSizeChange(val) {
      this.pageTotal = val;
      let startIn = '', endIn = '', startOut = '', endOut = '';
      if(this.startInTime){
        startIn = this.startInTime.toString().split('GMT')[0];
      }
      if(this.endInTime){
        endIn = this.endInTime.toString().split('GMT')[0];
      }
      if(this.startOutTime){
        startOut = this.startOutTime.toString().split('GMT')[0];
      }
      if(this.endOutTime){
        endOut = this.endOutTime.toString().split('GMT')[0];
      }
      this.getEchart(this.currentPage,this.pageTotal,startIn,endIn,startOut,endOut)
    },

    //切换每页数量
    handleCurrentChange(val) {
      this.currentPage = val;
      let startIn = '', endIn = '', startOut = '', endOut = '';
      if(this.startInTime){
        startIn = this.startInTime.toString().split('GMT')[0];
      }
      if(this.endInTime){
        endIn = this.endInTime.toString().split('GMT')[0];
      }
      if(this.startOutTime){
        startOut = this.startOutTime.toString().split('GMT')[0];
      }
      if(this.endOutTime){
        endOut = this.endOutTime.toString().split('GMT')[0];
      }
      this.getEchart(this.currentPage,this.pageTotal,startIn,endIn,startOut,endOut)
    },

    //按条件检索
    onSubmit() {
      let startIn = '', endIn = '', startOut = '', endOut = '';
      if(this.startInTime){
        startIn = this.startInTime.toString().split('GMT')[0];
      }
      if(this.endInTime){
        endIn = this.endInTime.toString().split('GMT')[0];
      }
      if(this.startOutTime){
        startOut = this.startOutTime.toString().split('GMT')[0];
      }
      if(this.endOutTime){
        endOut = this.endOutTime.toString().split('GMT')[0];
      }
      this.getEchart(this.currentPage,this.pageTotal,startIn,endIn,startOut,endOut)
    },

    //适配界面
    pageResize() {
      this.$nextTick(() => {
        var app = document.getElementById("app");
        var loginInfo = document.getElementById("loginInfo");
        var loginInfoQuery = document.getElementById("loginInfoQuery");
        var loginInfoTable = document.getElementById("loginInfoTable");
        var loginInfoPage = document.getElementById("loginInfoPage");
        if (document.body.scrollHeight > document.body.offsetHeight) {
          loginInfoPage.style.width = loginInfoTable.clientWidth - 11 + "px";
          loginInfoPage.style.paddingLeft = "25px";
          loginInfoPage.style.paddingRight = "25px";
          loginInfoPage.style.marginLeft = -loginInfoPage.offsetWidth / 2 + "px";
          loginInfoPage.style.position = "fixed";
          this.active = true;
        } else {
          loginInfoPage.style.paddingLeft = "5px";
          loginInfoPage.style.position = "static";
          loginInfoPage.style.marginLeft = "0px";
          this.active = false;
        }
      });
    }
  },
  mounted() {
    let _this = this;
    _this.getEchart(1, 10);
    _this.pageResize();
    window.onresize = () => {
      _this.pageResize();
    };
  },
  destroyed() {
    window.onresize = null;
  }
};
</script>
<style lang="scss">
#loginInfo {
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
  .el-form-item {
    margin-bottom: 20px;
  }
  #loginInfoPage {
    left: 50%;
    bottom: 40px;
    z-index: 2000;
    padding: 5px;
    background-color: rgba(75, 75, 75, 0);
    &.activeBackground {
      background-color: #fff;
    }
  }
  .ql-toolbar {
    border-radius: 4px 4px 0px 0px;
    padding: 4px 8px;
  }
  .ql-container {
    border-radius: 0px 0px 4px 4px;
    .ql-editor {
      min-height: 240px;
      max-height: 360px;
    }
  }
  .loginInfoTable {
    .el-input.is-disabled {
      .el-input__inner {
        background-color: transparent;
        border-color: transparent;
        color: #606266;
        cursor: default;
      }
    }
    .el-input__suffix {
      display: none;
    }
  }
}
</style>

