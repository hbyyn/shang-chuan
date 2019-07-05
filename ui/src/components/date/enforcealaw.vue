<template>
  <div id='faceData'>
    <el-form
      :inline="true"
      :model="dateQuery"
      class="demo-form-inline "
      id="faceDataQuery"
    >
      <el-form-item
        :label="$t('device.device')"
        style="margin-bottom:10px;"
      >
        <el-select
          v-model="dateQuery.deviceId"
          filterable
          clearable
          :placeholder="$t('common.select')"
        >
          <el-option
            v-for="(item,index) in dateQuery.deviceList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('devicel.devicelName')"
        style="margin-bottom:10px;"
      >
        <el-select
          v-model="dateQuery.devicelId"
          filterable
          clearable
          :placeholder="$t('common.select')"
        >
          <el-option
            v-for="(item,index) in dateQuery.devicelList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('deviceu.deviceuName')"
        style="margin-bottom:10px;"
      >
        <el-select
          v-model="dateQuery.deviceuId"
          filterable
          clearable
          :placeholder="$t('common.select')"
        >
          <el-option
            v-for="(item,index) in dateQuery.deviceuList"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        :label="$t('enforcealaw.upTime')"
        style="margin-bottom:10px;"
      >
        <el-date-picker
          v-model="startTime"
          type="datetime"
          :placeholder="$t('common.firstTime')"
          align="right"
          :picker-options="startDatePicker"
        ></el-date-picker>
        <el-date-picker
          v-model="endTime"
          type="datetime"
          :placeholder="$t('common.endTime')"
          align="right"
          default-time="23:59:59"
          :picker-options="endDatePicker"
        ></el-date-picker>
      </el-form-item>
      <el-form-item style="margin-bottom:10px;">
        <el-button
          type="primary"
          @click="onSubmit"
        >{{$t('common.query')}}</el-button>
      </el-form-item>
      <el-row style="margin-bottom:10px;">
        <el-col>
          <el-button-group>
            <el-button
              type="primary"
              @click="downloadBatch"
            >{{$t('common.download')}}</el-button>
            <el-button
              type="primary"
              @click="nowPdf"
            >{{$t('enforcealaw.nowPdf')}}</el-button>
            <el-button
              type="primary"
              @click="allPdf"
            >{{$t('enforcealaw.allPdf')}}</el-button>
            <el-button
              type="primary"
              @click="nowExcel"
            >{{$t('enforcealaw.nowExcel')}}</el-button>
            <el-button
              type="primary"
              @click="allExcel"
            >{{$t('enforcealaw.allExcel')}}</el-button>
          </el-button-group>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      id="faceDataTable"
      :data="faceData"
      border
      style="width:100%;"
      stripe
      size="mini"
      @selection-change="handleSelection"
    >
      <el-table-column
        type="selection"
        width="40"
      ></el-table-column>
      <el-table-column
        prop="deviceName"
        :label="$t('device.deviceName')"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="deviceuName"
        :label="$t('deviceu.deviceuName')"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="devicelName"
        :label="$t('devicel.devicelName')"
        width="120"
      ></el-table-column>
      <el-table-column
        prop="devicefType"
        :label="$t('enforcealaw.fileStyle')"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="devicefDtlMsg"
        :label="$t('enforcealaw.fileName')"
      ></el-table-column>
      <el-table-column
        :label="$t('enforcealaw.fileUrl')"
        width="260"
      >
        <template slot-scope="scope">
          <span
            v-if="scope.row.devicefType == 'mp3'"
            @click.capture.stop="openMp3(scope.$index, scope.row)"
          >
            <aplayer
              :music="{title: scope.row.devicefDtlMsg,artist: scope.row.devicefDtlCreator,src: scope.row.devicefDtlPath,pic: ''}"
              style="240px"
            ></aplayer>
          </span>
          <span
            v-else-if="scope.row.devicefType == 'mp4'"
            @click.capture.stop="openMp4(scope.$index, scope.row)"
            style="width:240px;"
          >
            <div style="position:relation;">
              <div style="width:240px;height:135px;position:absolute;z-index:10;"></div>
              <video
                :src="scope.row.devicefDtlPath"
                width="240"
                height="135"
                controls
              >{{$t('home.notUseHtml5')}}</video>
            </div>
          </span>
          <span v-else-if="scope.row.devicefType == 'jpg'">
            <!-- <img :src="scope.row.devicefDtlPath" alt="" style="width:240px;" height="135px"> -->
            <viewer :images="[scope.row.devicefDtlPath]">
              <img
                :src="scope.row.devicefDtlPath"
                width="240"
                style="cursor:pointer;"
                height="135"
              >
            </viewer>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="devicefDtlTime"
        :label="$t('enforcealaw.upTime')"
        width="140"
      ></el-table-column>
      <el-table-column
        prop="devicefDtlCreator"
        :label="$t('common.creator')"
        width="100"
      >
      </el-table-column>
      <el-table-column
        prop="devicefDtlCreatetime"
        :label="$t('common.creationTime')"
        width="160"
      >
      </el-table-column>
    </el-table>
    <el-pagination
      id='faceDataPage'
      :class="{activeBackground: active}"
      style="border: 1px solid #ebeef5;border-top:0px;"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 25, 50, 100]"
      :page-size="10"
      :pager-count='5'
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <a
      :href="downloadUrl"
      ref="downloadFile"
    ></a>
    <el-dialog
      v-dialogDrag
      ref="dialog__wrapper"
      :title="visibleTitle"
      :visible.sync="imgVisible"
      v-if="imgVisible"
      width="680px"
    >
      <span v-if="type==1">
        <!-- <img :src="imgUrl" alt="image" width='500'> -->
      </span>
      <span v-else-if="type==2">
        <aplayer
          :music="{title: audioOptions.title,artist: audioOptions.artist,src: audioOptions.src,pic: audioOptions.pic}"
          ref="audio"
        ></aplayer>
      </span>
      <span v-else-if="type==3">
        <video
          :src="videoUrl"
          width="640"
          controls
          autoplay
        >{{$t('home.notUseHtml5')}}</video>
      </span>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="pdfVisible"
      width="1024px"
    >
      <!-- <span>这是一段信息</span> -->
      <table class="table">
        <thead>
          <tr>
            <th>{{$t('device.deviceName')}}</th>
            <th>{{$t('deviceu.deviceuName')}}</th>
            <th>{{$t('devicel.devicelName')}}</th>
            <th>{{$t('enforcealaw.fileStyle')}}</th>
            <th>{{$t('enforcealaw.fileName')}}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td></td>
          </tr>
        </tbody>
      </table>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="pdfVisible = false"
        >确 定</el-button>
        <el-button @click="pdfVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// import $download from 'download'
import $download from '../../../static/js/download.js'
// import 'video.js/dist/video-js.css'
// import {
//   videoPlayer
// } from 'vue-video-player'
import Aplayer from 'vue-aplayer'
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import '../../../static/js/jspdf.plugin.autotable'
export default {
  data() {
    return {
      startDatePicker: this.changeStart(),
      endDatePicker: this.changeEnd(),
      startTime: '',
      endTime: '',
      pdfVisible: false,
      downloadUrl: '',
      selection: [],
      visibleTitle: '',
      type: '1', //1表示图片，2表示MP3，3表示MP4
      imgUrl: '',
      audioOptions: {
        title: '',
        artist: '',
        src: '',
        pic: ''
      },
      videoUrl: '',
      //当前页码
      currentPage: 1,
      //每页多少条
      pageTotal: 10,
      //数据总数
      total: 0,
      dateQuery: {
        deviceId: '',
        deviceList: [],
        devicelId: '',
        devicelList: [],
        deviceuId: '',
        deviceuList: []
      },
      faceData: [],
      active: true,
      imgVisible: false,
      enlargeImgUrl: ''
    };
  },
  components: {
    Aplayer
    // videoPlayer
  },
  watch: {
    imgVisible(newValue, oldValue) {
      this.$nextTick(() => {
        if (oldValue) {
          this.imgUrl = '';
          if (this.type == '3') {
            this.videoUrl = '';
          } else if (this.type == '2') {
            this.audioOptions.pic = '';
            this.audioOptions.title = '';
            this.audioOptions.src = '';
            this.audioOptions.title = '';
            this.type = '0'
          } else {
            this.imgUrl = '';
          }
        }
      })
    },
    startTime: function () {
      this.endDatePicker = this.changeEnd();
      this.startDatePicker = this.changeStart();
    },
    endTime: function () {
      this.endDatePicker = this.changeEnd();
      this.startDatePicker = this.changeStart();
    }
  },
  created() {
    this.curentTime();
  },
  mounted() {
  },
  methods: {
    changeStart() {
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
    changeEnd() {
      let self = this
      if (self.startTime) {
        return {
          disabledDate(time) {
            return time.getTime() < self.startTime;
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
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    curentTime() {
      var nowDate = new Date();
      var year = nowDate.getFullYear();       //年
      var month = nowDate.getMonth() + 1;     //月
      var day = nowDate.getDate();            //日
      var hh = nowDate.getHours();            //时
      var mm = nowDate.getMinutes();          //分
      var ss = nowDate.getSeconds();
      var clock = year + "-";
      if (month < 10) {
        clock += "0";
      }
      clock += month + "-";
      if (day < 10) { clock += "0"; }
      clock += day + " ";
      if (hh < 10) { clock += "0"; }
      clock += hh + "：";
      if (mm < 10) { clock += '0'; }
      clock += mm + "：";
      if (ss < 10) { clock += '0'; }
      clock += ss;
      return (clock);
    },
    setExcel(dataList) {
      if (dataList && dataList.length) {
        require.ensure([], () => {
          const { export_json_to_excel } = require('../../assets/js/Export2Excel') //这个地址和页面的位置相关，这个地址是Export2Excel.js相对于页面的相对位置
          const tHeader = [this.$t('device.deviceName'), this.$t('deviceu.deviceuName'), this.$t('devicel.devicelName'), this.$t('enforcealaw.fileStyle'), this.$t('enforcealaw.fileName'), this.$t('enforcealaw.fileUrl'), this.$t('enforcealaw.upTime'), this.$t('common.creator'), this.$t('common.creationTime')]; //这个是表头名称 可以是iveiw表格中表头属性的title的数组
          const filterVal = ['deviceName', 'deviceuName', 'devicelName', 'devicefType', 'devicefDtlMsg', 'devicefDtlPath', 'devicefDtlTime', 'devicefDtlCreator', 'devicefDtlCreatetime']; //与表格数据配合 可以是iview表格中的key的数组
          const list = dataList; //表格数据，iview中表单数据也是这种格式！
          const data = this.formatJson(filterVal, list)
          export_json_to_excel(tHeader, data, this.$t('header.subCol.enforcealaw') + ' ' + this.curentTime()) //列表excel  这个是导出表单的名称
        })
      }
    },
    nowExcel() {
      this.setExcel(this.faceData)
    },
    allExcel() {
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG + "/api/devicefiledtl/select",
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
              "deviceuName": val.deviceuName, //<!-- 用户名称 -->
              "deviceName": val.deviceName, //<!-- 设备名称 -->
              "devicelName": val.devicelName, //<!-- 登录名称 -->
              "devicefType": val.devicefType, //<!-- 文件类型 -->
              "devicefDtlMsg": val.devicefDtlMsg, //<!-- 文件名称 -->
              "devicefDtlPath": val.devicefDtlPath, //<!-- 文件路径 -->
              "devicefDtlTime": val.devicefDtlTime.replace('T', ' '), //<!-- 上传时间 -->
              "devicefDtlCreator": val.devicefDtlCreator, //<!-- 创建人 -->
              "devicefDtlCreatetime": val.devicefDtlCreatetime.replace('T', ' '), //<!-- 创建时间 -->
            })
          });
          this.setExcel(dataList)
        } else if (res.data.statusCode == 407 || res.data.statusCode == 402) {
          this.$router.push({
            path: "/login"
          });
          this.$message({
            type: 'warning',
            message: this.$t('common.logoutTitle'),
            showClose: true,
            duration: 2000
          });
        };
      }).catch(res => {
      });
    },
    allPdf() {
      //引入的后面两个插件
      //import html2canvas from "html2canvas"
      //import jsPDF from "jspdf"
      //import '../../../static/js/jspdf.plugin.autotable'
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG + "/api/devicefiledtl/select",
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
              "deviceuName": val.deviceuName, //<!-- 用户名称 -->
              "deviceName": val.deviceName, //<!-- 设备名称 -->
              "devicelName": val.devicelName, //<!-- 登录名称 -->
              "devicefType": val.devicefType, //<!-- 文件类型 -->
              "devicefDtlMsg": val.devicefDtlMsg, //<!-- 文件名称 -->
              "devicefDtlPath": val.devicefDtlPath, //<!-- 文件路径 -->
              "devicefDtlTime": val.devicefDtlTime.replace('T', ' '), //<!-- 上传时间 -->
              "devicefDtlCreator": val.devicefDtlCreator, //<!-- 创建人 -->
              "devicefDtlCreatetime": val.devicefDtlCreatetime.replace('T', ' '), //<!-- 创建时间 -->
            })
          });
          var columns = [
            { title: "idddddd", dataKey: "deviceuName" },
            { title: "Namedd", dataKey: "deviceName" },
            { title: "Countrdy", dataKey: "devicelName" },
            { title: "IDddddd", dataKey: "devicefType" },
            { title: "Namddde", dataKey: "devicefDtlMsg" },
            { title: "Country", dataKey: "devicefDtlPath" },
            { title: "IDdddddd", dataKey: "devicefDtlTime" },
            { title: "Named", dataKey: "devicefDtlCreator" },
            { title: "Countrddy", dataKey: "devicefDtlCreatetime" },
          ];
          var doc = new jsPDF('p', 'pt', 'a3');
          doc.autoTable(columns, dataList, {
            headerStyles: {
              halign: 'center',
              valign: 'middle'
            },
            theme: 'striped',//striped：行背景色交替显示（默认值）grid：线框形式plain：无样式
            tableWidth: 'auto', //表格宽度度设置auto，wrap
            startY: 10,
            margin: { left: 20, right: 20 },
            styles: { fontSize: 3 },
            overflow: 'linebreak',
            styles: {
              halign: 'center',
              valign: 'middle'
            }
          });
          doc.save('table.pdf');


        } else if (res.data.statusCode == 407 || res.data.statusCode == 402) {
          this.$router.push({
            path: "/login"
          });
          this.$message({
            type: 'warning',
            message: this.$t('common.logoutTitle'),
            showClose: true,
            duration: 2000
          });
        };
      }).catch(res => {
      });

    },
    nowPdf() {
      html2canvas(document.getElementById("faceDataTable")).then(function (canvas) {

        //返回图片dataURL，参数：图片格式和清晰度(0-1)
        var pageData = canvas.toDataURL('image/jpeg', 1.0);

        //方向默认竖直，尺寸ponits，格式a4[595.28,841.89]
        var pdf = new jsPDF('', 'pt', 'a4');

        //addImage后两个参数控制添加图片的尺寸，此处将页面高度按照a4纸宽高比列进行压缩
        pdf.addImage(pageData, 'JPEG', 20, 0, 555.28, 552.28 / canvas.width * canvas.height);

        pdf.save('单页.pdf');

      })
    },
    handleDownload() {
      // this.downloadLoading = true;

    },
    //批量下载
    downloadBatch() {
      if (this.selection.length) {
        for (var i = 0; i < this.selection.length; i++) {
          this.$axios({
            method: "get",
            url: NEW_URL_CONFIG + "/api/file/download" + '?downloadData=' + this.selection[i].url,
            headers: {
              "accept": "application/json",
              "Content-Type": "application/json",
              Authorization: sessionStorage.getItem("loginPrefix") + ' ' + sessionStorage.getItem("loginToken")
            },
            params: '',
            responseType: 'blob'
          }).then(res => {
            if (res.status == 200) {
              // 这里res.data是返回的 blob 对象
              var blob = new Blob([res.data], { type: 'application/' + res.headers['content-type'] })
              var downloadElement = document.createElement('a')
              var href = window.URL.createObjectURL(blob) // 创建下载的链接
              downloadElement.href = href
              downloadElement.download = res.headers.filename // 下载后文件名
              // 此写法兼容可火狐浏览器
              document.body.appendChild(downloadElement)
              downloadElement.click() // 点击下载
              document.body.removeChild(downloadElement) // 下载完成移除元素
              window.URL.revokeObjectURL(href) // 释放掉 blob 对象
            }
          }).catch(res => {

          });
        }
      }
    },
    //表格选择事件
    handleSelection(val) {
      // console.log(val)
      this.selection = [];
      if (val.length) {
        for (let i = 0; i < val.length; i++) {
          this.selection.push({
            url: val[i].devicefDtlPath,
            name: val[i].devicefDtlMsg
          });
        }
      }
      // console.log(this.selection)
    },
    onPlayerEnded(res) {
      // console.log(res)
    },
    openMp3(index, row) {
      // console.log(row)
      this.visibleTitle = this.$t('common.audio');
      this.type = 2;
      this.audioOptions.artist = row.devicefDtlCreator;
      this.audioOptions.src = row.devicefDtlPath;
      this.audioOptions.title = row.devicefDtlMsg;
      this.imgVisible = true;
    },
    openMp4(index, row) {
      this.visibleTitle = this.$t('common.video');
      this.type = 3;
      this.videoUrl = row.devicefDtlPath;
      this.imgVisible = true;
    },
    //获取设备下拉列表数据
    getDeviceList() {
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG + "/api/device/select",
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("loginPrefix") + ' ' + sessionStorage.getItem("loginToken")
        },
        data: {
          "pageIndex": 1,
          "pageSize": 99999999
        }
      }).then(res => {
        if (res.data.statusCode == 200) {
          this.dateQuery.deviceList = [];
          res.data.data.resultObjects.forEach((val) => {
            this.dateQuery.deviceList.push({
              value: val.deviceId,
              label: val.deviceId + ' ' + val.deviceName
            })
          });
        } else if (res.data.statusCode == 407 || res.data.statusCode == 402) {
          this.$router.push({
            path: "/login"
          });
          this.$message({
            type: 'warning',
            message: this.$t('common.logoutTitle'),
            showClose: true,
            duration: 2000
          });
        };
      }).catch(res => {
        // console.log(res)
      });
    },
    //获取设备用户下拉列表数据
    getDeviceuList() {
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG + "/api/deviceUser/select/base",
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("loginPrefix") + ' ' + sessionStorage.getItem("loginToken")
        },
        data: {
          "pageIndex": 1,
          "pageSize": 999999,
        }
      }).then(res => {
        // console.log(res)
        if (res.data.statusCode == 200) {
          this.total = res.data.data.count
          this.dateQuery.deviceuList = [];
          res.data.data.resultObjects.forEach((val) => {
            this.dateQuery.deviceuList.push({
              value: val.deviceuId,
              label: val.deviceuId + ' ' + val.deviceuName
            })
          })
          this.pageResize();
        } else if (res.data.statusCode == 407 || res.data.statusCode == 402) {
          this.$router.push({
            path: "/login"
          });
          this.$message({
            type: 'warning',
            message: this.$t('common.logoutTitle'),
            showClose: true,
            duration: 2000
          });
        };
      }).catch(res => {
        // console.log(res)
      });
    },
    //获取设备登录下拉列表数据
    getDevicelList() {
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG + "/api/devicelogin/select/base",
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("loginPrefix") + ' ' + sessionStorage.getItem("loginToken")
        },
        data: {
          "pageIndex": 1,
          "pageSize": 999999,
        }
      }).then(res => {
        if (res.data.statusCode == 200) {
          this.dateQuery.devicelList = [];
          res.data.data.resultObjects.forEach((val) => {
            this.dateQuery.devicelList.push({
              value: val.devicelId,
              label: val.devicelId + ' ' + val.devicelName
            })
          })
          this.pageResize();
        } else if (res.data.statusCode == 407 || res.data.statusCode == 402) {
          this.$router.push({
            path: "/login"
          });
          this.$message({
            type: 'warning',
            message: this.$t('common.logoutTitle'),
            showClose: true,
            duration: 2000
          });
        };
      }).catch(res => {
        // console.log(res)
      });
    },
    getFaceData(pageIndex, pageSize, deviceId, deviceuId, devicelId, startUpdateTime, endUpdateTime) {
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG + "/api/devicefiledtl/select",
        headers: {
          "accept": "application/json",
          "Content-Type": "application/json",
          Authorization: sessionStorage.getItem("loginPrefix") + ' ' + sessionStorage.getItem("loginToken")
        },
        data: {
          "pageIndex": pageIndex,
          "pageSize": pageSize,
          "deviceId": deviceId,
          "deviceuId": deviceuId,
          "devicelId": devicelId,
          "startUpdateTime": startUpdateTime,
          "endUpdateTime": endUpdateTime
        }
      }).then(res => {
        // console.log(res)
        if (res.data.statusCode == 200) {
          this.total = res.data.data.count
          this.faceData = [];
          res.data.data.resultObjects.forEach((val) => {
            this.faceData.push({
              "deviceuName": val.deviceuName, //<!-- 用户名称 -->
              "deviceName": val.deviceName, //<!-- 设备名称 -->
              "devicelName": val.devicelName, //<!-- 登录名称 -->
              "devicefType": val.devicefType, //<!-- 文件类型 -->
              "devicefDtlMsg": val.devicefDtlMsg, //<!-- 文件名称 -->
              "devicefDtlPath": val.devicefDtlPath, //<!-- 文件路径 -->
              "devicefDtlTime": val.devicefDtlTime.replace('T', ' '), //<!-- 上传时间 -->
              "devicefDtlCreator": val.devicefDtlCreator, //<!-- 创建人 -->
              "devicefDtlCreatetime": val.devicefDtlCreatetime.replace('T', ' '), //<!-- 创建时间 -->
            })
          });
          this.pageResize();
        } else if (res.data.statusCode == 407 || res.data.statusCode == 402) {
          this.$router.push({
            path: "/login"
          });
          this.$message({
            type: 'warning',
            message: this.$t('common.logoutTitle'),
            showClose: true,
            duration: 2000
          });
        };
      }).catch(res => {
        // console.log(res)
      });
    },
    onSubmit() {
      let start = '', end = '';
      if (this.startTime) {
        start = this.startTime.toString().split('GMT')[0];
      }
      if (this.endTime) {
        end = this.endTime.toString().split('GMT')[0];
      }
      this.getFaceData(this.currentPage, this.pageTotal, this.dateQuery.deviceId, this.dateQuery.deviceuId, this.dateQuery.devicelId, start, end)
    },
    //切换页码
    handleSizeChange(val) {
      this.pageTotal = val;
      let start = '', end = '';
      if (this.startTime) {
        start = this.startTime.toString().split('GMT')[0];
      }
      if (this.endTime) {
        end = this.endTime.toString().split('GMT')[0];
      }
      this.getFaceData(this.currentPage, this.pageTotal, this.dateQuery.deviceId, this.dateQuery.deviceuId, this.dateQuery.devicelId, start, end)
    },
    //切换每页数量
    handleCurrentChange(val) {
      this.currentPage = val;
      let start = '', end = '';
      if (this.startTime) {
        start = this.startTime.toString().split('GMT')[0];
      }
      if (this.endTime) {
        end = this.endTime.toString().split('GMT')[0];
      }
      this.getFaceData(this.currentPage, this.pageTotal, this.dateQuery.deviceId, this.dateQuery.deviceuId, this.dateQuery.devicelId, start, end)
    },
    //查看大图
    enlargeImg(val) {
      this.enlargeImgUrl = '';
      this.imgVisible = true;
      this.enlargeImgUrl = val;
    },
    pageResize() {
      this.$nextTick(() => {
        var app = document.getElementById('app');
        var faceData = document.getElementById('faceData');
        var faceDataQuery = document.getElementById('faceDataQuery');
        var faceDataTable = document.getElementById('faceDataTable');
        var faceDataPage = document.getElementById('faceDataPage');
        if (document.body.scrollHeight > document.body.offsetHeight) {
          faceDataPage.style.width = faceDataTable.clientWidth - 11 + 'px'
          faceDataPage.style.paddingLeft = '25px'
          faceDataPage.style.paddingRight = '25px'
          faceDataPage.style.marginLeft = -faceDataPage.offsetWidth / 2 + 'px';
          faceDataPage.style.position = 'fixed';
          this.active = true;
        } else {
          faceDataPage.style.paddingLeft = '5px'
          faceDataPage.style.position = 'static';
          faceDataPage.style.marginLeft = '0px';
          this.active = false;
        }
      })
    }
  },
  mounted() {
    this.$root.Bus.$on('languageChange', (res) => { });
    let _this = this;
    _this.getDeviceList();
    _this.getDeviceuList();
    _this.getDevicelList();
    _this.getFaceData(1, 10);
    _this.pageResize();
    window.onresize = () => {
      _this.pageResize();
    }
  },
  destroyed() {
    window.onresize = null;
  }
}

</script>
<style lang="scss">
#faceData {
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;

  .el-form-item {
    margin-bottom: 20px;
  }

  #faceDataPage {
    left: 50%;
    bottom: 40px;
    z-index: 2000;
    padding: 5px;
    background-color: rgba(75, 75, 75, 0);

    &.activeBackground {
      background-color: #fff;
    }
  }

  .video-js .vjs-big-play-button {
    top: 50%;
    left: 50%;
    margin-top: -22px;
    margin-left: -45px;
  }
  .aplayer-pic {
    width: 50px;
    height: 50px;
  }
  .aplayer-info {
    height: 50px;
    padding: 5px;
  }
  .el-dialog {
    .aplayer-pic {
      width: 80px;
      height: 80px;
    }
    .aplayer-info {
      height: 80px;
      padding: 15px;
    }
  }
}
</style>
