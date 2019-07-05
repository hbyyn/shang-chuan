<template>
  <div id="deviceUserChange">
    <el-form :inline="true" :model="dateQuery" class="demo-form-inline" id="deviceUserChangeQuery">
      <el-form-item :label="$t('deviceu.deviceuName')">
        <el-select v-model="dateQuery.deviceuName" filterable clearable :placeholder="$t('common.select')">
          <el-option v-for="item in dateQuery.deviceuList" :key="item.value" :label="item.label" :value="item.value" ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('deviceUserChange.deviceuDtlType')">
        <el-select v-model="dateQuery.deviceuDtlType" filterable clearable :placeholder="$t('common.select')">
          <el-option v-for="item in dateQuery.deviceuDtlTypeList" :key="item.value" :label="item.label" :value="item.value" ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('deviceUserChange.deviceuDtlCreateTime')" style="margin-bottom:10px;">
        <el-date-picker v-model="startTime" type="datetime" :placeholder="$t('common.firstTime')" align="right" :picker-options="startDatePicker"></el-date-picker>
        <el-date-picker v-model="endTime" type="datetime" :placeholder="$t('common.endTime')" align="right" default-time="23:59:59" :picker-options="endDatePicker"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{$t('common.query')}}</el-button>
      </el-form-item>
    </el-form>
    <el-table id="deviceUserChangeTable" :data="deviceUserChangeData" border style="width:100%;" size="mini">
      <!-- <el-table-column prop="deviceuDtlSeq" :label="$t('deviceUserChange.deviceuDtlSeq')"></el-table-column> -->
      <el-table-column prop="deviceuId" :label="$t('deviceUserChange.deviceuId')" ></el-table-column>
      <el-table-column prop="deviceuName" :label="$t('deviceUserChange.deviceuName')" ></el-table-column>
      <el-table-column prop="deviceuDtlType" :label="$t('deviceUserChange.deviceuDtlType')" ></el-table-column>
      <el-table-column prop="deviceuDtlOldValue" :label="$t('deviceUserChange.deviceuDtlOldValue')" >
        <template slot-scope="scope">
          <viewer :images="[scope.row.deviceuDtlOldValue]" v-if="scope.row.deviceuDtlOldValue&&scope.row.deviceuDtlType=='image'">
            <img :src="scope.row.deviceuDtlOldValue" width="64" style="cursor:pointer;" height="64">
          </viewer>
          <span v-else>{{scope.row.deviceuDtlOldValue}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="deviceuDtlNewValue" :label="$t('deviceUserChange.deviceuDtlNewValue')" >
        <template slot-scope="scope">
          <viewer :images="[scope.row.deviceuDtlNewValue]" v-if="scope.row.deviceuDtlNewValue&&scope.row.deviceuDtlType=='image'">
            <img :src="scope.row.deviceuDtlNewValue" width="64" style="cursor:pointer;" height="64">
          </viewer>
          <span v-else>{{scope.row.deviceuDtlNewValue}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="deviceuDtlDesc" :label="$t('deviceUserChange.deviceuDtlDesc')" ></el-table-column> -->
      <el-table-column prop="deviceuDtlCreator" :label="$t('deviceUserChange.deviceuDtlCreator')" ></el-table-column>
      <el-table-column prop="deviceuDtlCreateTime" :label="$t('deviceUserChange.deviceuDtlCreateTime')" ></el-table-column>
    </el-table>
    <el-pagination id="deviceUserChangePage" :class="{activeBackground: active}" style="border: 1px solid #ebeef5;border-top:0px;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="10" :pager-count="5" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
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
        deviceuList: [],
        deviceuDtlType: '',
        deviceuDtlTypeList: [
          {
            value: 'image',
            label: 'image'
          },
          {
            value: 'name',
            label: 'name'
          }
        ]
      },
      deviceUserChangeData: [],
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
    getDeviceUserChange(pageIndex, pageSize,deviceuId,deviceuDtlType,startTime,endTime) {
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG + "/api/deviceuserdtl/select",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("loginPrefix") + " " + sessionStorage.getItem("loginToken")
        },
        data: {
          'pageIndex': pageIndex,
          'pageSize': pageSize,
          'deviceuId': deviceuId,
          'deviceuDtlType': deviceuDtlType,
          'startTime': startTime,
          'endTime': endTime
        }
      })
        .then(res => {
          if (res.data.statusCode == 200) {
            // console.log(res)
            this.total = res.data.data.count;
            this.deviceUserChangeData = [];
            res.data.data.resultObjects.forEach(val => {
              this.deviceUserChangeData.push({
                deviceuDtlSeq: val.deviceuDtlSeq,
                deviceuId: val.deviceuId,
                deviceuName: val.deviceuName,
                deviceuDtlCreator: val.deviceuDtlCreator,
                deviceuDtlCreateTime: val.deviceuDtlCreateTime.replace('T',' '),
                deviceuDtlType: val.deviceuDtlType,
                deviceuDtlOldValue: val.deviceuDtlOldValue,
                deviceuDtlNewValue: val.deviceuDtlNewValue,
                deviceuDtlDesc: val.deviceuDtlDesc
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
      this.getDeviceUserChange(this.currentPage,this.pageTotal,this.dateQuery.deviceuName,this.dateQuery.deviceuDtlType,start,end)
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
      this.getDeviceUserChange(this.currentPage,this.pageTotal,this.dateQuery.deviceuName,this.dateQuery.deviceuDtlType,start,end)
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
      this.getDeviceUserChange(this.currentPage,this.pageTotal,this.dateQuery.deviceuName,this.dateQuery.deviceuDtlType,start,end)
    },

    //适配界面
    pageResize() {
      this.$nextTick(() => {
        var app = document.getElementById("app");
        var deviceUserChange = document.getElementById("deviceUserChange");
        var deviceUserChangeQuery = document.getElementById("deviceUserChangeQuery");
        var deviceUserChangeTable = document.getElementById("deviceUserChangeTable");
        var deviceUserChangePage = document.getElementById("deviceUserChangePage");
        if (document.body.scrollHeight > document.body.offsetHeight) {
          deviceUserChangePage.style.width = deviceUserChangeTable.clientWidth - 11 + "px";
          deviceUserChangePage.style.paddingLeft = "25px";
          deviceUserChangePage.style.paddingRight = "25px";
          deviceUserChangePage.style.marginLeft = -deviceUserChangePage.offsetWidth / 2 + "px";
          deviceUserChangePage.style.position = "fixed";
          this.active = true;
        } else {
          deviceUserChangePage.style.paddingLeft = "5px";
          deviceUserChangePage.style.position = "static";
          deviceUserChangePage.style.marginLeft = "0px";
          this.active = false;
        }
      });
    }
  },
  mounted() {
    let _this = this;
    this.getDeviceuList();
    _this.getDeviceUserChange(1, 10);
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
#deviceUserChange {
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
  .el-form-item {
    margin-bottom: 20px;
  }
  #deviceUserChangePage {
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
  .deviceUserChangeTable {
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

