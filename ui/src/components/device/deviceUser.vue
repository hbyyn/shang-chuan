<template>
  <div id="deviceu">
    <el-form :inline="true" :model="dateQuery" class="demo-form-inline" id="deviceuQuery">
      <el-form-item :label="$t('deviceu.deviceuName')">
        <el-select v-model="dateQuery.deviceuName" filterable clearable :placeholder="$t('common.select')">
          <el-option v-for="item in dateQuery.deviceuList" :key="item.value" :label="item.label" :value="item.value" ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{$t('common.query')}}</el-button>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button type="primary" @click="addStaff">{{$t('common.add')}}</el-button>
        <el-button type="primary" @click="addBatch">{{$t('common.addBatch')}}</el-button>
        <el-button type="danger" @click="delBatch">{{$t('common.deleteBatch')}}</el-button>
      </el-form-item>
    </el-form>
    <el-table id="deviceuTable" :data="deviceuData" border style="width:100%;" size="mini" @selection-change="handleSelection" >
      <el-table-column type="selection" width="40"></el-table-column>>
      <el-table-column prop="deviceuId" :label="$t('deviceu.deviceuId')" width="150"></el-table-column>
      <el-table-column prop="deviceuName" :label="$t('deviceu.deviceuName')"></el-table-column>
      <el-table-column prop="faceId" :label="$t('deviceu.faceId')"></el-table-column>
      <el-table-column prop="alcoholId" :label="$t('deviceu.alcoholId')"></el-table-column>
      <el-table-column prop="creator" :label="$t('common.creator')"></el-table-column>
      <el-table-column prop="creationTime" :label="$t('common.creationTime')"></el-table-column>
      <el-table-column :label="$t('deviceu.deviceuImage')" width="100px">
        <template slot-scope="scope">
          <viewer :images="[scope.row.deviceuImage]" v-if="scope.row.deviceuImage">
            <img :src="scope.row.deviceuImage" width="32" style="cursor:pointer;" height="32">
          </viewer>
        </template>
      </el-table-column>
      <el-table-column prop="operation" :label="$t('common.operation')" align="center" width="160">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">{{$t('common.edit')}}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">{{$t('common.delete')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination id="deviceuPage" :class="{activeBackground: active}" style="border: 1px solid #ebeef5;border-top:0px;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 25, 50, 100]" :page-size="10" :pager-count="5" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    <!-- 单个新增弹窗 -->
    <el-dialog :title="deviceuVisibleTitle" :visible.sync="deviceuVisible" width="540px">
      <el-form :model="deviceuForm" :rules="rules" ref="deviceuForm" label-width="170px" class="demo-deviceuForm" >
        <el-form-item :label="$t('deviceu.deviceuId')" prop="deviceuId">
          <el-input v-model="deviceuForm.deviceuId" v-if="deviceuAddEdit" @blur="checkUserId" :placeholder="$t('deviceu.deviceuIdTitle')"></el-input>
          <el-input v-model="deviceuForm.deviceuId" v-else :readonly="!deviceuAddEdit"></el-input>
        </el-form-item>
        <el-form-item :label="$t('deviceu.deviceuName')">
          <el-input v-model="deviceuForm.deviceuName" :placeholder="$t('deviceu.deviceuNameTitle')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('deviceu.faceId')">
          <el-select v-model="deviceuForm.faceId" clearable :placeholder="$t('common.select')">
            <el-option v-for="item in deviceuForm.faceList" :key="item.value" :label="item.label" :value="item.value" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('deviceu.alcoholId')">
          <el-select v-model="deviceuForm.alcoholId" clearable :placeholder="$t('common.select')">
            <el-option v-for="item in deviceuForm.alcoholList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('deviceu.deviceuImage')">
          <div class="upload-box-logo" style="margin:0px;">
            <el-upload :action="actionUrl" accept="image/jpeg" list-type="picture-card" :data="deviceuForm.imgType" :headers="headerdate" :show-file-list="false" :before-upload="bgUpload" :on-success="bgSuccess" :on-error="bgError">
              <i class="el-icon-plus"></i>
            </el-upload>
            <div class="popUp" v-show="deviceuForm.logoBg" @mouseover="bgOver" @mouseout="bgOut">
              <img :src="deviceuForm.deviceuImage" alt="logo">
              <div class="mask" v-show="deviceuForm.logoMask">
                <i class="el-icon-delete" @click="deleteBgImg"></i>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item style="margin-bottom:0px;">
          <el-button type="primary" @click="submitForm('deviceuForm')">{{$t('common.confirm')}}</el-button>
          <el-button @click="deviceuVisible=false">{{$t('common.cancel')}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 批量新增弹窗 -->
    <el-dialog :title="$t('common.addBatch')" :visible.sync="batchVisible" width="1024px" id="batch">
      <el-form>
        <el-row :gutter="10">
          <el-col :span="6" align="center" style="font-size:14px;font-weight:bold;">
            {{$t('deviceu.deviceuId')}}
            <span class="asterisk">*</span>
          </el-col>
          <el-col :span="6" align="center" style="font-size:14px;font-weight:bold;">{{$t('deviceu.deviceuName')}}</el-col>
          <el-col :span="5" align="center" style="font-size:14px;font-weight:bold;">{{$t('deviceu.faceId')}}</el-col>
          <el-col :span="5" align="center" style="font-size:14px;font-weight:bold;">{{$t('deviceu.alcoholId')}}</el-col>
          <el-col :span="2" align="center" style="font-size:14px;font-weight:bold;">{{$t('deviceu.deviceuImage')}}</el-col>
        </el-row>
        <el-row :gutter="10" v-for="(item,index) in batchForm" :key="item.id" style="margin-bottom:10px;">
          <el-col :span="6" style="padding-top:8px;">
            <el-input v-model="item.deviceuId" @blur="checkDatchDeviceId(item.deviceuId,index)"></el-input>
          </el-col>
          <el-col :span="6" style="padding-top:8px;">
            <el-input
              v-model="item.deviceuName"
              :placeholder="index==0?$t('deviceu.deviceuNameTitle'):$t('common.ditto')"
            ></el-input>
          </el-col>
          <el-col :span="5" style="padding-top:8px;">
            <el-select v-model="item.faceId" :placeholder="index==0?$t('department.querySelect'):$t('common.ditto')" :filterable="true" clearable >
              <el-option v-for="item in deviceuForm.faceList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-col>
          <el-col :span="5" style="padding-top:8px;">
            <el-select v-model="item.alcoholId" :placeholder="index==0?$t('department.querySelect'):$t('common.ditto')" :filterable="true" clearable >
              <el-option v-for="item in deviceuForm.alcoholList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-col>
          <el-col :span="2" id="batchLogo" align="center">
            <div class="upload-box-logo" style="margin:0px;" @change="change(index)">
              <el-upload :action="actionUrl" accept="image/jpeg" list-type="picture-card" :data="deviceuForm.imgType" :headers="headerdate" :show-file-list="false" :before-upload="bgUpload" :on-success="bgBatchSuccess" :on-error="bgBatchError">
                <i class="el-icon-plus" style="margin-top: -8px;position: absolute;top: 50%;left: 50%;margin-left: -8px;font-size: 17px;" v-if="index==0" ></i>
                <span v-else style="position: absolute;line-height: 32px;top: 16%;left: 22%;" >{{$t('common.ditto')}}</span>
              </el-upload>
              <div class="popUp" v-show="item.logoBg" @mouseover="bgBatchOver(index)" @mouseout="bgBatchOut(index)">
                <img :src="item.deviceuImage" alt="logo">
                <div class="mask" v-show="item.logoMask">
                  <i class="el-icon-delete" @click="deleteBatchBgImg(index)"></i>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer" style="text-align: center;">
        <el-button type="primary" @click="submitBatch">{{$t('common.confirm')}}</el-button>
        <el-button @click="batchVisible = false">{{$t('common.cancel')}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      headerdate: {},
      //上传文件地址
      actionUrl: NEW_URL_CONFIG + "/api/file/upload",
      dateQuery: {
        deviceuList: [],
        deviceuName: ""
      },
      deviceuData: [],
      //选择保存值
      selection: [],
      //当前页码
      currentPage: 1,
      //每页多少条
      pageTotal: 10,
      //数据总数
      total: 0,
      active: true,
      deviceuVisible: false,
      deviceuAddEdit: false, //true表新增，false表示编辑
      deviceuVisibleTitle: this.$t("common.add"),
      deviceuForm: {
        deviceuId: "",
        deviceuName: "",
        faceId: "",
        faceList: [],
        alcoholId: "",
        alcoholList: [],
        deviceuImage: "",
        logoUrl: "",
        logoBg: false,
        logoMask: false,
        imgType: {
          targetEnum: "DeviceUser"
        }
        // logo: '',
        // logoUrl: '',
      },
      rules: {
        deviceuId: [
          {
            required: true,
            message: this.$t("deviceu.deviceuIdTitle"),
            trigger: "change"
          }
        ],
        deviceuName: [
          {
            required: true,
            message: this.$t("deviceu.deviceuNameTitle"),
            trigger: "change"
          }
        ],
        faceId: [
          {
            required: true,
            message: this.$t("deviceu.faceIdTitle"),
            trigger: "change"
          }
        ],
        alcoholId: [
          {
            required: true,
            message: this.$t("deviceu.alcoholIdTitle"),
            trigger: "change"
          }
        ],
        deviceuImage: [
          {
            required: true,
            message: this.$t("deviceu.deviceuImageTitle"),
            trigger: "change"
          }
        ]
      },
      batchVisible: false,
      batchUpload: 0,
      batchForm: [
        {
          deviceuId: "",
          deviceuName: "",
          faceId: "",
          alcoholId: "",
          deviceuImage: "",
          logoUrl: "",
          logoBg: false,
          logoMask: false
        },
        {
          deviceuId: "",
          deviceuName: "",
          faceId: "",
          alcoholId: "",
          deviceuImage: "",
          logoUrl: "",
          logoBg: false,
          logoMask: false
        },
        {
          deviceuId: "",
          deviceuName: "",
          faceId: "",
          alcoholId: "",
          deviceuImage: "",
          logoUrl: "",
          logoBg: false,
          logoMask: false
        },
        {
          deviceuId: "",
          deviceuName: "",
          faceId: "",
          alcoholId: "",
          deviceuImage: "",
          logoUrl: "",
          logoBg: false,
          logoMask: false
        },
        {
          deviceuId: "",
          deviceuName: "",
          faceId: "",
          alcoholId: "",
          deviceuImage: "",
          logoUrl: "",
          logoBg: false,
          logoMask: false
        },
        {
          deviceuId: "",
          deviceuName: "",
          faceId: "",
          alcoholId: "",
          deviceuImage: "",
          logoUrl: "",
          logoBg: false,
          logoMask: false
        },
        {
          deviceuId: "",
          deviceuName: "",
          faceId: "",
          alcoholId: "",
          deviceuImage: "",
          logoUrl: "",
          logoBg: false,
          logoMask: false
        },
        {
          deviceuId: "",
          deviceuName: "",
          faceId: "",
          alcoholId: "",
          deviceuImage: "",
          logoUrl: "",
          logoBg: false,
          logoMask: false
        },
        {
          deviceuId: "",
          deviceuName: "",
          faceId: "",
          alcoholId: "",
          deviceuImage: "",
          logoUrl: "",
          logoBg: false,
          logoMask: false
        },
        {
          deviceuId: "",
          deviceuName: "",
          faceId: "",
          alcoholId: "",
          deviceuImage: "",
          logoUrl: "",
          logoBg: false,
          logoMask: false
        }
      ]
    };
  },
  created() {
    //上传文件时验证用户的状态码
    this.headerdate = {
      Authorization:
        sessionStorage.getItem("loginPrefix") +
        " " +
        sessionStorage.getItem("loginToken")
    };
    this.getFaceList();
    this.getAlcoholList();
  },
  methods: {
    //获取人脸下拉列表数据
    getFaceList() {
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG + "/api/face/select",
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
          pageSize: 99999999
        }
      })
        .then(res => {
          if (res.data.statusCode == 200) {
            this.total = res.data.data.count;
            this.deviceuForm.faceList = [];
            res.data.data.resultObjects.forEach(val => {
              this.deviceuForm.faceList.push({
                value: val.faceId,
                label: val.faceId
              });
            });
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
    //获取酒精下拉列表数据
    getAlcoholList() {
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG + "/api/alcohol/select",
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
          pageSize: 99999999
        }
      })
        .then(res => {
          if (res.data.statusCode == 200) {
            this.total = res.data.data.count;
            this.deviceuForm.alcoholList = [];
            res.data.data.resultObjects.forEach(val => {
              this.deviceuForm.alcoholList.push({
                value: val.alcoholId,
                label: val.alcoholId
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
            this.total = res.data.data.count;
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
    getDeviceUser(pageIndex, pageSize, deviceuId) {
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG + "/api/deviceUser/select",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            sessionStorage.getItem("loginPrefix") +
            " " +
            sessionStorage.getItem("loginToken")
        },
        data: {
          pageIndex: pageIndex,
          pageSize: pageSize,
          deviceuId: deviceuId
        }
      })
        .then(res => {
          if (res.data.statusCode == 200) {
            this.total = res.data.data.count;
            this.deviceuData = [];
            res.data.data.resultObjects.forEach(val => {
              this.deviceuData.push({
                deviceuId: val.deviceuId,
                deviceuName: val.deviceuName,
                faceId: val.faceId,
                alcoholId: val.alcoholId,
                creationTime: val.deviceuCreatetime,
                creator: val.deviceuCreator,
                deviceuImage: val.deviceuImage,
                logoUrl: val.deviceuImage
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
    //条件查询设备用户
    onSubmit() {
      this.getDeviceUser(1, this.pageTotal, this.dateQuery.deviceuName);
    },
    //切换页码
    handleSizeChange(val) {
      this.pageTotal = val;
      this.getDeviceUser(this.currentPage, this.pageTotal);
    },
    //切换每页数量
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getDeviceUser(this.currentPage, this.pageTotal);
    },
    //单个验证设备用户编号是否存在。
    checkUserId() {
      if(this.deviceuForm.deviceuId){
        this.deviceuForm.deviceuId = this.deviceuForm.deviceuId.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
      }
      if (!this.deviceuForm.deviceuId) {
        return false;
      }
      this.$axios({
        method: "get",
        url:
          NEW_URL_CONFIG +
          "/api/deviceUser/check/" +
          this.deviceuForm.deviceuId,
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            sessionStorage.getItem("loginPrefix") +
            " " +
            sessionStorage.getItem("loginToken")
        },
        params: this.deviceuForm.deviceuId
      })
        .then(res => {
          if (res.data.statusCode == 200 && res.data.data) {
            this.deviceuForm.deviceuId = "";
            this.$message({
              showClose: true,
              duration: 2000,
              type: "warning",
              message: this.$t("deviceu.checkUserId")
            });
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
        .catch(res => {});
    },
    //表格选择事件
    handleSelection(val) {
      this.selection = [];
      if (val.length) {
        for (let i = 0; i < val.length; i++) {
          this.selection.push(val[i].deviceuId);
        }
      }
    },
    //新增职员
    addStaff() {
      this.deviceuVisible = true;
      this.deviceuAddEdit = true;
      this.deviceuVisibleTitle = this.$t("common.add");
      this.deviceuForm.deviceuId = "";
      this.deviceuForm.deviceuName = "";
      this.deviceuForm.faceId = "";
      this.deviceuForm.alcoholId = "";
      this.deviceuForm.deviceuImage = "";
      this.deviceuForm.logoUrl = "";
      this.deviceuForm.logoBg = false;
      this.$nextTick(()=>{
        this.$refs.deviceuForm.clearValidate();
      });
    },
    //编辑职员
    handleEdit(index, row) {
      this.deviceuVisible = true;
      this.deviceuAddEdit = false;
      this.deviceuVisibleTitle = this.$t("common.edit");
      this.deviceuForm.deviceuId = row.deviceuId;
      this.deviceuForm.deviceuName = row.deviceuName;
      this.deviceuForm.faceId = row.faceId;
      this.deviceuForm.alcoholId = row.alcoholId;
      this.deviceuForm.deviceuImage = row.deviceuImage;
      this.deviceuForm.logoUrl = row.logoUrl;
      if (row.logoUrl) {
        this.deviceuForm.logoBg = true;
      } else {
        this.deviceuForm.logoBg = false;
      }
    },
    //删除职员
    handleDelete(index, row) {
      this.$confirm(
        this.$t("common.delTitleTips1") +
          this.$t("deviceu.deviceu") +
          this.$t("common.delTitleTips2"),
        this.$t("common.tips"),
        {
          confirmButtonText: this.$t("common.confirm"),
          cancelButtonText: this.$t("common.cancel"),
          type: "warning"
        }
      )
        .then(() => {
          this.$axios({
            method: "delete",
            url: NEW_URL_CONFIG + "/api/deviceUser/delete/" + row.deviceuId,
            headers: {
              accept: "application/json",
              "Content-Type": "application/json",
              Authorization:
                sessionStorage.getItem("loginPrefix") +
                " " +
                sessionStorage.getItem("loginToken")
            },
            data: ''
          })
            .then(res => {
              if (res.data.statusCode == 200) {
                // this.getDeviceUser(this.currentPage,this.pageTotal);
                if (this.deviceuData.length == "1" && this.currentPage != "1") {
                  this.currentPage = this.currentPage - 1;
                  this.getDeviceUser(
                    this.currentPage,
                    this.pageTotal,
                    this.dateQuery.deviceuName
                  );
                } else {
                  this.getDeviceUser(
                    this.currentPage,
                    this.pageTotal,
                    this.dateQuery.deviceuName
                  );
                }
                this.getDeviceuList();
                this.$message({
                  showClose: true,
                  duration: 2000,
                  type: "success",
                  message: this.$t("common.delSuccessTitle")
                });
              } else if (
                res.data.statusCode == 407 ||
                res.data.statusCode == 402
              ) {
                this.$router.push({ path: "/login" });
                this.$message({
                  showClose: true,
                  duration: 2000,
                  type: "warning",
                  message: this.$t("common.logoutTitle")
                });
              } else if (res.data.statusCode == 202) {
                this.$message({
                  showClose: true,
                  duration: 2000,
                  type: "success",
                  message: this.$t("deviceu.delErrorTitle")
                });
              }
            })
            .catch(res => {});
        })
        .catch(() => {
          this.$message({
            showClose: true,
            duration: 2000,
            type: "info",
            message: this.$t("common.canceledDeletion")
          });
        });
    },
    //单个设备用户保存
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let deviceuName = '';
          if(this.deviceuForm.deviceuName){
            deviceuName = this.deviceuForm.deviceuName.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '')
          }
          let postData = {
            'deviceuId': this.deviceuForm.deviceuId,
            'deviceuName': deviceuName,
            'faceId': this.deviceuForm.faceId,
            'alcoholId': this.deviceuForm.alcoholId,
            'deviceuImage': this.deviceuForm.logoUrl
          };
          if (this.deviceuAddEdit) {
            //新增的保存
            this.$axios({
              method: "post",
              url: NEW_URL_CONFIG + "/api/deviceUser/add/single",
              headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                Authorization:
                  sessionStorage.getItem("loginPrefix") +
                  " " +
                  sessionStorage.getItem("loginToken")
              },
              data: postData
            })
              .then(res => {
                if (res.data.statusCode == 200) {
                  // console.log(res)
                  this.getDeviceUser(this.currentPage, this.pageTotal);
                  this.getDeviceuList();
                  this.$message({
                    showClose: true,
                    duration: 2000,
                    type: "success",
                    message: this.$t("common.addSuccessTitle")
                  });
                  this.deviceuVisible = false;
                } else if (
                  res.data.statusCode == 407 ||
                  res.data.statusCode == 402
                ) {
                  this.$router.push({ path: "/login" });
                  this.$message({
                    showClose: true,
                    duration: 2000,
                    type: "warning",
                    message: this.$t("common.logoutTitle")
                  });
                }
              })
              .catch(res => {});
          } else {
            //编辑的保存
            this.$axios({
              method: "put",
              url: NEW_URL_CONFIG + "/api/deviceUser/edit",
              headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                Authorization:
                  sessionStorage.getItem("loginPrefix") +
                  " " +
                  sessionStorage.getItem("loginToken")
              },
              data: postData
            })
              .then(res => {
                if (res.data.statusCode == 200) {
                  this.getDeviceUser(this.currentPage, this.pageTotal);
                  this.getDeviceuList();
                  this.$message({
                    showClose: true,
                    duration: 2000,
                    type: "success",
                    message: this.$t("common.editSuccessTitle")
                  });
                  this.deviceuVisible = false;
                } else if (
                  res.data.statusCode == 407 ||
                  res.data.statusCode == 402
                ) {
                  this.$router.push({ path: "/login" });
                  this.$message({
                    showClose: true,
                    duration: 2000,
                    type: "warning",
                    message: this.$t("common.logoutTitle")
                  });
                }
              })
              .catch(res => {});
          }
        } else {
          return false;
        }
      });
    },
    //批量新增
    addBatch() {
      this.batchVisible = true;
      this.batchForm = [
        {
          deviceuId: "",
          deviceuName: "",
          faceId: "",
          alcoholId: "",
          deviceuImage: "",
          logoUrl: "",
          logoBg: false,
          logoMask: false
        },
        {
          deviceuId: "",
          deviceuName: "",
          faceId: "",
          alcoholId: "",
          deviceuImage: "",
          logoUrl: "",
          logoBg: false,
          logoMask: false
        },
        {
          deviceuId: "",
          deviceuName: "",
          faceId: "",
          alcoholId: "",
          deviceuImage: "",
          logoUrl: "",
          logoBg: false,
          logoMask: false
        },
        {
          deviceuId: "",
          deviceuName: "",
          faceId: "",
          alcoholId: "",
          deviceuImage: "",
          logoUrl: "",
          logoBg: false,
          logoMask: false
        },
        {
          deviceuId: "",
          deviceuName: "",
          faceId: "",
          alcoholId: "",
          deviceuImage: "",
          logoUrl: "",
          logoBg: false,
          logoMask: false
        },
        {
          deviceuId: "",
          deviceuName: "",
          faceId: "",
          alcoholId: "",
          deviceuImage: "",
          logoUrl: "",
          logoBg: false,
          logoMask: false
        },
        {
          deviceuId: "",
          deviceuName: "",
          faceId: "",
          alcoholId: "",
          deviceuImage: "",
          logoUrl: "",
          logoBg: false,
          logoMask: false
        },
        {
          deviceuId: "",
          deviceuName: "",
          faceId: "",
          alcoholId: "",
          deviceuImage: "",
          logoUrl: "",
          logoBg: false,
          logoMask: false
        },
        {
          deviceuId: "",
          deviceuName: "",
          faceId: "",
          alcoholId: "",
          deviceuImage: "",
          logoUrl: "",
          logoBg: false,
          logoMask: false
        },
        {
          deviceuId: "",
          deviceuName: "",
          faceId: "",
          alcoholId: "",
          deviceuImage: "",
          logoUrl: "",
          logoBg: false,
          logoMask: false
        }
      ];
    },
    // 验证多个新增职员编号是否已存在
    checkDatchDeviceId(val, index) {
      if(this.batchForm[index].deviceuId){
        this.batchForm[index].deviceuId = this.batchForm[index].deviceuId.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
      }
      if (!this.batchForm[index].deviceuId) {
        return false;
      }
      let postData = [];
      let he = 0;
      for (let i = 0; i < this.batchForm.length; i++) {
        const ele = this.batchForm[i];
        if (ele.deviceuId) {
          postData.push({
            deviceuId: ele.deviceuId
          });
        }
      }
      postData.sort();
      for (var i = 0; i < postData.length; i++) {
        if (postData[i].deviceuId == this.batchForm[index].deviceuId) {
          he++;
        }
      }
      if (he > 1) {
        this.batchForm[index].deviceuId = "";
        this.$message({
          showClose: true,
          duration: 2000,
          type: "warning",
          message: this.$t("devicel.checkUserId")
        });
        return false
      }
      this.$axios({
        method: "get",
        url: NEW_URL_CONFIG + "/api/deviceUser/check/" + this.batchForm[index].deviceuId,
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            sessionStorage.getItem("loginPrefix") +
            " " +
            sessionStorage.getItem("loginToken")
        },
        params: this.batchForm[index].deviceuId
      })
        .then(res => {
          if (res.data.statusCode == 200 && res.data.data) {
            this.batchForm[index].deviceuId = "";
            this.$message({
              showClose: true,
              duration: 2000,
              type: "warning",
              message: this.$t("deviceu.checkUserId")
            });
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
        .catch(res => {});
    },
    //保存批量修改
    submitBatch() {
      let postData = [];
      let eleDeviceuName = "";
      let eleFaceId = "";
      let eleAlcoholId = "";
      let eleDeviceuImage = "";
      for (let i = 0; i < this.batchForm.length; i++) {
        const ele = this.batchForm[i];
        if (i == "0") {
          if (
            ele.deviceuId
          ) {
            postData.push(ele);
            if (ele.deviceuName) {
              eleDeviceuName = ele.deviceuName;
            }
            if (ele.faceId) {
              eleFaceId = ele.faceId;
            }
            if (ele.alcoholId) {
              eleAlcoholId = ele.alcoholId;
            }
            if (ele.deviceuImage) {
              eleDeviceuImage = ele.deviceuImage;
            }
          } else {
            this.$message({
              showClose: true,
              duration: 2000,
              type: "warning",
              message:
                this.$t("common.batchLineTitle1") +
                (i + 1) +
                this.$t("common.batchLineTitle2") +
                this.$t("deviceu.deviceuId") +
                this.$t("common.batchLineTitle3") +
                this.$t("deviceu.deviceuName") +
                this.$t("common.batchLineTitle3") +
                this.$t("deviceu.faceId") +
                this.$t("common.batchLineTitle3") +
                this.$t("deviceu.alcoholId") +
                this.$t("common.batchLineTitle3") +
                this.$t("deviceu.deviceuImage") +
                this.$t("common.batchLineTitle4")
            });
            return false;
          }
        } else {
          if (
            (ele.deviceuName && !ele.deviceuId) ||
            (ele.faceId && !ele.deviceuId) ||
            (ele.alcoholId && !ele.deviceuId) ||
            (ele.deviceuImage && !ele.deviceuId)
          ) {
            this.$message({
              showClose: true,
              duration: 2000,
              type: "warning",
              message:
                this.$t("common.batchLineTitle1") +
                (i + 1) +
                this.$t("common.batchLineTitle2") +
                this.$t("deviceu.deviceuId") +
                this.$t("common.batchLineTitle4")
            });
            return false;
          } else if (!ele.deviceuId) {
          } else {
            if (ele.deviceuName) {
              eleDeviceuName = ele.deviceuName;
            }
            if (ele.faceId) {
              eleFaceId = ele.faceId;
            }
            if (ele.alcoholId) {
              eleAlcoholId = ele.alcoholId;
            }
            if (ele.deviceuImage) {
              eleDeviceuImage = ele.deviceuImage;
            }
            ele.deviceuName = eleDeviceuName;
            ele.faceId = eleFaceId;
            ele.alcoholId = eleAlcoholId;
            ele.deviceuImage = eleDeviceuImage;
            postData.push(ele);
          }
        }
      }
      for (let i = 0; i < postData.length; i++) {
        if(postData[i].deviceuName){
          postData[i].deviceuName = postData[i].deviceuName.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
        }
      }
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG + "/api/deviceUser/add",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            sessionStorage.getItem("loginPrefix") +
            " " +
            sessionStorage.getItem("loginToken")
        },
        data: postData
      })
        .then(res => {
          if (res.data.statusCode == 200) {
            this.$message({
              showClose: true,
              duration: 2000,
              type: "success",
              message: this.$t("common.addSuccessTitle")
            });
            this.batchVisible = false;
            this.getDeviceUser(this.currentPage, this.pageTotal);
            this.getDeviceuList();
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
        .catch(res => {});
    },
    //批量删除
    delBatch() {
      if (this.selection.length) {
        this.$confirm(
          this.$t("common.delTitleTips1") +
            this.$t("deviceu.deviceu") +
            this.$t("common.delTitleTips2"),
          this.$t("common.tips"),
          {
            confirmButtonText: this.$t("common.confirm"),
            cancelButtonText: this.$t("common.cancel"),
            type: "warning"
          }
        )
          .then(() => {
            this.$axios({
              method: "delete",
              url: NEW_URL_CONFIG + "/api/deviceUser/delete",
              headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                Authorization:
                  sessionStorage.getItem("loginPrefix") +
                  " " +
                  sessionStorage.getItem("loginToken")
              },
              data: {
                deviceuids: this.selection
              }
            })
              .then(res => {
                if (res.data.statusCode == 200) {
                  if (
                    this.deviceuData.length == this.selection.length &&
                    this.currentPage != "1"
                  ) {
                    this.currentPage = this.currentPage - 1;
                    this.getDeviceUser(
                      this.currentPage,
                      this.pageTotal,
                      this.dateQuery.deviceuName
                    );
                  } else {
                    this.getDeviceUser(
                      this.currentPage,
                      this.pageTotal,
                      this.dateQuery.deviceuName
                    );
                  }
                  // this.getDeviceUser(this.currentPage,this.pageTotal);
                  this.getDeviceuList();
                  this.$message({
                    showClose: true,
                    duration: 2000,
                    type: "success",
                    message: this.$t("common.delSuccessTitle")
                  });
                } else if (
                  res.data.statusCode == 407 ||
                  res.data.statusCode == 402
                ) {
                  this.$router.push({ path: "/login" });
                  this.$message({
                    showClose: true,
                    duration: 2000,
                    type: "warning",
                    message: this.$t("common.logoutTitle")
                  });
                } else if (res.data.statusCode == 202) {
                  this.$message({
                    showClose: true,
                    duration: 2000,
                    type: "success",
                    message: this.$t("deviceu.delErrorTitle")
                  });
                }
              })
              .catch(res => {});
          })
          .catch(() => {
            this.$message({
              showClose: true,
              duration: 2000,
              type: "info",
              message: this.$t("common.canceledDeletion")
            });
          });
      } else {
        this.$message({
          showClose: true,
          duration: 2000,
          type: "warning",
          message: this.$t("deviceu.delNullTitle")
        });
        return false;
      }
    },
    resetForm(formName) {
      this.$refs[formName].clearValidate();
    },
    //图片上传前验证
    bgUpload(file) {
      var fileName = new Array();
      fileName = file.name.split(".");
      const extension1 = fileName[fileName.length - 1] === "jpg";
      const extension2 = fileName[fileName.length - 1] === "png";
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!extension1 && !extension2) {
        this.$message({
          showClose: true,
          duration: 2000,
          message: this.$t("common.imgType"),
          type: "warning"
        });
      }
      if (!isLt2M) {
        this.$message({
          showClose: true,
          duration: 2000,
          message: this.$t("common.imgSize"),
          type: "warning"
        });
      }
      return (extension1 || extension2) && isLt2M;
    },
    // 背景图片上传成功
    bgSuccess(res) {
      if (res.statusCode == 200) {
        this.deviceuForm.logoBg = true;
        this.deviceuForm.deviceuImage = res.data[0].fileUrl;
        this.deviceuForm.logoUrl = res.data[0].fileUrl;
      } else {
      }
    },
    // 背景图片上传失败
    bgError(res) {
      // console.log(res);
    },

    deleteBgImg() {
      this.deviceuForm.logoBg = false;
      this.deviceuForm.deviceuImage = "";
      this.deviceuForm.logoUrl = "";
    },
    bgOver() {
      this.deviceuForm.logoMask = true;
    },
    bgOut() {
      this.deviceuForm.logoMask = false;
    },
    change(index) {
      this.batchUpload = index;
    },
    // 背景图片上传成功
    bgBatchSuccess(res) {
      if (res.statusCode == 200) {
        this.batchForm[this.batchUpload].logoBg = true;
        this.batchForm[this.batchUpload].deviceuImage = res.data[0].fileUrl;
        this.batchForm[this.batchUpload].logoUrl = res.data[0].fileUrl;
      } else {
      }
    },
    // 背景图片上传失败
    bgBatchError(res) {
      // console.log(res);
    },

    deleteBatchBgImg(index) {
      this.batchForm[index].logoBg = false;
      this.batchForm[index].deviceuImage = "";
      this.batchForm[index].logoUrl = "";
    },
    bgBatchOver(index) {
      this.batchForm[index].logoMask = true;
    },
    bgBatchOut(index) {
      this.batchForm[index].logoMask = false;
    },
    pageResize() {
      this.$nextTick(() => {
        var app = document.getElementById("app");
        var deviceu = document.getElementById("deviceu");
        var deviceuQuery = document.getElementById("deviceuQuery");
        var deviceuTable = document.getElementById("deviceuTable");
        var deviceuPage = document.getElementById("deviceuPage");
        if (document.body.scrollHeight > document.body.offsetHeight) {
          deviceuPage.style.width = deviceuTable.clientWidth - 11 + "px";
          deviceuPage.style.paddingLeft = "25px";
          deviceuPage.style.paddingRight = "25px";
          deviceuPage.style.marginLeft = -deviceuPage.offsetWidth / 2 + "px";
          deviceuPage.style.position = "fixed";
          this.active = true;
        } else {
          deviceuPage.style.paddingLeft = "5px";
          deviceuPage.style.position = "static";
          deviceuPage.style.marginLeft = "0px";
          this.active = false;
        }
      });
    }
  },
  mounted() {
    this.$root.Bus.$on("languageChange", () => {
      this.rules = {
        deviceuId: [
          {
            required: true,
            message: this.$t("deviceu.deviceuIdTitle"),
            trigger: "change"
          }
        ],
        deviceuName: [
          {
            required: true,
            message: this.$t("deviceu.deviceuNameTitle"),
            trigger: "change"
          }
        ],
        faceId: [
          {
            required: true,
            message: this.$t("deviceu.faceIdTitle"),
            trigger: "change"
          }
        ],
        alcoholId: [
          {
            required: true,
            message: this.$t("deviceu.alcoholIdTitle"),
            trigger: "change"
          }
        ],
        deviceuImage: [
          {
            required: true,
            message: this.$t("deviceu.deviceuImageTitle"),
            trigger: "change"
          }
        ]
      };
    });
    let _this = this;
    _this.pageResize();
    _this.getDeviceUser(1, 10);
    _this.getDeviceuList();
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
#deviceu {
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
  .el-form-item {
    margin-bottom: 20px;
  }
  #deviceuPage {
    left: 50%;
    bottom: 40px;
    z-index: 2000;
    padding: 5px;
    background-color: rgba(75, 75, 75, 0);
    &.activeBackground {
      background-color: #fff;
    }
  }
  #batch {
    .el-dialog__body {
      padding: 20px 20px 0px;
      margin: 0px;
    }
    .asterisk {
      color: #f00;
      font-size: 15px;
      text-align: center;
      display: inline-block;
      width: 12px;
      line-height: 21px;
    }
  }
  .upload-box-logo {
    position: relative;
    width: 148px;
    height: 148px;
    margin: 0px 65px;
    .el-upload--picture-card {
      width: 148px !important;
      height: 148px !important;
      position: relative;
      i {
        font-size: 42px;
        margin-top: 52px;
        p {
          font-size: 18px;
          line-height: 36px;
        }
      }
    }
    .popUp {
      position: absolute;
      box-sizing: border-box;
      width: 148px;
      height: 148px;
      border-radius: 6px;
      border: 1px dashed #c0ccda;
      top: 0px;
      left: 0px;
      z-index: 1;
      img {
        position: absolute;
        width: 144px;
        height: 144px;
        border-radius: 6px;
        top: 1px;
        left: 1px;
      }
      .mask {
        position: absolute;
        width: 144px;
        height: 144px;
        border-radius: 6px;
        background-color: rgba(51, 51, 51, 0.8);
        top: 1px;
        left: 1px;
        text-align: center;
        z-index: 2;
        i {
          margin: 55px 10px 0;
          font-size: 32px;
          color: #fff;
          cursor: pointer;
        }
      }
    }
  }
  #batchLogo {
    .upload-box-logo {
      position: relative;
      width: 48px;
      height: 48px;
      margin: 0px 65px;
      .el-upload--picture-card {
        width: 48px !important;
        height: 48px !important;
        position: relative;
        i {
          font-size: 12px;
          margin-top: 12px;
          p {
            font-size: 18px;
            line-height: 36px;
          }
        }
      }
      .popUp {
        position: absolute;
        box-sizing: border-box;
        width: 48px;
        height: 48px;
        border-radius: 6px;
        border: 1px dashed #c0ccda;
        top: 0px;
        left: 0px;
        z-index: 1;
        img {
          position: absolute;
          width: 44px;
          height: 44px;
          border-radius: 6px;
          top: 1px;
          left: 1px;
        }
        .mask {
          position: absolute;
          width: 44px;
          height: 44px;
          border-radius: 6px;
          background-color: rgba(51, 51, 51, 0.8);
          top: 1px;
          left: 1px;
          text-align: center;
          z-index: 2;
          i {
            margin: 5px;
            font-size: 24px;
            color: #fff;
            cursor: pointer;
            margin-top: 10px;
          }
        }
      }
    }
  }
}
</style>
