<template>
  <div id="faceChange">
    <el-form :inline="true" :model="dateQuery" class="demo-form-inline" id="faceChangeQuery">
      <el-form-item :label="$t('deviceu.deviceuName')">
        <el-select v-model="dateQuery.deviceuName" filterable clearable :placeholder="$t('common.select')">
          <el-option v-for="item in dateQuery.deviceuList" :key="item.value" :label="item.label" :value="item.value" ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('faceChange.faceuCreateTime')" style="margin-bottom:10px;">
        <el-date-picker v-model="startTime" type="datetime" :placeholder="$t('common.firstTime')" align="right" :picker-options="startDatePicker"></el-date-picker>
        <el-date-picker v-model="endTime" type="datetime" :placeholder="$t('common.endTime')" align="right" default-time="23:59:59" :picker-options="endDatePicker"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{$t('common.query')}}</el-button>
      </el-form-item>
    </el-form>
    <el-table id="faceChangeTable" :data="faceChangeData" border style="width:100%;" size="mini">
      <!-- <el-table-column prop="faceuSeq" :label="$t('faceChange.faceuSeq')"></el-table-column> -->
      <el-table-column prop="deviceuId" :label="$t('faceChange.deviceuId')" ></el-table-column>
      <el-table-column prop="deviceuName" :label="$t('faceChange.deviceuName')" ></el-table-column>
      <el-table-column prop="faceuOld" :label="$t('faceChange.faceuOld')" ></el-table-column>
      <el-table-column prop="faceuNew" :label="$t('faceChange.faceuNew')" ></el-table-column>
      <el-table-column prop="faceuCreator" :label="$t('faceChange.faceuCreator')" ></el-table-column>
      <el-table-column prop="faceuCreateTime" :label="$t('faceChange.faceuCreateTime')" ></el-table-column>
    </el-table>
    <el-pagination id="faceChangePage" :class="{activeBackground: active}" style="border: 1px solid #ebeef5;border-top:0px;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="10" :pager-count="5" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
  </div>
</template>
<script>
export default {
  data() {
    return {
      startDatePicker: this.changeStart(),
      endDatePicker: this.changeEnd(),
      startTime: '',
      endTime: '',
      typeDisabled: true,
      dateQuery: {
        deviceuName: '',
        deviceuList: []
      },
      faceChangeData: [],
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
    startTime: function () {
      this.endDatePicker = this.changeEnd();
      this.startDatePicker = this.changeStart();
    },
    endTime: function () {
      this.endDatePicker = this.changeEnd();
      this.startDatePicker = this.changeStart();
    }
  },
  methods: {
    changeStart(){
      let self = this
      if (self.endTime) {
        return {
          disabledDate(time) {
            return time.getTime() > self.endTime;
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
    changeEnd(){
      let self = this
      if(self.startTime){
        return {
          disabledDate(time) {
            return time.getTime() < self.startTime;
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
    // recordTime(val){
    //   this.dateQuery.recordTime = val;
    // },
    //获取设备用户下拉列表数据
    getDeviceuList() {
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG + "/api/deviceUser/select/base",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            sessionStorage.getItem("loginPrefix") +
            " " +
            sessionStorage.getItem("loginToken")
        },
        data: {
          pageIndex: 1,
          pageSize: 999999
        }
      })
        .then(res => {
          if (res.data.statusCode == 200) {
            this.dateQuery.deviceuList = [];
            res.data.data.resultObjects.forEach(val => {
              this.dateQuery.deviceuList.push({
                value: val.deviceuId,
                label: val.deviceuId + " " + val.deviceuName
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
    //获取列表数据
    getFaceChange(pageIndex, pageSize,deviceuId,startTime,endTime) {
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG + "/api/faceupdatedtl/select",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("loginPrefix") + " " + sessionStorage.getItem("loginToken")
        },
        data: {
          'pageIndex': pageIndex,
          'pageSize': pageSize,
          'deviceuId': deviceuId,
          'startTime': startTime,
          'endTime': endTime
        }
      })
        .then(res => {
          if (res.data.statusCode == 200) {
            this.total = res.data.data.count;
            this.faceChangeData = [];
            res.data.data.resultObjects.forEach(val => {
              this.faceChangeData.push({
                faceuSeq: val.faceuSeq,
                deviceuId: val.deviceuId,
                deviceuName: val.deviceuName,
                faceuCreator: val.faceuCreator,
                faceuCreateTime: val.faceuCreateTime.replace('T',' '),
                faceuOld: val.faceuOld,
                faceuNew: val.faceuNew
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
      let start = '', end = '';
      if(this.startTime){
        start = this.startTime.toString().split('GMT')[0];
      }
      if(this.endTime){
        end = this.endTime.toString().split('GMT')[0];
      }
      this.getFaceChange(this.currentPage,this.pageTotal,this.dateQuery.deviceuName,start,end);
    },

    //切换每页数量
    handleCurrentChange(val) {
      this.currentPage = val;
      let start = '', end = '';
      if(this.startTime){
        start = this.startTime.toString().split('GMT')[0];
      }
      if(this.endTime){
        end = this.endTime.toString().split('GMT')[0];
      }
      this.getFaceChange(this.currentPage,this.pageTotal,this.dateQuery.deviceuName,start,end);
    },

    //按条件检索
    onSubmit() {
      let start = '', end = '';
      if(this.startTime){
        start = this.startTime.toString().split('GMT')[0];
      }
      if(this.endTime){
        end = this.endTime.toString().split('GMT')[0];
      }
      this.getFaceChange(this.currentPage,this.pageTotal,this.dateQuery.deviceuName,start,end);
    },

    //适配界面
    pageResize() {
      this.$nextTick(() => {
        var app = document.getElementById("app");
        var faceChange = document.getElementById("faceChange");
        var faceChangeQuery = document.getElementById("faceChangeQuery");
        var faceChangeTable = document.getElementById("faceChangeTable");
        var faceChangePage = document.getElementById("faceChangePage");
        if (document.body.scrollHeight > document.body.offsetHeight) {
          faceChangePage.style.width = faceChangeTable.clientWidth - 11 + "px";
          faceChangePage.style.paddingLeft = "25px";
          faceChangePage.style.paddingRight = "25px";
          faceChangePage.style.marginLeft = -faceChangePage.offsetWidth / 2 + "px";
          faceChangePage.style.position = "fixed";
          this.active = true;
        } else {
          faceChangePage.style.paddingLeft = "5px";
          faceChangePage.style.position = "static";
          faceChangePage.style.marginLeft = "0px";
          this.active = false;
        }
      });
    }
  },
  mounted() {
    let _this = this;
    this.getDeviceuList();
    _this.getFaceChange(1, 10);
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
#faceChange {
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
  .el-form-item {
    margin-bottom: 20px;
  }
  #faceChangePage {
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
  .faceChangeTable {
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

