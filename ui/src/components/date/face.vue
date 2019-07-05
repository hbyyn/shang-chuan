<template>
  <div id='faceData'>
    <el-form :inline="true" :model="dateQuery" class="demo-form-inline " id="faceDataQuery">
      <el-form-item :label="$t('device.device')" style="margin-bottom:10px;">
        <el-select v-model="dateQuery.deviceId" filterable clearable :placeholder="$t('common.select')">
          <el-option v-for="(item,index) in dateQuery.deviceList" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('device.deviceType')" style="margin-bottom:10px;">
        <el-select v-model="dateQuery.deviceType" filterable clearable :placeholder="$t('common.select')">
          <el-option v-for="(item,index) in dateQuery.deviceTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('common.upTime')" style="margin-bottom:10px;">
        <el-date-picker v-model="startTime" type="datetime" :placeholder="$t('common.firstTime')" align="right" :picker-options="startDatePicker"></el-date-picker>
        <el-date-picker v-model="endTime" type="datetime" :placeholder="$t('common.endTime')" align="right" default-time="23:59:59" :picker-options="endDatePicker"></el-date-picker>
      </el-form-item>
      <el-form-item style="margin-bottom:10px;">
        <el-button type="primary" @click="onSubmit">{{$t('common.query')}}</el-button>
      </el-form-item>
      <el-row style="margin-bottom:10px;">
        <el-col>
          <el-button-group>
            <!-- <el-button type="primary" @click="nowPdf">{{$t('enforcealaw.nowPdf')}}</el-button>
            <el-button type="primary" @click="allPdf">{{$t('enforcealaw.allPdf')}}</el-button> -->
            <el-button type="primary" @click="nowExcel">{{$t('enforcealaw.nowExcel')}}</el-button>
            <el-button type="primary" @click="allExcel">{{$t('enforcealaw.allExcel')}}</el-button>
          </el-button-group>
        </el-col>
      </el-row>
    </el-form>
    <el-table id="faceDataTable" :data="faceData" border style="width:100%;" stripe size="mini" @row-dblclick='lookInfoForm'>
      <el-table-column prop="faceId" :label="$t('face.faceId')"></el-table-column> <!-- 人脸编号 -->
      <el-table-column prop="deviceName" :label="$t('device.deviceName')"></el-table-column> <!-- 设备名称 -->
      <el-table-column prop="deviceHardwareId" :label="$t('device.deviceHardwareId')"></el-table-column> <!-- 设备名称 -->
      <el-table-column prop="deviceuName" :label="$t('deviceu.deviceuName')"></el-table-column> <!-- 设备用户 -->
      <el-table-column prop="devicelName" :label="$t('devicel.devicelName')"></el-table-column> <!-- 设备登录 -->
      <el-table-column prop="deviceType" :label="$t('device.deviceType')"></el-table-column> <!-- 设备类型 -->
      <el-table-column prop="deviceuImage" :label="$t('deviceu.deviceuImage')" width="120">
        <template slot-scope="scope">
          <viewer :images="[scope.row.deviceuImage]" v-if="scope.row.deviceuImage">
            <img :src="scope.row.deviceuImage" width="100" style="cursor:pointer;" height="64">
          </viewer>
        </template>
      </el-table-column>
      <el-table-column prop="faceDtlImage" :label="$t('face.faceDtlImage')" width="120">
        <template slot-scope="scope">
          <viewer :images="[scope.row.faceDtlImage]" v-if="scope.row.faceDtlImage">
            <img :src="scope.row.faceDtlImage" width="100" style="cursor:pointer;" height="64">
          </viewer>
        </template>
      </el-table-column>
      <el-table-column prop="faceDtlValue" :label="$t('face.faceDtlValue')">
        <template slot-scope="scope">
          <span style="display:block;height:64px;line-height:64px;text-align:center;font-weight:bold;color:#fff;" :style="{ background: faceBgc(scope.row.faceDtlValue,scope.row.faceStandard) }">{{scope.row.faceDtlValue}}</span>
        </template>
      </el-table-column> <!-- 人脸值 -->
      <el-table-column prop="faceStandard" :label="$t('face.faceStandard')"></el-table-column> <!-- 人脸标准值 -->
      <el-table-column prop="faceDtlTime" :label="$t('common.upTime')"></el-table-column> <!-- 上传时间 -->
      <el-table-column prop="operation" :label="$t('common.operation')" align="center" width="100px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="lookInfoForm(scope.row)">{{$t('common.look')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination id='faceDataPage' :class="{activeBackground: active}" style="border: 1px solid #ebeef5;border-top:0px;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 25, 50, 100]" :page-size="10" :pager-count='5' layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    <el-dialog :title="$t('common.detailedInfo')" :visible.sync="infoVisible" width="810px" >
      <el-form ref="infoForm" :model="infoForm" label-width="110px">
        <el-row>
          <el-col :span='12'>
            <el-form-item :label="$t('device.deviceName')">
              <el-input v-model="infoForm.deviceName" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item :label="$t('deviceu.deviceuName')">
              <el-input v-model="infoForm.deviceuName" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item :label="$t('devicel.devicelName')">
              <el-input v-model="infoForm.devicelName" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item :label="$t('device.deviceType')">
              <el-input v-model="infoForm.deviceType" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item :label="$t('deviceu.deviceuImage')">
              <viewer :images="[infoForm.deviceuImage]" v-if="infoForm.deviceuImage">
                <img :src="infoForm.deviceuImage" width="275" style="cursor:pointer;" height="200">
              </viewer>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item :label="$t('face.faceDtlImage')">
              <viewer :images="[infoForm.faceDtlImage]" v-if="infoForm.faceDtlImage">
                <img :src="infoForm.faceDtlImage" width="275" style="cursor:pointer;" height="200">
              </viewer>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item :label="$t('face.faceStandard')">
              <el-input v-model="infoForm.faceStandard" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item :label="$t('common.upTime')">
              <el-input v-model="infoForm.upTime" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item :label="$t('face.faceDtlValue')">
              <el-input v-model="infoForm.faceDtlValue" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item :label="$t('device.deviceHardwareId')">
              <el-input v-model="infoForm.deviceHardwareId" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='24'>
            <el-button style="width:100%; color:#fff;" :style="{ background: faceBgc(infoForm.faceDtlValue,infoForm.faceStandard) }"  v-if="faceTip(infoForm.faceDtlValue,infoForm.faceStandard)=='2'">{{$t('face.adopt')}}</el-button>
            <el-button style="width:100%; color:#fff;" :style="{ background: faceBgc(infoForm.faceDtlValue,infoForm.faceStandard) }" v-else>{{$t('face.noAdopt')}}</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import common from '../../api/common.js'
export default {
  data() {
    return {
      startDatePicker: this.changeStart(),
      endDatePicker: this.changeEnd(),
      startTime: '',
      endTime: '',
      infoVisible: false,
      infoForm: {
        deviceName: '',
        deviceuName: '',
        devicelName: '',
        deviceType: '',
        deviceuImage: '',
        faceDtlImage: '',
        faceStandard: '',
        upTime: '',
        faceDtlValue: '',
        deviceHardwareId: ''
      },
      //当前页码
      currentPage: 1,
      //每页多少条
      pageTotal: 10,
      //数据总数
      total: 0,
      dateQuery: {
        deviceId: '',
        deviceList: [],
        deviceType: '',
        deviceTypeList: []
      },
      faceData: [],
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
    // 根据人脸值修改背景色的函数
    faceBgc(a,b){
      return common.faceBg(a,b).bg;
    },
    // 根据人脸值是否通过及等级
    faceTip(a,b){
      return common.faceBg(a,b).tip;
    },
    //查看详细信息
    lookInfoForm(row){
      this.infoVisible = true;
      this.infoForm.deviceName = row.deviceName;
      this.infoForm.deviceuName = row.deviceuName;
      this.infoForm.devicelName = row.devicelName;
      this.infoForm.deviceType = row.deviceType;
      this.infoForm.deviceuImage = row.deviceuImage;
      this.infoForm.faceDtlImage = row.faceDtlImage;
      this.infoForm.faceStandard = row.faceStandard;
      this.infoForm.upTime = row.faceDtlTime;
      this.infoForm.faceDtlValue = row.faceDtlValue;
      this.infoForm.deviceHardwareId = row.deviceHardwareId;
    },
    curentTime(){
      var nowDate = new Date();
      var year = nowDate.getFullYear();       //年
      var month = nowDate.getMonth() + 1;     //月
      var day = nowDate.getDate();            //日
      var hh = nowDate.getHours();            //时
      var mm = nowDate.getMinutes();          //分
      var ss = nowDate.getSeconds();
      var clock = year + "-";
      if(month < 10){
        clock += "0";
      }
      clock += month + "-";
      if(day < 10){clock += "0";}
      clock += day + " ";
      if(hh < 10){clock += "0";}
      clock += hh + "：";
      if (mm < 10) {clock += '0'; }
      clock += mm + "：";
      if (ss < 10) {clock += '0'; }
      clock += ss;
      return(clock);
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    setExcel(dataList){
      if(dataList&&dataList.length){
        require.ensure([], () => {
          const {export_json_to_excel} = require('../../assets/js/Export2Excel') //这个地址和页面的位置相关，这个地址是Export2Excel.js相对于页面的相对位置
          const tHeader = [this.$t('face.faceId'),this.$t('device.deviceName'),this.$t('device.deviceHardwareId'),this.$t('deviceu.deviceuName'),this.$t('devicel.devicelName'),this.$t('device.deviceType'),this.$t('deviceu.deviceuImage'),this.$t('face.faceDtlImage'),this.$t('face.faceDtlValue'),this.$t('face.faceStandard'),this.$t('common.upTime')]; //这个是表头名称 可以是iveiw表格中表头属性的title的数组
          const filterVal = ['faceId','deviceName','deviceHardwareId','deviceuName','devicelName','deviceType','deviceuImage','faceDtlImage','faceDtlValue','faceStandard','faceDtlTime']; //与表格数据配合 可以是iview表格中的key的数组
          const list = dataList; //表格数据，iview中表单数据也是这种格式！
          const data = this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, this.$t('header.subCol.face')+' '+this.curentTime()) //列表excel  这个是导出表单的名称
        })
      }
    },
    nowExcel(){
      this.setExcel(this.faceData)
    },
    allExcel(){
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG + "/api/viewdata/facerelate",
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("loginPrefix") + ' ' + sessionStorage.getItem("loginToken")
        },
        data: {
          "pageIndex": 1,
          "pageSize": 999999
        }
      }).then(res => {
        // console.log(res)
        if (res.data.statusCode == 200) {
          let dataList = [];
          res.data.data.resultObjects.forEach((val) => {
            dataList.push({
              deviceName: val.deviceName,
              devicelName: val.devicelName,
              deviceuName: val.deviceuName,
              deviceType: val.deviceType,
              deviceuImage: val.deviceuImage,
              faceDtlImage: val.faceDtlImage,
              faceDtlTime: val.faceDtlTime.replace('T',' '),
              faceDtlValue: val.faceDtlValue,
              faceId: val.faceId,
              faceStandard: val.faceStandard
            })
          });
          this.setExcel(dataList)
        } else if (res.data.statusCode == 407||res.data.statusCode == 402) {
          this.$router.push({
            path: "/login"
          });
          this.$message({
            type: 'warning',
            message: this.$t('common.logoutTitle'),
            showClose: true,
            duration:2000
          });
        };
      }).catch(res => {
      });
    },
    nowPdf(){},
    allPdf(){},
    //获取设备下拉列表数据
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
    //获取设备类型下拉框中的数据
    getDeviceType(){
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG+"/api/production/select/base",
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
            Authorization: sessionStorage.getItem("loginPrefix")+' '+sessionStorage.getItem("loginToken")
        },
        data: {
          pageIndex: 1,
          pageSize: 999999
        }
      }).then(res=>{
        if(res.data.statusCode == 200){
          this.dateQuery.deviceTypeList = [];
          res.data.data.resultObjects.forEach(val => {
            this.dateQuery.deviceTypeList.push({
              value: val.productID,
              label: val.productID + " " + val.productName
            });
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
    getFaceData(pageIndex,pageSize,deviceId,deviceType,faceStartTime,faceEndTime){
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG+"/api/viewdata/facerelate",
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
            Authorization: sessionStorage.getItem("loginPrefix")+' '+sessionStorage.getItem("loginToken")
        },
        data: {
          "pageIndex": pageIndex,
          "pageSize": pageSize,
          "deviceId": deviceId,
          "deviceType": deviceType,
          "faceStartTime": faceStartTime,
          "faceEndTime": faceEndTime
        }
      }).then(res=>{
        // console.log(res)
        if(res.data.statusCode == 200){
          this.total = res.data.data.count
          this.faceData = [];
          res.data.data.resultObjects.forEach((val)=>{
            this.faceData.push({
              deviceName: val.deviceName,
              devicelName: val.devicelName,
              deviceHardwareId: val.deviceHardwareId,
              deviceuName: val.deviceuName,
              deviceType: val.deviceType,
              deviceuImage: val.deviceuImage,
              faceDtlImage: val.faceDtlImage,
              faceDtlTime: val.faceDtlTime.replace('T',' '),
              faceDtlValue: val.faceDtlValue,
              faceId: val.faceId,
              faceStandard: val.faceStandard
            })
          });
          this.pageResize();
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
    onSubmit() {
      let start = '', end = '';
      if(this.startTime){
        start = this.startTime.toString().split('GMT')[0];
      }
      if(this.endTime){
        end = this.endTime.toString().split('GMT')[0];
      }
      this.getFaceData(this.currentPage,this.pageTotal,this.dateQuery.deviceId,this.dateQuery.deviceType,start,end);
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
      this.getFaceData(this.currentPage,this.pageTotal,this.dateQuery.deviceId,this.dateQuery.deviceType,start,end);
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
      this.getFaceData(this.currentPage,this.pageTotal,this.dateQuery.deviceId,this.dateQuery.deviceType,start,end);
    },
    pageResize(){
      this.$nextTick(()=>{
        var app = document.getElementById('app');
        var faceData = document.getElementById('faceData');
        var faceDataQuery = document.getElementById('faceDataQuery');
        var faceDataTable = document.getElementById('faceDataTable');
        var faceDataPage = document.getElementById('faceDataPage');
        if(document.body.scrollHeight > document.body.offsetHeight){
          faceDataPage.style.width = faceDataTable.clientWidth - 11 + 'px'
          faceDataPage.style.paddingLeft = '25px'
          faceDataPage.style.paddingRight = '25px'
          faceDataPage.style.marginLeft = - faceDataPage.offsetWidth/2 + 'px';
          faceDataPage.style.position = 'fixed';
          this.active = true;
        }else{
          faceDataPage.style.paddingLeft = '5px'
          faceDataPage.style.position = 'static';
          faceDataPage.style.marginLeft = '0px';
          this.active = false;
        }
      })
    }
  },
  mounted() {
    let _this = this;
    _this.getDeviceList();
    _this.getDeviceType();
    _this.getFaceData(1,10);
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
#faceData{
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
  .el-form-item{
    margin-bottom: 20px;
  }
  #faceDataPage{
    left: 50%;
    bottom: 40px;
    z-index: 2000;
    padding: 5px;
    background-color: rgba(75,75,75,.0);
    &.activeBackground{
      background-color: #fff;
    }
  }
}
</style>
