<template>
  <div id="drugData">
    <el-form :inline="true" :model="dateQuery" class="demo-form-inline " id="drugDataQuery">
      <el-form-item :label="$t('drug.dj10DtlCreateTime')" style="margin-bottom:10px;">
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
    <el-table id="drugDataTable" :data="drugData" border style="width:100%;" stripe size="mini" @row-dblclick='lookInfoForm'>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-row>
              <el-col :span='8' v-show="props.row.dj10DtlT1a">
                <el-form-item :label="$t('drug.dj10DtlT1a')">
                  <span>{{ props.row.dj10DtlT1a }}</span>
                </el-form-item>
              </el-col>
              <el-col :span='8' v-show="props.row.dj10DtlT2a">
                <el-form-item :label="$t('drug.dj10DtlT2a')">
                  <span>{{ props.row.dj10DtlT2a }}</span>
                </el-form-item>
              </el-col>
              <el-col :span='8' v-show="props.row.dj10DtlT3a">
                <el-form-item :label="$t('drug.dj10DtlT3a')">
                  <span>{{ props.row.dj10DtlT3a }}</span>
                </el-form-item>
              </el-col>
              <el-col :span='8' v-show="props.row.dj10DtlT1b">
                <el-form-item :label="$t('drug.dj10DtlT1b')">
                  <span>{{ props.row.dj10DtlT1b }}</span>
                </el-form-item>
              </el-col>
              <el-col :span='8' v-show="props.row.dj10DtlT2b">
                <el-form-item :label="$t('drug.dj10DtlT2b')">
                  <span>{{ props.row.dj10DtlT2b }}</span>
                </el-form-item>
              </el-col>
              <el-col :span='8' v-show="props.row.dj10DtlT3b">
                <el-form-item :label="$t('drug.dj10DtlT3b')">
                  <span>{{ props.row.dj10DtlT3b }}</span>
                </el-form-item>
              </el-col>
              <el-col :span='8' v-show="props.row.dj10DtlT1c">
                <el-form-item :label="$t('drug.dj10DtlT1c')">
                  <span>{{ props.row.dj10DtlT1c }}</span>
                </el-form-item>
              </el-col>
              <el-col :span='8' v-show="props.row.dj10DtlT2c">
                <el-form-item :label="$t('drug.dj10DtlT2c')">
                  <span>{{ props.row.dj10DtlT2c }}</span>
                </el-form-item>
              </el-col>
              <el-col :span='8' v-show="props.row.dj10DtlT3c">
                <el-form-item :label="$t('drug.dj10DtlT3c')">
                  <span>{{ props.row.dj10DtlT3c }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="dj10DtlSeq" :label="$t('drug.dj10DtlSeq')"></el-table-column> <!-- 毒检编号 -->
      <el-table-column prop="deviceId" :label="$t('device.deviceId')"></el-table-column> <!-- 设备名称 -->
      <el-table-column prop="deviceHardwareId" :label="$t('device.deviceHardwareId')"></el-table-column> <!-- 硬件编号 -->
      <el-table-column prop="deviceuId" :label="$t('deviceu.deviceuId')"></el-table-column> <!-- 设备用户 -->
      <el-table-column prop="devicelId" :label="$t('devicel.devicelId')"></el-table-column> <!-- 设备登录 -->
      <el-table-column prop="dj10DtlValue" :label="$t('drug.dj10DtlValue')"></el-table-column> <!-- 毒检值 -->
      <el-table-column prop="dj10DtlBatchId" :label="$t('drug.dj10DtlBatchId')"></el-table-column> <!-- 批编号 -->
      <el-table-column prop="dj10DtlItemId" :label="$t('drug.dj10DtlItemId')"></el-table-column> <!-- 毒品条编号 -->
      <el-table-column prop="dj10DtlType" :label="$t('drug.dj10DtlType')"></el-table-column> <!-- 类型 -->
      <el-table-column prop="dj10DtlTime" :label="$t('drug.dj10DtlTime')"></el-table-column> <!-- 毒检时间 -->
      <el-table-column prop="dj10DtlAvailable" :label="$t('drug.dj10DtlAvailable')">
        <template slot-scope="scope">
          <span v-text="scope.row.dj10DtlAvailable?$t('common.yes'):$t('common.no')"></span>
        </template>
      </el-table-column> <!-- 是否生效 -->
      <el-table-column prop="dj10DtlImage" :label="$t('common.img')" width="160">
        <template slot-scope="scope">
          <viewer :images="[scope.row.dj10DtlImage]">
            <img :src="scope.row.dj10DtlImage" width="140" style="cursor:pointer;" height="80">
          </viewer>
        </template>
      </el-table-column>
      <el-table-column prop="dj10DtlVideo" :label="$t('common.video')" width="160">
        <template slot-scope="scope">
          <span @click.capture.stop="enlargeVideo(scope.row.dj10DtlVideo)"
            style="width:140px;">
            <div style="position:relation;">
              <div style="width:140px;height:80px;position:absolute;z-index:10;"></div>
              <video v-if="scope.row.dj10DtlVideo" :src="scope.row.dj10DtlVideo" width="140" controls>{{$t('home.notUseHtml5')}}</video>
            </div>
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="dj10DtlCreator" :label="$t('drug.dj10DtlCreator')"></el-table-column> <!-- 创建者Id -->
      <el-table-column prop="dj10DtlCreateTime" :label="$t('drug.dj10DtlCreateTime')"></el-table-column> <!-- 创建时间 -->
      <el-table-column prop="operation" :label="$t('common.operation')" align="center" width="100px">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="lookInfoForm(scope.row)">{{$t('common.look')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination id="drugDataPage" :class="{activeBackground: active}" style="border: 1px solid #ebeef5;border-top:0px;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 25, 50, 100]" :page-size="10" :pager-count='5' layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    <el-dialog v-dialogDrag ref="dialog__wrapper" :title="$t('common.video')" :visible.sync="videoVisible" width="680px" v-if="videoVisible">
      <span><video :src="enlargeVideoUrl" width="640" controls>{{$t('home.notUseHtml5')}}</video></span>
    </el-dialog>
    <el-dialog :title="$t('common.detailedInfo')" :visible.sync="infoVisible" width="1020px">
      <el-dialog width="680px" :title="$t('common.img')" v-dialogDrag ref="dialog__wrapper" :visible.sync="innerVideoVisible" v-if="innerVideoVisible" append-to-body>
        <span><video :src="infoForm.innerVideoUrl" width="640" controls>{{$t('home.notUseHtml5')}}</video></span>
      </el-dialog>
      <el-form ref="infoForm" :model="infoForm" label-width="170px">
        <el-row>
          <el-col :span='8'>
            <el-form-item :label="$t('drug.dj10DtlSeq')">
              <el-input v-model="infoForm.dj10DtlSeq" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='8'>
            <el-form-item :label="$t('device.deviceId')">
              <el-input v-model="infoForm.deviceId" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='8'>
            <el-form-item :label="$t('device.deviceHardwareId')">
              <el-input v-model="infoForm.deviceHardwareId" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item :label="$t('deviceu.deviceuId')">
              <el-input v-model="infoForm.deviceuId" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item :label="$t('devicel.devicelId')">
              <el-input v-model="infoForm.devicelId" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item :label="$t('common.img')">
              <viewer :images="[infoForm.dj10DtlImage]">
                <img :src="infoForm.dj10DtlImage" width="275" style="cursor:pointer;" height="165">
              </viewer>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item :label="$t('common.video')">
              <span  @click="innerVideo(infoForm.dj10DtlVideo)" style="height:165px;width:275px;">
                <div style="position:relation;">
                  <div style="width:275px;height:165px;position:absolute;z-index:10;"></div>
                  <video v-if="infoForm.dj10DtlVideo" :src="infoForm.dj10DtlVideo" style="height:165px;width:275px;" controls>{{$t('home.notUseHtml5')}}</video>
                </div>
              </span>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item :label="$t('drug.dj10DtlValue')">
              <el-input v-model="infoForm.dj10DtlValue" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item :label="$t('drug.dj10DtlType')">
              <el-input v-model="infoForm.dj10DtlType" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item :label="$t('drug.dj10DtlBatchId')">
              <el-input v-model="infoForm.dj10DtlBatchId" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item :label="$t('drug.dj10DtlItemId')">
              <el-input v-model="infoForm.dj10DtlItemId" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item :label="$t('drug.dj10DtlAvailable')">
              <span v-text="infoForm.dj10DtlAvailable?$t('common.yes'):$t('common.no')" style="box-sizing: border-box;border: 1px solid #c0c4cc;width:100%;height: 32px;line-height: 32px;border-color: #c0c4cc;padding: 0 15px;border-radius: 4px;display:inline-block;"></span>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item :label="$t('drug.dj10DtlTime')">
              <el-input v-model="infoForm.dj10DtlTime" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item :label="$t('drug.dj10DtlCreator')">
              <el-input v-model="infoForm.dj10DtlCreator" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='12'>
            <el-form-item :label="$t('drug.dj10DtlCreateTime')">
              <el-input v-model="infoForm.dj10DtlCreateTime" :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span='8' v-show="infoForm.dj10DtlT1a">
            <el-form-item :label="$t('drug.dj10DtlT1a')">
              <span>{{ infoForm.dj10DtlT1a }}</span>
            </el-form-item>
          </el-col>
          <el-col :span='8' v-show="infoForm.dj10DtlT2a">
            <el-form-item :label="$t('drug.dj10DtlT2a')">
              <span>{{ infoForm.dj10DtlT2a }}</span>
            </el-form-item>
          </el-col>
          <el-col :span='8' v-show="infoForm.dj10DtlT3a">
            <el-form-item :label="$t('drug.dj10DtlT3a')">
              <span>{{ infoForm.dj10DtlT3a }}</span>
            </el-form-item>
          </el-col>
          <el-col :span='8' v-show="infoForm.dj10DtlT1b">
            <el-form-item :label="$t('drug.dj10DtlT1b')">
              <span>{{ infoForm.dj10DtlT1b }}</span>
            </el-form-item>
          </el-col>
          <el-col :span='8' v-show="infoForm.dj10DtlT2b">
            <el-form-item :label="$t('drug.dj10DtlT2b')">
              <span>{{ infoForm.dj10DtlT2b }}</span>
            </el-form-item>
          </el-col>
          <el-col :span='8' v-show="infoForm.dj10DtlT3b">
            <el-form-item :label="$t('drug.dj10DtlT3b')">
              <span>{{ infoForm.dj10DtlT3b }}</span>
            </el-form-item>
          </el-col>
          <el-col :span='8' v-show="infoForm.dj10DtlT1c">
            <el-form-item :label="$t('drug.dj10DtlT1c')">
              <span>{{ infoForm.dj10DtlT1c }}</span>
            </el-form-item>
          </el-col>
          <el-col :span='8' v-show="infoForm.dj10DtlT2c">
            <el-form-item :label="$t('drug.dj10DtlT2c')">
              <span>{{ infoForm.dj10DtlT2c }}</span>
            </el-form-item>
          </el-col>
          <el-col :span='8' v-show="infoForm.dj10DtlT3c">
            <el-form-item :label="$t('drug.dj10DtlT3c')">
              <span>{{ infoForm.dj10DtlT3c }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'images',
  data() {
    return {
      startDatePicker: this.changeStart(),
      endDatePicker: this.changeEnd(),
      startTime: '',
      endTime: '',
      infoVisible: false,
      innerVideoVisible: false,
      infoForm: {
        deviceId: '',
        deviceuId: '',
        devicelId: '',
        deviceType: '',
        dj10DtlImage: '',
        dj10DtlVideo: '',
        faceStandard: '',
        upTime: '',
        faceDtlValue: '',
        innerVideoUrl: '',
        deviceHardwareId: '',
        dj10DtlT1a: '',
        dj10DtlT2a: '',
        dj10DtlT3a: '',
        dj10DtlT1b: '',
        dj10DtlT2b: '',
        dj10DtlT3b: '',
        dj10DtlT1c: '',
        dj10DtlT2c: '',
        dj10DtlT3c: ''
      },
      //当前页码
      currentPage: 1,
      //每页多少条
      pageTotal: 10,
      //数据总数
      total: 0,
      dateQuery: {},
      drugData: [],
      active: true,
      videoVisible: false,
      enlargeVideoUrl: ''
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
    //查看详细信息
    lookInfoForm(row){
      // console.log(row)
      this.infoVisible = true;
      this.infoForm.dj10DtlSeq = row.dj10DtlSeq;
      this.infoForm.deviceId = row.deviceId;
      this.infoForm.deviceuId = row.deviceuId;
      this.infoForm.devicelId = row.devicelId;
      this.infoForm.dj10DtlValue = row.dj10DtlValue;
      this.infoForm.dj10DtlBatchId = row.dj10DtlBatchId;
      this.infoForm.dj10DtlItemId = row.dj10DtlItemId;
      this.infoForm.dj10DtlType = row.dj10DtlType;
      this.infoForm.dj10DtlTime = row.dj10DtlTime;
      this.infoForm.dj10DtlAvailable = row.dj10DtlAvailable;
      this.infoForm.dj10DtlImage = row.dj10DtlImage;
      this.infoForm.dj10DtlVideo = row.dj10DtlVideo;
      this.infoForm.dj10DtlCreator = row.dj10DtlCreator;
      this.infoForm.dj10DtlCreateTime = row.dj10DtlCreateTime;
      this.infoForm.deviceHardwareId = row.deviceHardwareId;
      this.infoForm.dj10DtlT1a = row.dj10DtlT1a;
      this.infoForm.dj10DtlT2a = row.dj10DtlT2a;
      this.infoForm.dj10DtlT3a = row.dj10DtlT3a;
      this.infoForm.dj10DtlT1b = row.dj10DtlT1b;
      this.infoForm.dj10DtlT2b = row.dj10DtlT2b;
      this.infoForm.dj10DtlT3b = row.dj10DtlT3b;
      this.infoForm.dj10DtlT1c = row.dj10DtlT1c;
      this.infoForm.dj10DtlT2c = row.dj10DtlT2c;
      this.infoForm.dj10DtlT3c = row.dj10DtlT3c;
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
          const tHeader = [this.$t('drug.dj10DtlSeq'),this.$t('device.deviceId'),this.$t('device.deviceHardwareId'),this.$t('deviceu.deviceuId'),this.$t('devicel.devicelId'),this.$t('drug.dj10DtlValue'),this.$t('drug.dj10DtlBatchId'),this.$t('drug.dj10DtlItemId'),this.$t('drug.dj10DtlType'),this.$t('drug.dj10DtlTime'),this.$t('drug.dj10DtlAvailable'),this.$t('common.img'),this.$t('common.video'),this.$t('drug.dj10DtlCreator'),this.$t('drug.dj10DtlCreateTime')]; //这个是表头名称 可以是iveiw表格中表头属性的title的数组
          const filterVal = ['dj10DtlSeq','deviceId','deviceHardwareId','deviceuId','devicelId','dj10DtlValue','dj10DtlBatchId','dj10DtlItemId','dj10DtlType','dj10DtlTime','dj10DtlAvailable','dj10DtlImage','dj10DtlVideo','dj10DtlCreator','dj10DtlCreateTime']; //与表格数据配合 可以是iview表格中的key的数组
          const list = dataList; //表格数据，iview中表单数据也是这种格式！
          const data = this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, this.$t('header.subCol.drugs')+' '+this.curentTime()) //列表excel  这个是导出表单的名称
        })
      }
    },
    nowExcel(){
      this.setExcel(this.drugData)
    },
    allExcel(){
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG + "/api/dj10dtl/select",
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
              dj10DtlSeq : val.dj10DtlSeq,
              deviceId : val.deviceId,
              deviceuId : val.deviceuId,
              devicelId : val.devicelId,
              dj10DtlValue : val.dj10DtlValue,
              dj10DtlBatchId : val.dj10DtlBatchId,
              dj10DtlItemId : val.dj10DtlItemId,
              dj10DtlType : val.dj10DtlType,
              dj10DtlTime : val.dj10DtlTime,
              dj10DtlAvailable : val.dj10DtlAvailable,
              dj10DtlImage : val.dj10DtlImage,
              dj10DtlVideo : val.dj10DtlVideo,
              dj10DtlCreator : val.dj10DtlCreator,
              dj10DtlCreateTime : val.dj10DtlCreateTime.replace('T',' ')
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
    getDrugData(pageIndex,pageSize,dj10DtlStartTime,dj10DtlEndTime){
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG+"/api/dj10dtl/select",
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
            Authorization: sessionStorage.getItem("loginPrefix")+' '+sessionStorage.getItem("loginToken")
        },
        data: {
          "pageIndex": pageIndex,
          "pageSize": pageSize,
          "dj10DtlStartTime": dj10DtlStartTime,
          "dj10DtlEndTime": dj10DtlEndTime
        }
      }).then(res=>{
        if(res.data.statusCode == 200){
          this.total = res.data.data.count
          this.drugData = [];
          res.data.data.resultObjects.forEach((val)=>{
            this.drugData.push({
              dj10DtlSeq : val.dj10DtlSeq,
              deviceId : val.deviceId,
              deviceHardwareId : val.deviceHardwareId,
              deviceuId : val.deviceuId,
              devicelId : val.devicelId,
              dj10DtlValue : val.dj10DtlValue,
              dj10DtlBatchId : val.dj10DtlBatchId,
              dj10DtlItemId : val.dj10DtlItemId,
              dj10DtlType : val.dj10DtlType,
              dj10DtlTime : val.dj10DtlTime,
              dj10DtlAvailable : val.dj10DtlAvailable,
              dj10DtlImage : val.dj10DtlImage,
              dj10DtlVideo : val.dj10DtlVideo,
              dj10DtlCreator : val.dj10DtlCreator,
              dj10DtlCreateTime : val.dj10DtlCreateTime.replace('T',' '),
              dj10DtlT1a: val.dj10DtlT1a,
              dj10DtlT2a: val.dj10DtlT2a,
              dj10DtlT3a: val.dj10DtlT3a,
              dj10DtlT1b: val.dj10DtlT1b,
              dj10DtlT2b: val.dj10DtlT2b,
              dj10DtlT3b: val.dj10DtlT3b,
              dj10DtlT1c: val.dj10DtlT1c,
              dj10DtlT2c: val.dj10DtlT2c,
              dj10DtlT3c: val.dj10DtlT3c
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
      this.getDrugData(this.currentPage,this.pageTotal,start,end);
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
      this.getDrugData(this.currentPage,this.pageTotal,start,end);
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
      this.getDrugData(this.currentPage,this.pageTotal,start,end);
    },
    //查看大图
    // enlargeImg(val){
    //   console.log(this)
    //   var image = new Image();

    //     image.src = val;

    //     var viewer = new Viewer(image, {
    //       hidden: function () {
    //         viewer.destroy();
    //       },
    //     });

    //     // image.click();
    //     viewer.show();
    //   // this.enlargeImgUrl = val;
    //   // this.imgVisible = true;
    // },
    // innerImg(val){
    //   this.infoForm.innerImgUrl = val;
    //   this.innerImgVisible = true;
    // },
    enlargeVideo(val){
      this.enlargeVideoUrl = val;
      this.videoVisible = true;
    },
    innerVideo(val){
      this.infoForm.innerVideoUrl = val;
      this.innerVideoVisible = true;
    },
    pageResize(){
      this.$nextTick(()=>{
        var app = document.getElementById('app');
        var drugData = document.getElementById('drugData');
        var drugDataQuery = document.getElementById('drugDataQuery');
        var drugDataTable = document.getElementById('drugDataTable');
        var drugDataPage = document.getElementById('drugDataPage');
        if(document.body.scrollHeight > document.body.offsetHeight){
          drugDataPage.style.width = drugDataTable.clientWidth - 11 + 'px'
          drugDataPage.style.paddingLeft = '25px'
          drugDataPage.style.paddingRight = '25px'
          drugDataPage.style.marginLeft = - drugDataPage.offsetWidth/2 + 'px';
          drugDataPage.style.position = 'fixed';
          this.active = true;
        }else{
          drugDataPage.style.paddingLeft = '5px'
          drugDataPage.style.position = 'static';
          drugDataPage.style.marginLeft = '0px';
          this.active = false;
        }
      })
    }
  },
  mounted() {
    let _this = this;
    _this.getDrugData(1,10);
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
#drugData{
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
  .el-form-item{
    margin-bottom: 10px;
  }
  #drugDataPage{
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
