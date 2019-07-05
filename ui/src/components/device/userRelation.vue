<template>
  <div id="deviceu">
    <el-form :inline="true" :model="dateQuery" class="demo-form-inline" id="deviceuQuery">
      <el-form-item :label="$t('device.deviceName')" v-if="dateQuery.bool">
        <el-select v-model="dateQuery.deviceId" filterable clearable :placeholder="$t('common.select')">
          <el-option v-for="item in dateQuery.deviceList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('deviceu.deviceuName')" v-else>
        <el-select v-model="dateQuery.deviceuId" filterable clearable :placeholder="$t('common.select')">
          <el-option v-for="item in dateQuery.deviceuList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{$t('common.query')}}</el-button>
      </el-form-item>
      <el-form-item style="float:right">
        <el-switch v-model="dateQuery.bool" :active-text="$t('relation.deviceActive')" @change="changeMain" :inactive-text="$t('relation.deviceuActive')" style="margin-top:2px;margin-right:20px;"></el-switch>
        <el-button type="primary" @click="addStaff">{{$t('common.add')}}</el-button>
        <el-button type="danger" @click="delBatch">{{$t('common.deleteBatch')}}</el-button>
      </el-form-item>
    </el-form>
    <el-table id="deviceuTable" :data="relationData" border style="width:100%;" size="mini" v-if="dateQuery.bool" @selection-change="handleSelection">
      <el-table-column type="selection" width="40"></el-table-column>>
      <el-table-column prop="deviceId" :label="$t('device.deviceId')" ></el-table-column>
      <el-table-column prop="deviceName" :label="$t('device.deviceName')"></el-table-column>
      <el-table-column prop="deviceuId" :label="$t('deviceu.deviceuId')"></el-table-column>
      <el-table-column prop="deviceuName" :label="$t('deviceu.deviceuName')"></el-table-column>
      <el-table-column prop="deviceDeviceuUse" :label="$t('device.enableSwitch')" width="110" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.deviceDeviceuUse">{{$t('common.open')}}</span>
          <span v-else>{{$t('common.close')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="operation" :label="$t('common.operation')" align="center" width="180">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">{{$t('common.edit')}}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">{{$t('common.delete')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-table id="deviceuTable" :data="relationData" border style="width:100%;" size="mini" v-else @selection-change="handleSelection" >
      <el-table-column type="selection" width="40"></el-table-column>>
      <el-table-column prop="deviceuId" :label="$t('deviceu.deviceuId')"></el-table-column>
      <el-table-column prop="deviceuName" :label="$t('deviceu.deviceuName')"></el-table-column>
      <el-table-column prop="deviceId" :label="$t('device.deviceId')"></el-table-column>
      <el-table-column prop="deviceName" :label="$t('device.deviceName')"></el-table-column>
      <el-table-column prop="deviceDeviceuUse" :label="$t('device.enableSwitch')" width="110" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.deviceDeviceuUse">{{$t('common.open')}}</span>
          <span v-else>{{$t('common.close')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="operation" :label="$t('common.operation')" align="center" width="180">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">{{$t('common.edit')}}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">{{$t('common.delete')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination id="deviceuPage" :class="{activeBackground: active}" style="border: 1px solid #ebeef5;border-top:0px;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 25, 50, 100]" :page-size="10" :pager-count="5" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    <!-- 单个新增弹窗 -->
    <el-dialog :title="deviceuVisibleTitle" :visible.sync="deviceuVisible" width="540px">
      <el-form :model="deviceuForm" :rules="rules" ref="deviceuForm" label-width="160px">
        <!-- 新增设备 -->
        <div v-if="dateQuery.bool&&deviceuAddEdit">
          <el-form-item :label="$t('device.deviceName')" prop="deviceId">
            <el-select v-model="deviceuForm.deviceId" style="width:340px;" multiple @change="checkDeviceId" >
              <el-option v-for="(item,index) in dateQuery.deviceList" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <!-- <div>新增设备</div> -->
          </el-form-item>
          <el-form-item :label="$t('deviceu.deviceuName')" prop="deviceuId">
            <el-select v-model="deviceuForm.deviceuId" style="width:340px;" multiple>
              <el-option v-for="(item,index) in deviceuForm.deviceuList" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('device.enableSwitch')">
            <el-switch v-model="deviceuForm.enableSwitch"></el-switch>
          </el-form-item>
        </div>
        <!-- 新增用户 -->
        <div v-else-if="!dateQuery.bool&&deviceuAddEdit">
          <el-form-item :label="$t('deviceu.deviceuName')" prop="deviceuId">
            <el-select v-model="deviceuForm.deviceuId" style="width:340px;" multiple @change="checkDeviceId">
              <el-option v-for="(item,index) in dateQuery.deviceuList" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <!-- <div>新增用户</div> -->
          </el-form-item>
          <el-form-item :label="$t('device.deviceName')" prop="deviceId">
            <el-select v-model="deviceuForm.deviceId" style="width:340px;" multiple>
              <el-option v-for="(item,index) in deviceuForm.deviceList" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('device.enableSwitch')">
            <el-switch v-model="deviceuForm.enableSwitch"></el-switch>
          </el-form-item>
        </div>
        <!-- 编辑设备 -->
        <div v-else-if="dateQuery.bool&&!deviceuAddEdit">
          <el-form-item :label="$t('device.deviceName')" prop="deviceId">
            <el-select v-model="deviceuForm.deviceId" style="width:340px;" multiple>
              <el-option v-for="(item,index) in deviceuForm.deviceList" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <!-- <div>编辑设备</div> -->
          </el-form-item>
          <el-form-item :label="$t('deviceu.deviceuName')" prop="deviceuId">
            <el-select v-model="deviceuForm.deviceuId" style="width:340px;" multiple>
              <el-option v-for="(item,index) in deviceuForm.deviceuList" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('device.enableSwitch')">
            <el-switch v-model="deviceuForm.enableSwitch"></el-switch>
          </el-form-item>
        </div>
        <!-- 编辑用户 -->
        <div v-else-if="!dateQuery.bool&&!deviceuAddEdit">
          <el-form-item :label="$t('deviceu.deviceuName')" prop="deviceuId">
            <el-select v-model="deviceuForm.deviceuId" style="width:340px;" multiple>
              <el-option v-for="(item,index) in deviceuForm.deviceuList" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <!-- <div>编辑用户</div> -->
          </el-form-item>
          <el-form-item :label="$t('device.deviceName')" prop="deviceId">
            <el-select v-model="deviceuForm.deviceId" style="width:340px;" multiple>
              <el-option v-for="(item,index) in deviceuForm.deviceList" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('device.enableSwitch')">
            <el-switch v-model="deviceuForm.enableSwitch"></el-switch>
          </el-form-item>
        </div>
        <el-form-item style="margin-bottom:0px;">
          <el-button type="primary" @click="submitForm('deviceuForm')">{{$t('common.confirm')}}</el-button>
          <el-button @click="deviceuVisible=false">{{$t('common.cancel')}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dateQuery: {
        bool: false,
        deviceId: "",
        deviceList: [],
        deviceuId: "",
        deviceuList: []
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
      deviceuVisible: false,
      deviceuAddEdit: false, //true表新增，false表示编辑
      deviceuVisibleTitle: this.$t("common.add"),
      deviceuForm: {
        deviceId: [],
        deviceList: [],
        // deviceIdEdit: '',
        deviceuId: [],
        deviceuList: [],
        // deviceuIdEdit: '',
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
        deviceuId: [
          {
            required: true,
            message: this.$t("deviceu.deviceuIdTitle"),
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
              this.deviceuForm.deviceList.push({
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
    getDeviceUserList() {
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
          // console.log(res)
          if (res.data.statusCode == 200) {
            this.dateQuery.deviceuList = [];
            res.data.data.resultObjects.forEach(val => {
              this.dateQuery.deviceuList.push({
                value: val.deviceuId,
                label: val.deviceuId + " " + val.deviceuName
              });
              this.deviceuForm.deviceuList.push({
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
    //检索列表数据
    changeMain() {
      this.relationData = [];
      this.dateQuery.deviceId = "";
      this.dateQuery.deviceuId = "";
      this.getRelationList(
        this.currentPage,
        this.pageTotal,
        this.dateQuery.deviceId,
        this.dateQuery.deviceuId
      );
    },
    //获取列表数据
    getRelationList(pageIndex, pageSize, deviceId, deviceuId) {
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG + "/api/devicedeviceuser/select",
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
          deviceuId: deviceuId,
          isDeviceView: this.dateQuery.bool
        }
      })
        .then(res => {
          // console.log(res)
          if (res.data.statusCode == 200) {
            this.relationData = [];
            this.total = res.data.data.count;
            //设备用户为主
            res.data.data.resultObjects.forEach(val => {
              this.relationData.push({
                deviceId: val.deviceId,
                deviceName: val.deviceName,
                deviceuId: val.deviceuId,
                deviceuName: val.deviceuName,
                deviceDeviceuUse: val.deviceDeviceuUse
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
        this.getRelationList(1, this.pageTotal, "", this.dateQuery.deviceuId);
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
          this.dateQuery.deviceuId
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
          this.dateQuery.deviceuId
        );
      }
    },
    //新增验证设备
    checkDeviceId() {
      let postData = {
        isDeviceView: this.dateQuery.bool,
        objectIds: []
      };
      if (this.deviceuAddEdit) {
        if (this.dateQuery.bool) {
          // 新增设备
          this.deviceuForm.deviceuList = [];
          this.deviceuForm.deviceuId = [];
          if (this.deviceuForm.deviceId.length) {
            postData.objectIds = this.deviceuForm.deviceId;
          } else {
            return false;
          }
        } else {
          // 新增用户
          this.deviceuForm.deviceList = [];
          this.deviceuForm.deviceId = [];
          if (this.deviceuForm.deviceuId.length) {
            postData.objectIds = this.deviceuForm.deviceuId;
          } else {
            return false;
          }
        }
      } else {
        if (this.dateQuery.bool) {
          //编辑设备
          this.deviceuForm.deviceuList = [];
          this.deviceuForm.deviceuId = [];
          if (this.deviceuForm.deviceId.length) {
            postData.objectIds = this.deviceuForm.deviceId;
          } else {
            return false;
          }
        } else {
          // 编辑用户
          this.deviceuForm.deviceList = [];
          this.deviceuForm.deviceId = [];
          if (this.deviceuForm.deviceuId.length) {
            postData.objectIds = this.deviceuForm.deviceuId;
          } else {
            return false;
          }
        }
      }
      // console.log(postData)
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG + "/api/devicedeviceuser/select/id",
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
                this.deviceuForm.deviceuList.push({
                  value: val.associatedId,
                  label: val.associatedName + " " + val.associatedId
                });
              });
            } else {
              res.data.data.forEach(val => {
                this.deviceuForm.deviceList.push({
                  value: val.associatedId,
                  label: val.associatedName + " " + val.associatedId
                });
              });
            }
            // console.log(this.deviceuForm.deviceList)
            // console.log(this.deviceuForm.deviceuList)
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
    checkUserId() {
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
          this.selection.push({
            deviceuId: val[i].deviceuId,
            deviceId: val[i].deviceId
          });
        }
      }
    },
    //新增职员
    addStaff() {
      this.deviceuVisible = true;
      this.deviceuAddEdit = true;
      this.deviceuVisibleTitle = this.$t("common.add");
      this.deviceuForm.deviceId = [];
      this.deviceuForm.deviceuId = [];
      this.deviceuForm.enableSwitch = false;
      if (this.dateQuery.bool) {
        this.deviceuForm.deviceuList = [];
      } else {
        this.deviceuForm.deviceList = [];
      }
      this.$nextTick(()=>{
        this.$refs.deviceuForm.clearValidate();
      });
    },
    //编辑职员
    handleEdit(index, row) {
      // console.log(row)
      this.deviceuVisible = true;
      this.deviceuAddEdit = false;
      this.deviceuVisibleTitle = this.$t("common.edit");
      this.deviceuForm.enableSwitch = row.deviceDeviceuUse;
      let postData = {
        isDeviceView: this.dateQuery.bool,
        objectIds: []
      };
      if (this.dateQuery.bool) {
        this.deviceuForm.deviceId = [row.deviceId];
        this.deviceuForm.deviceList = [].concat([
          {
            value: row.deviceId,
            label: row.deviceName
          }
        ]);
        this.deviceuForm.deviceuId = [row.deviceuId];
        this.deviceuForm.associatedId = row.deviceId;
        postData.objectIds = this.deviceuForm.deviceId;
        // console.log(this.deviceuForm.deviceList)
      } else {
        this.deviceuForm.deviceuId = [row.deviceuId];
        this.deviceuForm.deviceuList = [].concat([
          {
            value: row.deviceuId,
            label: row.deviceuName
          }
        ]);
        postData.objectIds = this.deviceuForm.deviceuId;
        this.deviceuForm.associatedId = row.deviceId;
        this.deviceuForm.deviceId = [row.deviceId];
      }
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG + "/api/devicedeviceuser/select/id",
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
              this.deviceuForm.deviceuList = [
                {
                  value: row.deviceuId,
                  label: row.deviceuName
                }
              ];
              res.data.data.forEach(val => {
                this.deviceuForm.deviceuList.push({
                  value: val.associatedId,
                  label: val.associatedName
                });
              });
            } else {
              this.deviceuForm.deviceList = [
                {
                  value: row.deviceId,
                  label: row.deviceName
                }
              ];
              res.data.data.forEach(val => {
                this.deviceuForm.deviceList.push({
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
      // this.deviceuForm.deviceuIdEdit = row.deviceuId;
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
            url: NEW_URL_CONFIG + "/api/devicedeviceuser/delete/single",
            headers: {
              accept: "application/json",
              "Content-Type": "application/json",
              Authorization:
                sessionStorage.getItem("loginPrefix") +
                " " +
                sessionStorage.getItem("loginToken")
            },
            data: {
              deviceuId: row.deviceuId,
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
                      this.dateQuery.deviceuId
                    );
                  } else {
                    this.getRelationList(
                      this.currentPage,
                      this.pageTotal,
                      "",
                      this.dateQuery.deviceuId
                    );
                  }
                  // this.getRelationList(this.currentPage,this.pageTotal,'',this.dateQuery.deviceuId);
                  this.getDeviceUserList();
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
    //单个设备用户保存
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.deviceuAddEdit) {
            let postData = [];
            for (let i = 0; i < this.deviceuForm.deviceuId.length; i++) {
              for (let j = 0; j < this.deviceuForm.deviceId.length; j++) {
                postData.push({
                  deviceDeviceuUse: this.deviceuForm.enableSwitch,
                  deviceuId: this.deviceuForm.deviceuId[i],
                  deviceId: this.deviceuForm.deviceId[j]
                });
              }
            }
            //新增的保存
            this.$axios({
              method: "post",
              url: NEW_URL_CONFIG + "/api/devicedeviceuser/add",
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
                      this.dateQuery.deviceuId
                    );
                    this.getDeviceUserList();
                  }
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
            let postData = {
              isDeviceView: this.dateQuery.bool,
              objectId: "",
              associatedId: "",
              associatedData: [
                // {
                //   "associatedId": "string",
                //   "isUse": true
                // }
              ]
            };
            if (this.dateQuery.bool) {
              postData.objectId = this.deviceuForm.deviceId[0];
              postData.associatedId = this.deviceuForm.associatedId;
              for (let i = 0; i < this.deviceuForm.deviceuId.length; i++) {
                const ele = this.deviceuForm.deviceuId[i];
                postData.associatedData.push({
                  associatedId: ele,
                  isUse: this.deviceuForm.enableSwitch
                });
              }
            } else {
              postData.objectId = this.deviceuForm.deviceuId[0];
              postData.associatedId = this.deviceuForm.associatedId;
              for (let i = 0; i < this.deviceuForm.deviceId.length; i++) {
                const ele = this.deviceuForm.deviceId[i];
                postData.associatedData.push({
                  associatedId: ele,
                  isUse: this.deviceuForm.enableSwitch
                });
              }
            }
            this.$axios({
              method: "put",
              url: NEW_URL_CONFIG + "/api/devicedeviceuser/edit",
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
                      this.dateQuery.deviceuId
                    );
                    this.getDeviceUserList();
                  }
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
              url: NEW_URL_CONFIG + "",
              headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                Authorization:
                  sessionStorage.getItem("loginPrefix") +
                  " " +
                  sessionStorage.getItem("loginToken")
              },
              data: {
                deviceUserIds: this.selection
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
                        this.dateQuery.deviceuId
                      );
                    } else {
                      this.getRelationList(
                        this.currentPage,
                        this.pageTotal,
                        "",
                        this.dateQuery.deviceuId
                      );
                    }
                    this.getDeviceUserList();
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
          message: this.$t("relation.delUserTitle")
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
        deviceId: [
          {
            required: true,
            message: this.$t("device.deviceIdTitle"),
            trigger: "change"
          }
        ],
        deviceuId: [
          {
            required: true,
            message: this.$t("deviceu.deviceuIdTitle"),
            trigger: "change"
          }
        ],
        enableSwitch: [{ required: true, message: "", trigger: "change" }]
      };
    });
    let _this = this;
    _this.pageResize();
    _this.getDeviceList();
    _this.getDeviceUserList();
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
        _this.dateQuery.deviceuId
      );
    }
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
  }
}
</style>
