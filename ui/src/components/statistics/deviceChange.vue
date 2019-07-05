<template>
  <div id="deviceChange">
    <el-form :inline="true" :model="dateQuery" class="demo-form-inline" id="deviceChangeQuery">
      <el-form-item :label="$t('device.deviceName')">
        <el-select v-model="dateQuery.deviceName" filterable clearable :placeholder="$t('common.select')">
          <el-option v-for="(item,index) in dateQuery.deviceList" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('deviceChange.deviceDtlType')">
        <el-select v-model="dateQuery.deviceDtlType" filterable clearable :placeholder="$t('common.select')">
          <el-option v-for="item in dateQuery.deviceDtlTypeList" :key="item.value" :label="item.label" :value="item.value" ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('deviceChange.deviceDtlCreateTime')" style="margin-bottom:10px;">
        <el-date-picker v-model="startTime" type="datetime" :placeholder="$t('common.firstTime')" align="right" :picker-options="startDatePicker"></el-date-picker>
        <el-date-picker v-model="endTime" type="datetime" :placeholder="$t('common.endTime')" align="right" default-time="23:59:59" :picker-options="endDatePicker"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{$t('common.query')}}</el-button>
      </el-form-item>
    </el-form>
    <el-table id="deviceChangeTable" :data="deviceChangeData" border style="width:100%;" size="mini">
      <!-- <el-table-column prop="deviceDtlSeq" :label="$t('deviceChange.deviceDtlSeq')"></el-table-column> -->
      <el-table-column prop="deviceId" :label="$t('deviceChange.deviceId')" ></el-table-column>
      <el-table-column prop="deviceName" :label="$t('deviceChange.deviceName')" ></el-table-column>
      <el-table-column prop="deviceDtlType" :label="$t('deviceChange.deviceDtlType')" ></el-table-column>
      <el-table-column prop="deviceDtlOldValue" :label="$t('deviceChange.deviceDtlOldValue')" ></el-table-column>
      <el-table-column prop="deviceDtlNewValue" :label="$t('deviceChange.deviceDtlNewValue')" ></el-table-column>
      <!-- <el-table-column prop="deviceDtlDesc" :label="$t('deviceChange.deviceDtlDesc')" ></el-table-column> -->
      <el-table-column prop="deviceDtlCreator" :label="$t('deviceChange.deviceDtlCreator')" ></el-table-column>
      <el-table-column prop="deviceDtlCreateTime" :label="$t('deviceChange.deviceDtlCreateTime')" ></el-table-column>
    </el-table>
    <el-pagination id="deviceChangePage" :class="{activeBackground: active}" style="border: 1px solid #ebeef5;border-top:0px;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 20, 50, 100]" :page-size="10" :pager-count="5" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
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
        deviceName: '',
        deviceList: [],
        deviceDtlType: '',
        deviceDtlTypeList: [
          {
            value: 'hardwareid',
            label: 'hardwareid'
          }
        ]
      },
      deviceChangeData: [],
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
    //获取设备编号
    getDeviceList() {
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG+"/api/device/select",
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
            Authorization: sessionStorage.getItem("loginPrefix")+' '+sessionStorage.getItem("loginToken")
        },
        data: {
          "pageIndex": 1,
          "pageSize": 99999999
        }
      }).then(res=>{
        if(res.data.statusCode == 200){
          this.dateQuery.deviceList = [];
          res.data.data.resultObjects.forEach((val)=>{
            this.dateQuery.deviceList.push({
              value: val.deviceId,
              label: val.deviceId + ' ' + val.deviceName
            })
          });
        }else if(res.data.statusCode == 407||res.data.statusCode == 402){
          this.$router.push({path: "/login"});
          this.$message({
              type: 'warning',
              message: this.$t('common.logoutTitle'),
              showClose: true,
              duration:2000
          });
        };
      }).catch(res=>{
        // console.log(res)
      });
    },
    //获取列表数据
    getDeviceChange(pageIndex, pageSize,deviceId,deviceDtlType,startTime,endTime) {
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG + "/api/devicedtl/select",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("loginPrefix") + " " + sessionStorage.getItem("loginToken")
        },
        data: {
          'pageIndex': pageIndex,
          'pageSize': pageSize,
          'deviceId': deviceId,
          'deviceDtlType': deviceDtlType,
          'startTime': startTime,
          'endTime': endTime
        }
      })
        .then(res => {
          if (res.data.statusCode == 200) {
            this.total = res.data.data.count;
            this.deviceChangeData = [];
            res.data.data.resultObjects.forEach(val => {
              this.deviceChangeData.push({
                deviceDtlSeq: val.deviceDtlSeq,
                deviceId: val.deviceId,
                deviceName: val.deviceName,
                deviceDtlCreator: val.deviceDtlCreator,
                deviceDtlCreateTime: val.deviceDtlCreateTime.replace('T',' '),
                deviceDtlType: val.deviceDtlType,
                deviceDtlOldValue: val.deviceDtlOldValue,
                deviceDtlNewValue: val.deviceDtlNewValue,
                deviceDtlDesc: val.deviceDtlDesc
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
      this.getDeviceChange(this.currentPage,this.pageTotal,this.dateQuery.deviceName,this.dateQuery.deviceDtlType,start,end)
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
      this.getDeviceChange(this.currentPage,this.pageTotal,this.dateQuery.deviceName,this.dateQuery.deviceDtlType,start,end)
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
      this.getDeviceChange(this.currentPage,this.pageTotal,this.dateQuery.deviceName,this.dateQuery.deviceDtlType,start,end)
    },

    //适配界面
    pageResize() {
      this.$nextTick(() => {
        var app = document.getElementById("app");
        var deviceChange = document.getElementById("deviceChange");
        var deviceChangeQuery = document.getElementById("deviceChangeQuery");
        var deviceChangeTable = document.getElementById("deviceChangeTable");
        var deviceChangePage = document.getElementById("deviceChangePage");
        if (document.body.scrollHeight > document.body.offsetHeight) {
          deviceChangePage.style.width = deviceChangeTable.clientWidth - 11 + "px";
          deviceChangePage.style.paddingLeft = "25px";
          deviceChangePage.style.paddingRight = "25px";
          deviceChangePage.style.marginLeft = -deviceChangePage.offsetWidth / 2 + "px";
          deviceChangePage.style.position = "fixed";
          this.active = true;
        } else {
          deviceChangePage.style.paddingLeft = "5px";
          deviceChangePage.style.position = "static";
          deviceChangePage.style.marginLeft = "0px";
          this.active = false;
        }
      });
    }
  },
  mounted() {
    let _this = this;
    _this.getDeviceList();
    _this.getDeviceChange(1, 10);
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
#deviceChange {
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
  .el-form-item {
    margin-bottom: 20px;
  }
  #deviceChangePage {
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
  .deviceChangeTable {
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

