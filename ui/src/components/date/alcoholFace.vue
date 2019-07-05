<template>
  <div id='alcohol'>
    <el-form :inline="true" :model="dateQuery" class="demo-form-inline " id="alcoholQuery">
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
    <el-table id="alcoholTable" :data="alcoholFace" border style="width:100%;" stripe size="mini" @row-dblclick='lookInfoForm'>
      <el-table-column prop="deviceName" :label="$t('device.deviceName')"></el-table-column> <!-- 设备登录名称 -->
      <el-table-column prop="deviceHardwareId" :label="$t('device.deviceHardwareId')"></el-table-column> <!-- 设备登录名称 -->
      <el-table-column prop="deviceuName" :label="$t('deviceu.deviceuName')"></el-table-column> <!-- 设备用户名称 -->
      <el-table-column prop="devicelName" :label="$t('devicel.devicelName')"></el-table-column> <!-- 设备登录名称 -->
      <el-table-column prop="deviceType" :label="$t('device.deviceType')"></el-table-column> <!-- 设备类型 -->
      <el-table-column prop="deviceuImage" :label="$t('deviceu.deviceuImage')" width="120">
        <template slot-scope="scope">
          <viewer :images="[scope.row.deviceuImage]" v-if="scope.row.deviceuImage">
            <img :src="scope.row.deviceuImage" width="100" style="cursor:pointer;" height="64">
          </viewer>
        </template>
      </el-table-column> <!-- 设备用户头像 -->
      <el-table-column prop="alcoholId" :label="$t('alcohol.alcoholId')"></el-table-column> <!-- 酒检编号 -->
      <el-table-column prop="alcoholDtlImage" :label="$t('alcohol.picturesForAlcoholTesting')" width="120">
        <template slot-scope="scope">
          <viewer :images="[scope.row.alcoholDtlImage]" v-if="scope.row.alcoholDtlImage">
            <img :src="scope.row.alcoholDtlImage" width="100" style="cursor:pointer;" height="64">
          </viewer>
        </template>
      </el-table-column> <!-- 酒检图片 -->
      <el-table-column prop="alcoholDtlValue" :label="$t('alcohol.proof')">
        <template slot-scope="scope">
          <span style="display:block;height:64px;line-height:64px;text-align:center;font-weight:bold;color:#fff;" :style="{ background: alcoholBgc(scope.row.alcoholDtlValue,[scope.row.alcoholStandard,scope.row.alcoholTwoLevel,scope.row.alcoholThreeLevel],colorList) }">{{scope.row.alcoholDtlValue}}</span>
        </template>
      </el-table-column> <!-- 酒检值 -->
      <!-- <el-table-column prop="alcoholStandard" :label="$t('alcohol.confidenceOfcomparison')"></el-table-column> 置信度 -->
      <el-table-column prop="alcoholStandard" :label="$t('config.alcoholStandard1')"></el-table-column> <!-- 置信度 -->
      <el-table-column prop="alcoholTwoLevel" :label="$t('config.alcoholStandard2')"></el-table-column> <!-- 置信度 -->
      <el-table-column prop="alcoholThreeLevel" :label="$t('config.alcoholStandard3')"></el-table-column> <!-- 置信度 -->
      <el-table-column prop="alcoholCountry" :label="$t('alcohol.alcoholCountry')"></el-table-column> <!-- 国家 -->
      <el-table-column prop="alcoholUnit" :label="$t('alcohol.alcoholUnit')"></el-table-column> <!-- 酒检单位 -->
      <el-table-column prop="alcoholDtlTime" :label="$t('alcohol.upTime')"></el-table-column> <!-- 上传时间 -->
      <el-table-column prop="faceId" :label="$t('face.faceId')"></el-table-column> <!-- 人脸编号 -->
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
      <el-table-column prop="faceDtlTime" :label="$t('face.upTime')"></el-table-column> <!-- 上传时间 -->
      <el-table-column prop="operation" :label="$t('common.operation')" align="center" width="100px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="lookInfoForm(scope.row)">{{$t('common.look')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination id='alcoholPage' :class="{activeBackground: active}" style="border: 1px solid #ebeef5;border-top:0px;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 25, 50, 100]" :page-size="10" :pager-count='5' layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    <el-dialog :title="$t('common.detailedInfo')" :visible.sync="infoVisible" width="1024px" >
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
          <el-col :span='8'>
            <el-form-item :label="$t('deviceu.deviceuImage')">
              <viewer :images="[infoForm.deviceuImage]" v-if="infoForm.deviceuImage">
                <img :src="infoForm.deviceuImage" width="200" style="cursor:pointer;" height="160">
              </viewer>
            </el-form-item>
          </el-col>
          <el-col :span='8'>
            <el-form-item :label="$t('face.faceDtlImage')">
              <viewer :images="[infoForm.faceDtlImage]" v-if="infoForm.faceDtlImage">
                <img :src="infoForm.faceDtlImage" width="200" style="cursor:pointer;" height="160">
              </viewer>
            </el-form-item>
          </el-col>
          <el-col :span='8'>
            <el-form-item :label="$t('alcohol.picturesForAlcoholTesting')">
              <viewer :images="[infoForm.alcoholDtlImage]" v-if="infoForm.alcoholDtlImage">
                <img :src="infoForm.alcoholDtlImage" width="200" style="cursor:pointer;" height="160">
              </viewer>
            </el-form-item>
          </el-col>
          <el-col :span='8'>
            <el-form-item :label="$t('face.faceDtlValue')">
              <el-input v-model="infoForm.faceDtlValue" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='8'>
            <el-form-item :label="$t('face.faceStandard')">
              <el-input v-model="infoForm.faceStandard" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='8'>
            <el-form-item :label="$t('face.upTime')">
              <el-input v-model="infoForm.faceUpTime" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='8'>
            <el-form-item :label="$t('alcohol.proof')">
              <el-input v-model="infoForm.alcoholDtlValue" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='8'>
            <el-form-item :label="$t('config.alcoholStandard1')">
              <el-input v-model="infoForm.alcoholStandard" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='8'>
            <el-form-item :label="$t('config.alcoholStandard2')">
              <el-input v-model="infoForm.alcoholTwoLevel" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='8'>
            <el-form-item :label="$t('config.alcoholStandard3')">
              <el-input v-model="infoForm.alcoholThreeLevel" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='8'>
            <el-form-item :label="$t('device.deviceHardwareId')">
              <el-input v-model="infoForm.deviceHardwareId" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='8'>
            <el-form-item :label="$t('alcohol.upTime')">
              <el-input v-model="infoForm.alcoholUpTime" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-button style="width:100%; color:#fff;" :style="{ background: faceBgc(infoForm.faceDtlValue,infoForm.faceStandard) }"  v-if="faceTip(infoForm.faceDtlValue,infoForm.faceStandard)=='2'">{{$t('face.adopt')}}</el-button>
            <el-button style="width:100%; color:#fff;" :style="{ background: faceBgc(infoForm.faceDtlValue,infoForm.faceStandard) }" v-else>{{$t('face.noAdopt')}}</el-button>
          </el-col>
          <el-col :span='12'>
            <el-button style="width:100%; color:#fff;" :style="{ background: alcoholBgc(infoForm.alcoholDtlValue,[infoForm.alcoholStandard,infoForm.alcoholTwoLevel,infoForm.alcoholThreeLevel],colorList) }" v-if="alcoholTip(infoForm.alcoholDtlValue,[infoForm.alcoholStandard,infoForm.alcoholTwoLevel,infoForm.alcoholThreeLevel],colorList)=='0'">{{$t('alcohol.adopt')}}</el-button>
            <el-button style="width:100%; color:#fff;" :style="{ background: alcoholBgc(infoForm.alcoholDtlValue,[infoForm.alcoholStandard,infoForm.alcoholTwoLevel,infoForm.alcoholThreeLevel],colorList) }" v-else>{{$t('alcohol.noAdopt')}}</el-button>
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
      colorList: ["","",""],
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
        alcoholDtlImage: '',
        faceStandard: '',
        faceUpTime: '',
        faceDtlValue: '',
        alcoholDtlValue: '',
        alcoholStandard: '',
        alcoholTwoLevel: '',
        alcoholThreeLevel: '',
        alcoholUpTime: '',
        deviceHardwareId: '',
        alcoholDtlValueBool: 0
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
      alcoholFace: [],
      active: true
    };
  },
  created(){
    this.$axios({
      method: "post",
      url: NEW_URL_CONFIG + "/api/config/select",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization:
          sessionStorage.getItem("loginPrefix") +
          " " +
          sessionStorage.getItem("loginToken")
      },
      data: {
        configType: "Sys_004",
        configId: "JJColor"
      }
    }).then(res => {
      if (res.data.statusCode == 200) {
        for (let i = 0; i < res.data.data.length; i++) {
          const ele = res.data.data[i];
          switch (ele.configValue) {
            case "One":
              this.$set(this.colorList,0,ele.configDescrible)
              break;
            case "Two":
              this.$set(this.colorList,1,ele.configDescrible)
              break;
            case "Three":
              this.$set(this.colorList,2,ele.configDescrible)
              break;

            default:
              break;
          }
        }

      } else if (res.data.statusCode == 407 || res.data.statusCode == 402) {
        this.$router.push({ path: "/login" });
        this.$message({
          showClose: true,
          duration: 2000,
          type: "warning",
          message: this.$t("common.logoutTitle")
        });
      }
    });
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
    //查看详细信息
    lookInfoForm(row){
      this.infoVisible = true;
      this.infoForm.deviceName = row.deviceName;
      this.infoForm.deviceuName = row.deviceuName;
      this.infoForm.devicelName = row.devicelName;
      this.infoForm.deviceType = row.deviceType;
      this.infoForm.deviceuImage = row.deviceuImage;
      this.infoForm.faceDtlImage = row.faceDtlImage;
      this.infoForm.alcoholDtlImage = row.alcoholDtlImage
      this.infoForm.faceStandard = row.faceStandard;
      this.infoForm.faceUpTime = row.faceDtlTime;
      this.infoForm.faceDtlValue = row.faceDtlValue;
      this.infoForm.alcoholDtlValue = row.alcoholDtlValue;
      this.infoForm.alcoholStandard = row.alcoholStandard;
      this.infoForm.alcoholTwoLevel = row.alcoholTwoLevel;
      this.infoForm.alcoholThreeLevel = row.alcoholThreeLevel;
      this.infoForm.alcoholUpTime = row.alcoholDtlTime;
      this.infoForm.deviceHardwareId = row.deviceHardwareId;
      let arr = this.infoForm.alcoholDtlValue.split('')
      arr.splice(arr.length-1,1)
      this.infoForm.alcoholDtlValueBool = arr.join('')
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
          const tHeader = [this.$t('device.deviceName'),this.$t('device.deviceHardwareId'),this.$t('deviceu.deviceuName'),this.$t('devicel.devicelName'),this.$t('device.deviceType'),this.$t('deviceu.deviceuImage'),this.$t('alcohol.alcoholId'),this.$t('alcohol.picturesForAlcoholTesting'),this.$t('alcohol.proof'),this.$t('alcohol.confidenceOfcomparison'),this.$t('alcohol.alcoholCountry'),this.$t('alcohol.alcoholUnit'),this.$t('alcohol.upTime'),this.$t('face.faceId'),this.$t('face.faceDtlImage'),this.$t('face.faceDtlValue'),this.$t('face.faceStandard'),this.$t('face.upTime')]; //这个是表头名称 可以是iveiw表格中表头属性的title的数组
          const filterVal = ['deviceName','deviceHardwareId','deviceuName','devicelName','deviceType','deviceuImage','alcoholId','alcoholDtlImage','alcoholDtlValue','alcoholStandard','alcoholCountry','alcoholUnit','alcoholDtlTime','faceId','faceDtlImage','faceDtlValue','faceStandard','faceDtlTime']; //与表格数据配合 可以是iview表格中的key的数组
          const list = dataList; //表格数据，iview中表单数据也是这种格式！
          const data = this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, this.$t('header.subCol.alcoholFace')+' '+this.curentTime()) //列表excel  这个是导出表单的名称
        })
      }
    },
    nowExcel(){
      this.setExcel(this.alcoholFace)
    },
    allExcel(){
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG + "/api/viewdata/alcoholandfacerelate",
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
        if (res.data.statusCode == 200) {
          let dataList = [];
          res.data.data.resultObjects.forEach((val) => {
            dataList.push({
              deviceName: val.deviceName,// 设备名称
              deviceuName: val.deviceuName,// 用户名称
              devicelName: val.devicelName,// 登录名称
              deviceType: val.deviceType,// 设备类型
              deviceuImage: val.deviceuImage,// 用户头像
              alcoholId: val.alcoholId,//酒精编号
              alcoholDtlImage: val.alcoholDtlImage,// 酒精检测图片
              alcoholDtlValue: val.alcoholDtlValue,// 酒检测值
              alcoholStandard: val.alcoholStandard,// 酒检标准值
              alcoholCountry: val.alcoholCountry, //国家
              alcoholUnit: val.alcoholUnit,// 酒检单位
              alcoholDtlTime: val.alcoholDtlTime.replace('T',' '),// 上传时间
              faceId: val.faceId,// 人脸编号
              faceDtlImage: val.faceDtlImage,// 人脸图片
              faceDtlValue: val.faceDtlValue,// 人脸值
              faceStandard: val.faceStandard,// 人脸标准
              faceDtlTime: val.faceDtlTime.replace('T',' ')// 上传时间
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
    getAlcoholFace(pageIndex,pageSize,deviceId,deviceType,alcoholStartTime,alcoholEndTime){
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG+"/api/viewdata/alcoholandfacerelate",
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
          "alcoholStartTime": alcoholStartTime,
          "alcoholEndTime": alcoholEndTime
        }
      }).then(res=>{
        if(res.data.statusCode == 200){
          this.total = res.data.data.count
          this.alcoholFace = [];
          for (let i = 0; i < res.data.data.resultObjects.length; i++) {
            const val = res.data.data.resultObjects[i];
            this.alcoholFace.push({
              deviceName: val.deviceName,// 设备名称
              deviceHardwareId: val.deviceHardwareId,// 硬件编号
              deviceuName: val.deviceuName,// 用户名称
              devicelName: val.devicelName,// 登录名称
              deviceType: val.deviceType,// 设备类型
              deviceuImage: val.deviceuImage,// 用户头像
              alcoholId: val.alcoholId,//酒精编号
              alcoholDtlImage: val.alcoholDtlImage,// 酒精检测图片
              alcoholDtlValue: val.alcoholDtlValue,// 酒检测值
              alcoholStandard: val.alcoholStandard,// 酒检标准值
              alcoholTwoLevel: val.alcoholTwoLevel,// 酒检标准值
              alcoholThreeLevel: val.alcoholThreeLevel,// 酒检标准值
              alcoholCountry: val.alcoholCountry, //国家
              alcoholUnit: val.alcoholUnit,// 酒检单位
              alcoholDtlTime: val.alcoholDtlTime.replace('T',' '),// 上传时间
              faceId: val.faceId,// 人脸编号
              faceDtlImage: val.faceDtlImage,// 人脸图片
              faceDtlValue: val.faceDtlValue,// 人脸值
              faceStandard: val.faceStandard,// 人脸标准
              faceDtlTime: val.faceDtlTime.replace('T',' ')// 上传时间
            })
          }
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
      this.getAlcoholFace(this.currentPage,this.pageTotal,this.dateQuery.deviceId,this.dateQuery.deviceType,start,end);
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
      this.getAlcoholFace(this.currentPage,this.pageTotal,this.dateQuery.deviceId,this.dateQuery.deviceType,start,end);
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
      this.getAlcoholFace(this.currentPage,this.pageTotal,this.dateQuery.deviceId,this.dateQuery.deviceType,start,end);
    },
    // 根据酒检值修改背景色的函数
    alcoholBgc(a,b,c){
      return common.alcoholBg(a,b,c).bg;
    },
    // 根据酒检值是否通过及等级
    alcoholTip(a,b,c){
      return common.alcoholBg(a,b,c).tip;
    },
    // 根据人脸值修改背景色的函数
    faceBgc(a,b){
      return common.faceBg(a,b).bg;
    },
    // 根据人脸值是否通过及等级
    faceTip(a,b){
      return common.faceBg(a,b).tip;
    },
    pageResize(){
      this.$nextTick(()=>{
        var app = document.getElementById('app');
        var alcohol = document.getElementById('alcohol');
        var alcoholQuery = document.getElementById('alcoholQuery');
        var alcoholTable = document.getElementById('alcoholTable');
        var alcoholPage = document.getElementById('alcoholPage');
        if(document.body.scrollHeight > document.body.offsetHeight){
          alcoholPage.style.width = alcoholTable.clientWidth - 11 + 'px'
          alcoholPage.style.paddingLeft = '25px'
          alcoholPage.style.paddingRight = '25px'
          alcoholPage.style.marginLeft = - alcoholPage.offsetWidth/2 + 'px';
          alcoholPage.style.position = 'fixed';
          this.active = true;
        }else{
          alcoholPage.style.paddingLeft = '5px'
          alcoholPage.style.position = 'static';
          alcoholPage.style.marginLeft = '0px';
          this.active = false;
        }
      })
    }
  },
  mounted() {
    let _this = this;
    _this.getDeviceList();
    _this.getDeviceType();
    _this.getAlcoholFace(1,10)
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
#alcohol{
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
  .el-form-item{
    margin-bottom: 20px;
  }
  #alcoholPage{
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
