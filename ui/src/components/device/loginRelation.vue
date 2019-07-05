<template>
  <div id="devicel">
    <el-form :inline="true" :model="dateQuery" class="demo-form-inline" id="devicelQuery">
      <el-form-item :label="$t('device.deviceName')" v-if="dateQuery.bool">
        <el-select v-model="dateQuery.deviceId" filterable clearable :placeholder="$t('common.select')">
          <el-option v-for="item in dateQuery.deviceList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('devicel.devicelName')" v-else>
        <el-select v-model="dateQuery.devicelId" filterable clearable :placeholder="$t('common.select')">
          <el-option v-for="item in dateQuery.devicelList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{$t('common.query')}}</el-button>
      </el-form-item>
      <el-form-item style="float:right">
        <el-switch v-model="dateQuery.bool" :active-text="$t('relation.deviceActive')" @change="changeMain" :inactive-text="$t('relation.devicelActive')" style="margin-top:2px;margin-right:20px;"></el-switch>
        <el-button type="primary" @click="addStaff">{{$t('common.add')}}</el-button>
        <el-button type="danger" @click="delBatch">{{$t('common.deleteBatch')}}</el-button>
      </el-form-item>
    </el-form>
    <el-table id="devicelTable" :data="relationData" border style="width:100%;" size="mini" v-if="dateQuery.bool" @selection-change="handleSelection" >
      <el-table-column type="selection" width="40"></el-table-column>>
      <el-table-column prop="deviceId" :label="$t('device.deviceId')" ></el-table-column>
      <el-table-column prop="deviceName" :label="$t('device.deviceName')"></el-table-column>
      <el-table-column prop="devicelId" :label="$t('devicel.devicelId')"></el-table-column>
      <el-table-column prop="devicelName" :label="$t('devicel.devicelName')"></el-table-column>
      <el-table-column prop="deviceDevicelUse" :label="$t('device.enableSwitch')" width="80px">
        <template slot-scope="scope">
          <span v-if="scope.row.deviceDevicelUse">{{$t('common.open')}}</span>
          <span v-else>{{$t('common.close')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="operation" :label="$t('common.operation')" align="center" width="280">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">{{$t('common.edit')}}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">{{$t('common.delete')}}</el-button>
          <el-button type="primary" size="mini" @click="handleCode(scope.$index, scope.row)">{{$t('common.qrCode')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-table id="devicelTable" :data="relationData" border style="width:100%;" size="mini" v-else @selection-change="handleSelection">
      <el-table-column type="selection" width="40"></el-table-column>>
      <el-table-column prop="devicelId" :label="$t('devicel.devicelId')"></el-table-column>
      <el-table-column prop="devicelName" :label="$t('devicel.devicelName')"></el-table-column>
      <el-table-column prop="deviceId" :label="$t('device.deviceId')"></el-table-column>
      <el-table-column prop="deviceName" :label="$t('device.deviceName')"></el-table-column>
      <el-table-column prop="deviceDevicelUse" :label="$t('device.enableSwitch')" width="80px">
        <template slot-scope="scope">
          <span v-if="scope.row.deviceDevicelUse">{{$t('common.open')}}</span>
          <span v-else>{{$t('common.close')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="operation" :label="$t('common.operation')" align="center" width="280">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">{{$t('common.edit')}}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">{{$t('common.delete')}}</el-button>
          <el-button type="primary" size="mini" @click="handleCode(scope.$index, scope.row)">{{$t('common.qrCode')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      id="devicelPage"
      :class="{activeBackground: active}"
      style="border: 1px solid #ebeef5;border-top:0px;"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 25, 50, 100]"
      :page-size="10"
      :pager-count="5"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
    <!-- 单个新增弹窗 -->
    <el-dialog :title="devicelVisibleTitle" :visible.sync="devicelVisible" width="540px">
      <el-form :model="devicelForm" :rules="rules" ref="devicelForm" label-width="160px">
        <!-- 新增设备 -->
        <div v-if="dateQuery.bool&&devicelAddEdit">
          <el-form-item :label="$t('device.deviceName')" prop="deviceId">
            <el-select
              v-model="devicelForm.deviceId"
              style="width:320px;"
              multiple
              @change="checkDeviceId"
            >
              <el-option
                v-for="(item,index) in dateQuery.deviceList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <!-- <div>新增设备</div> -->
          </el-form-item>
          <el-form-item :label="$t('devicel.devicelName')" prop="devicelId">
            <el-select v-model="devicelForm.devicelId" style="width:320px;" multiple>
              <el-option
                v-for="(item,index) in devicelForm.devicelList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('device.enableSwitch')">
            <el-switch v-model="devicelForm.enableSwitch"></el-switch>
          </el-form-item>
        </div>
        <!-- 新增登录 -->
        <div v-else-if="!dateQuery.bool&&devicelAddEdit">
          <el-form-item :label="$t('devicel.devicelName')" prop="devicelId">
            <el-select
              v-model="devicelForm.devicelId"
              style="width:320px;"
              multiple
              @change="checkDeviceId"
            >
              <el-option
                v-for="(item,index) in dateQuery.devicelList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <!-- <div>新增登录</div> -->
          </el-form-item>
          <el-form-item :label="$t('device.deviceName')" prop="deviceId">
            <el-select v-model="devicelForm.deviceId" style="width:320px;" multiple>
              <el-option
                v-for="(item,index) in devicelForm.deviceList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('device.enableSwitch')">
            <el-switch v-model="devicelForm.enableSwitch"></el-switch>
          </el-form-item>
        </div>
        <!-- 编辑设备 -->
        <div v-else-if="dateQuery.bool&&!devicelAddEdit">
          <el-form-item :label="$t('device.deviceName')" prop="deviceId">
            <el-select v-model="devicelForm.deviceId" style="width:320px;" multiple>
              <el-option
                v-for="(item,index) in devicelForm.deviceList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <!-- <div>编辑设备</div> -->
          </el-form-item>
          <el-form-item :label="$t('devicel.devicelName')" prop="devicelId">
            <el-select v-model="devicelForm.devicelId" style="width:320px;" multiple>
              <el-option
                v-for="(item,index) in devicelForm.devicelList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('device.enableSwitch')">
            <el-switch v-model="devicelForm.enableSwitch"></el-switch>
          </el-form-item>
        </div>
        <!-- 编辑登录 -->
        <div v-else-if="!dateQuery.bool&&!devicelAddEdit">
          <el-form-item :label="$t('devicel.devicelName')" prop="devicelId">
            <el-select v-model="devicelForm.devicelId" style="width:320px;" multiple>
              <el-option
                v-for="(item,index) in devicelForm.devicelList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <!-- <div>编辑登录</div> -->
          </el-form-item>
          <el-form-item :label="$t('device.deviceName')" prop="deviceId">
            <el-select v-model="devicelForm.deviceId" style="width:320px;" multiple>
              <el-option
                v-for="(item,index) in devicelForm.deviceList"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('device.enableSwitch')">
            <el-switch v-model="devicelForm.enableSwitch"></el-switch>
          </el-form-item>
        </div>
        <el-form-item style="margin-bottom:0px;">
          <el-button type="primary" @click="submitForm('devicelForm')">{{$t('common.confirm')}}</el-button>
          <el-button @click="devicelVisible=false">{{$t('common.cancel')}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :visible.sync="qrCodeVisible" width="440px" class="qrCode">
      <img :src="qrCodeUrl" alt="QR code" width="400" height="400">
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      qrCodeVisible: false,
      qrCodeUrl: "",
      dateQuery: {
        bool: false,
        deviceId: "",
        deviceList: [],
        devicelId: "",
        devicelList: []
      },
      relationData: [],
      //选择保存值
      selection: [],
      //当前页码
      currentPage: 1,
      //每页多少条
      pageTotal: 10,
      //数据总数
      total: 0,
      active: true,
      devicelVisible: false,
      devicelAddEdit: false, //true表新增，false表示编辑
      devicelVisibleTitle: this.$t("common.add"),
      devicelForm: {
        deviceId: [],
        deviceList: [],
        // deviceIdEdit: '',
        devicelId: [],
        devicelList: [],
        // devicelIdEdit: '',
        enableSwitch: true,
        associatedId: ""
      },
      rules: {
        deviceId: [
          {
            required: true,
            message: this.$t("device.deviceIdTitle"),
            trigger: "change"
          }
        ],
        devicelId: [
          {
            required: true,
            message: this.$t("devicel.devicelIdTitle"),
            trigger: "change"
          }
        ],
        enableSwitch: [{ required: true, message: "", trigger: "change" }]
      }
    };
  },
  created() {},
  methods: {
    //获取设备下拉列表数据
    getDeviceList() {
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG + "/api/device/select",
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
          // console.log(res)
          if (res.data.statusCode == 200) {
            this.dateQuery.deviceList = [];
            res.data.data.resultObjects.forEach(val => {
              this.dateQuery.deviceList.push({
                value: val.deviceId,
                label: val.deviceId + " " + val.deviceName
              });
              this.devicelForm.deviceList.push({
                value: val.deviceId,
                label: val.deviceId + " " + val.deviceName
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
    getDeviceLoginList() {
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG + "/api/devicelogin/select/base",
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
          // console.log(res)
          if (res.data.statusCode == 200) {
            this.dateQuery.devicelList = [];
            res.data.data.resultObjects.forEach(val => {
              this.dateQuery.devicelList.push({
                value: val.devicelId,
                label: val.devicelId + " " + val.devicelName
              });
              this.devicelForm.devicelList.push({
                value: val.devicelId,
                label: val.devicelId + " " + val.devicelName
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
    //检索列表数据
    changeMain() {
      this.relationData = [];
      this.dateQuery.deviceId = "";
      this.dateQuery.devicelId = "";
      this.getRelationList(
        this.currentPage,
        this.pageTotal,
        this.dateQuery.deviceId,
        this.dateQuery.devicelId
      );
    },
    //获取列表数据
    getRelationList(pageIndex, pageSize, deviceId, devicelId) {
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG + "/api/devicedevicelogin/select",
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
          deviceId: deviceId,
          devicelId: devicelId,
          isDeviceView: this.dateQuery.bool
        }
      })
        .then(res => {
          // console.log(res)
          if (res.data.statusCode == 200) {
            this.relationData = [];
            this.total = res.data.data.count;
            //设备登录为主
            res.data.data.resultObjects.forEach(val => {
              this.relationData.push({
                deviceId: val.deviceId,
                deviceName: val.deviceName,
                devicelId: val.devicelId,
                devicelName: val.devicelName,
                deviceDevicelUse: val.deviceDevicelUse
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
      if (this.dateQuery.bool) {
        this.getRelationList(1, this.pageTotal, this.dateQuery.deviceId);
      } else {
        this.getRelationList(1, this.pageTotal, "", this.dateQuery.devicelId);
      }
    },
    //切换页码
    handleSizeChange(val) {
      this.pageTotal = val;
      if (this.dateQuery.bool) {
        this.getRelationList(
          this.currentPage,
          this.pageTotal,
          this.dateQuery.deviceId
        );
      } else {
        this.getRelationList(
          this.currentPage,
          this.pageTotal,
          "",
          this.dateQuery.devicelId
        );
      }
    },
    //切换每页数量
    handleCurrentChange(val) {
      this.currentPage = val;
      if (this.dateQuery.bool) {
        this.getRelationList(
          this.currentPage,
          this.pageTotal,
          this.dateQuery.deviceId
        );
      } else {
        this.getRelationList(
          this.currentPage,
          this.pageTotal,
          "",
          this.dateQuery.devicelId
        );
      }
    },
    //新增验证设备
    checkDeviceId() {
      let postData = {
        isDeviceView: this.dateQuery.bool,
        objectIds: []
      };
      if (this.devicelAddEdit) {
        if (this.dateQuery.bool) {
          // 新增设备
          this.devicelForm.devicelList = [];
          this.devicelForm.devicelId = [];
          if (this.devicelForm.deviceId.length) {
            postData.objectIds = this.devicelForm.deviceId;
          } else {
            return false;
          }
        } else {
          // 新增登录
          this.devicelForm.deviceList = [];
          this.devicelForm.deviceId = [];
          if (this.devicelForm.devicelId.length) {
            postData.objectIds = this.devicelForm.devicelId;
          } else {
            return false;
          }
        }
      } else {
        if (this.dateQuery.bool) {
          //编辑设备
          this.devicelForm.devicelList = [];
          this.devicelForm.devicelId = [];
          if (this.devicelForm.deviceId.length) {
            postData.objectIds = this.devicelForm.deviceId;
          } else {
            return false;
          }
        } else {
          // 编辑登录
          this.devicelForm.deviceList = [];
          this.devicelForm.deviceId = [];
          if (this.devicelForm.devicelId.length) {
            postData.objectIds = this.devicelForm.devicelId;
          } else {
            return false;
          }
        }
      }
      // console.log(postData)
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG + "/api/devicedevicelogin/select/id",
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
          // console.log(res)
          if (res.data.statusCode == 200) {
            if (this.dateQuery.bool) {
              res.data.data.forEach(val => {
                this.devicelForm.devicelList.push({
                  value: val.associatedId,
                  label: val.associatedName + " " + val.associatedId
                });
              });
            } else {
              res.data.data.forEach(val => {
                this.devicelForm.deviceList.push({
                  value: val.associatedId,
                  label: val.associatedName + " " + val.associatedId
                });
              });
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
        })
        .catch(res => {});
    },
    //单个验证设备用户编号是否存在。
    // checkUserId(){
    //   if(!this.devicelForm.devicelId){
    //     return false
    //   }
    //   this.$axios({
    //     method: "get",
    //     url: NEW_URL_CONFIG+"/api/devicelogin/check/"+this.devicelForm.devicelId,
    //     headers: {
    //         "accept": "application/json",
    //         "Content-Type": "application/json",
    //         Authorization: sessionStorage.getItem("loginPrefix")+' '+sessionStorage.getItem("loginToken")
    //     },
    //     params: this.devicelForm.devicelId
    //   }).then(res=>{
    //     if(res.data.statusCode == 200&&res.data.data){
    //       this.devicelForm.devicelId = '';
    //       this.$message({showClose: true,duration:2000,
    //           type: 'warning',
    //           message: this.$t('devicel.checkUserId')
    //       });
    //     }else if(res.data.statusCode == 407||res.data.statusCode == 402){
    //       this.$router.push({path: "/login"});
    //       this.$message({showClose: true,duration:2000,
    //           type: 'warning',
    //           message: this.$t('common.logoutTitle')
    //       });
    //     };
    //   }).catch(res=>{

    //   });
    // },
    //表格选择事件
    handleSelection(val) {
      this.selection = [];
      if (val.length) {
        for (let i = 0; i < val.length; i++) {
          this.selection.push({
            devicelId: val[i].devicelId,
            deviceId: val[i].deviceId
          });
        }
      }
    },
    //新增职员
    addStaff() {
      this.devicelVisible = true;
      this.devicelAddEdit = true;
      this.devicelVisibleTitle = this.$t("common.add");
      this.devicelForm.deviceId = [];
      this.devicelForm.devicelId = [];
      this.devicelForm.enableSwitch = false;
      if (this.dateQuery.bool) {
        this.devicelForm.devicelList = [];
      } else {
        this.devicelForm.deviceList = [];
      }
      this.$nextTick(()=>{
        this.$refs.devicelForm.clearValidate();
      });
    },
    //编辑职员
    handleEdit(index, row) {
      // console.log(row)
      this.devicelVisible = true;
      this.devicelAddEdit = false;
      this.devicelVisibleTitle = this.$t("common.edit");
      this.devicelForm.enableSwitch = row.deviceDevicelUse;
      let postData = {
        isDeviceView: this.dateQuery.bool,
        objectIds: []
      };
      if (this.dateQuery.bool) {
        this.devicelForm.deviceId = [row.deviceId];
        this.devicelForm.deviceList = [].concat([
          {
            value: row.deviceId,
            label: row.deviceName
          }
        ]);
        this.devicelForm.devicelId = [row.devicelId];
        this.devicelForm.associatedId = row.deviceId;
        postData.objectIds = this.devicelForm.deviceId;
      } else {
        this.devicelForm.devicelId = [row.devicelId];
        this.devicelForm.devicelList = [].concat([
          {
            value: row.devicelId,
            label: row.devicelName
          }
        ]);
        postData.objectIds = this.devicelForm.devicelId;
        this.devicelForm.associatedId = row.deviceId;
        this.devicelForm.deviceId = [row.deviceId];
      }
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG + "/api/devicedevicelogin/select/id",
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
            if (this.dateQuery.bool) {
              this.devicelForm.devicelList = [
                {
                  value: row.devicelId,
                  label: row.devicelName
                }
              ];
              res.data.data.forEach(val => {
                this.devicelForm.devicelList.push({
                  value: val.associatedId,
                  label: val.associatedName
                });
              });
            } else {
              this.devicelForm.deviceList = [
                {
                  value: row.deviceId,
                  label: row.deviceName
                }
              ];
              res.data.data.forEach(val => {
                this.devicelForm.deviceList.push({
                  value: val.associatedId,
                  label: val.associatedName
                });
              });
            }
          } else if (res.data.statusCode == 407 || res.data.statusCode == 402) {
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
              message: this.$t("relation.delDeviceError")
            });
          }
        })
        .catch(res => {});
    },
    //删除职员
    handleDelete(index, row) {
      this.$confirm(
        this.$t("common.delTitleTips1") +
          this.$t("devicel.devicel") +
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
            url: NEW_URL_CONFIG + "/api/devicedevicelogin/delete/single",
            headers: {
              accept: "application/json",
              "Content-Type": "application/json",
              Authorization:
                sessionStorage.getItem("loginPrefix") +
                " " +
                sessionStorage.getItem("loginToken")
            },
            data: {
              devicelId: row.devicelId,
              deviceId: row.deviceId
            }
          })
            .then(res => {
              if (res.data.statusCode == 200) {
                if (this.dateQuery.bool) {
                  if (
                    this.relationData.length == "1" &&
                    this.currentPage != "1"
                  ) {
                    this.currentPage = this.currentPage - 1;
                    this.getRelationList(
                      this.currentPage,
                      this.pageTotal,
                      this.dateQuery.deviceId
                    );
                  } else {
                    this.getRelationList(
                      this.currentPage,
                      this.pageTotal,
                      this.dateQuery.deviceId
                    );
                  }
                  // this.getRelationList(this.currentPage,this.pageTotal,this.dateQuery.deviceId);
                  this.getDeviceList();
                } else {
                  if (
                    this.relationData.length == "1" &&
                    this.currentPage != "1"
                  ) {
                    this.currentPage = this.currentPage - 1;
                    this.getRelationList(
                      this.currentPage,
                      this.pageTotal,
                      "",
                      this.dateQuery.devicelId
                    );
                  } else {
                    this.getRelationList(
                      this.currentPage,
                      this.pageTotal,
                      "",
                      this.dateQuery.devicelId
                    );
                  }
                  // this.getRelationList(this.currentPage,this.pageTotal,'',this.dateQuery.devicelId);
                  this.getDeviceLoginList();
                }
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
                  message: this.$t("relation.delDeviceError")
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
    //获取二维码
    handleCode(index, row) {
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG + "/api/qrcode/logindevice",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            sessionStorage.getItem("loginPrefix") +
            " " +
            sessionStorage.getItem("loginToken")
        },
        data: {
          devicelId: row.devicelId,
          deviceId: row.deviceId
        }
      })
        .then(res => {
          if (res.data.statusCode == 200) {
            this.qrCodeVisible = true;
            this.qrCodeUrl = "data:image/jpeg;base64," + res.data.data;
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
    //单个设备用户保存
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.devicelAddEdit) {
            let postData = [];
            for (let i = 0; i < this.devicelForm.devicelId.length; i++) {
              for (let j = 0; j < this.devicelForm.deviceId.length; j++) {
                postData.push({
                  deviceDevicelUse: this.devicelForm.enableSwitch,
                  devicelId: this.devicelForm.devicelId[i],
                  deviceId: this.devicelForm.deviceId[j]
                });
              }
            }
            //新增的保存
            this.$axios({
              method: "post",
              url: NEW_URL_CONFIG + "/api/devicedevicelogin/add",
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
                  if (this.dateQuery.bool) {
                    this.getRelationList(
                      this.currentPage,
                      this.pageTotal,
                      this.dateQuery.deviceId
                    );
                    this.getDeviceList();
                  } else {
                    this.getRelationList(
                      this.currentPage,
                      this.pageTotal,
                      "",
                      this.dateQuery.devicelId
                    );
                    this.getDeviceLoginList();
                  }
                  this.$message({
                    showClose: true,
                    duration: 2000,
                    type: "success",
                    message: this.$t("common.addSuccessTitle")
                  });
                  this.devicelVisible = false;
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
            let postData = {
              isDeviceView: this.dateQuery.bool,
              objectId: "",
              associatedId: "",
              associatedData: []
            };
            if (this.dateQuery.bool) {
              postData.objectId = this.devicelForm.deviceId[0];
              postData.associatedId = this.devicelForm.associatedId;
              for (let i = 0; i < this.devicelForm.devicelId.length; i++) {
                const ele = this.devicelForm.devicelId[i];
                postData.associatedData.push({
                  associatedId: ele,
                  isUse: this.devicelForm.enableSwitch
                });
              }
            } else {
              postData.objectId = this.devicelForm.devicelId[0];
              postData.associatedId = this.devicelForm.associatedId;
              for (let i = 0; i < this.devicelForm.deviceId.length; i++) {
                const ele = this.devicelForm.deviceId[i];
                postData.associatedData.push({
                  associatedId: ele,
                  isUse: this.devicelForm.enableSwitch
                });
              }
            }
            this.$axios({
              method: "put",
              url: NEW_URL_CONFIG + "/api/devicedevicelogin/edit",
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
                  if (this.dateQuery.bool) {
                    this.getRelationList(
                      this.currentPage,
                      this.pageTotal,
                      this.dateQuery.deviceId
                    );
                    this.getDeviceList();
                  } else {
                    this.getRelationList(
                      this.currentPage,
                      this.pageTotal,
                      "",
                      this.dateQuery.devicelId
                    );
                    this.getDeviceLoginList();
                  }
                  this.$message({
                    showClose: true,
                    duration: 2000,
                    type: "success",
                    message: this.$t("common.editSuccessTitle")
                  });
                  this.devicelVisible = false;
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
                    message: this.$t("relation.delDeviceError")
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
    //批量删除
    delBatch() {
      if (this.selection.length) {
        this.$confirm(
          this.$t("common.delTitleTips1") +
            this.$t("devicel.devicel") +
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
              url: NEW_URL_CONFIG + "/api/devicedevicelogin/delete",
              headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                Authorization:
                  sessionStorage.getItem("loginPrefix") +
                  " " +
                  sessionStorage.getItem("loginToken")
              },
              data: {
                deviceLoginIds: this.selection
              }
            })
              .then(res => {
                if (res.data.statusCode == 200) {
                  if (this.dateQuery.bool) {
                    if (
                      this.relationData.length == this.selection.length &&
                      this.currentPage != "1"
                    ) {
                      this.currentPage = this.currentPage - 1;
                      this.getRelationList(
                        this.currentPage,
                        this.pageTotal,
                        this.dateQuery.deviceId
                      );
                    } else {
                      this.getRelationList(
                        this.currentPage,
                        this.pageTotal,
                        this.dateQuery.deviceId
                      );
                    }
                    this.getDeviceList();
                  } else {
                    if (
                      this.relationData.length == this.selection.length &&
                      this.currentPage != "1"
                    ) {
                      this.currentPage = this.currentPage - 1;
                      this.getRelationList(
                        this.currentPage,
                        this.pageTotal,
                        "",
                        this.dateQuery.devicelId
                      );
                    } else {
                      this.getRelationList(
                        this.currentPage,
                        this.pageTotal,
                        "",
                        this.dateQuery.devicelId
                      );
                    }
                    this.getDeviceLoginList();
                  }
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
                    message: this.$t("relation.delDeviceError")
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
          message: this.$t("relation.delLoginTitle")
        });
        return false;
      }
    },
    resetForm(formName) {
      this.$refs[formName].clearValidate();
    },
    pageResize() {
      this.$nextTick(() => {
        var app = document.getElementById("app");
        var devicel = document.getElementById("devicel");
        var devicelQuery = document.getElementById("devicelQuery");
        var devicelTable = document.getElementById("devicelTable");
        var devicelPage = document.getElementById("devicelPage");
        if (document.body.scrollHeight > document.body.offsetHeight) {
          devicelPage.style.width = devicelTable.clientWidth - 11 + "px";
          devicelPage.style.paddingLeft = "25px";
          devicelPage.style.paddingRight = "25px";
          devicelPage.style.marginLeft = -devicelPage.offsetWidth / 2 + "px";
          devicelPage.style.position = "fixed";
          this.active = true;
        } else {
          devicelPage.style.paddingLeft = "5px";
          devicelPage.style.position = "static";
          devicelPage.style.marginLeft = "0px";
          this.active = false;
        }
      });
    }
  },
  mounted() {
    this.$root.Bus.$on("languageChange", () => {
      this.rules = {
        deviceId: [
          {
            required: true,
            message: this.$t("device.deviceIdTitle"),
            trigger: "change"
          }
        ],
        devicelId: [
          {
            required: true,
            message: this.$t("devicel.devicelIdTitle"),
            trigger: "change"
          }
        ],
        enableSwitch: [{ required: true, message: "", trigger: "change" }]
      };
    });
    let _this = this;
    _this.pageResize();
    _this.getDeviceList();
    _this.getDeviceLoginList();
    if (_this.dateQuery.bool) {
      _this.getRelationList(
        _this.currentPage,
        _this.pageTotal,
        _this.dateQuery.deviceId
      );
    } else {
      _this.getRelationList(
        _this.currentPage,
        _this.pageTotal,
        "",
        _this.dateQuery.devicelId
      );
    }
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
#devicel {
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
  .el-form-item {
    margin-bottom: 20px;
  }
  #devicelPage {
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
  }
  .qrCode {
    .el-dialog {
      box-shadow: 0px 0px 0px;
      background: transparent !important;
      position: relative;
      .el-dialog__header {
        border-bottom: 0px solid #000 !important;
        position: absolute;
        top: 10px;
        right: 0px;
        .el-dialog__close {
          font-size: 40px;
        }
        .el-dialog__headerbtn {
          top: -5px;
          right: -5px;
          border-radius: 50%;
          background: #fff;
        }
      }
    }
  }
}
</style>
