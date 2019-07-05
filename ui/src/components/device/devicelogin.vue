<template>
  <div id="devicel">
    <el-form :inline="true" :model="dateQuery" class="demo-form-inline" id="devicelQuery">
      <el-form-item :label="$t('devicel.devicelName')">
        <el-select v-model="dateQuery.devicelName" filterable clearable :placeholder="$t('common.select')">
          <el-option v-for="item in dateQuery.devicelList" :key="item.value" :label="item.label" :value="item.value"></el-option>
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
    <el-table id="devicelTable" :data="devicelData" border style="width:100%;" size="mini" @selection-change="handleSelection" >
      <el-table-column type="selection" width="50"></el-table-column>>
      <el-table-column prop="devicelId" :label="$t('devicel.devicelId')"></el-table-column>
      <el-table-column prop="devicelName" :label="$t('devicel.devicelName')"></el-table-column>
      <!-- <el-table-column prop="devicelPassword" :label="$t('devicel.devicelPassword')"></el-table-column> -->
      <el-table-column prop="creator" :label="$t('common.creator')"></el-table-column>
      <el-table-column prop="creationTime" :label="$t('common.creationTime')"></el-table-column>
      <el-table-column prop="devicelCode" :label="$t('devicel.devicelCode')"></el-table-column>
      <el-table-column prop="operation" :label="$t('common.operation')" align="center" width="160">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">{{$t('common.edit')}}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">{{$t('common.delete')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination id="devicelPage" :class="{activeBackground: active}" style="border: 1px solid #ebeef5;border-top:0px;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 25, 50, 100]" :page-size="10" :pager-count="5" layout="total, sizes, prev, pager, next, jumper" :total="total" ></el-pagination>
    <!-- 单个新增弹窗 -->
    <el-dialog :title="devicelVisibleTitle" :visible.sync="devicelVisible" width="540px">
      <el-form :model="devicelForm" :rules="rules" ref="devicelForm" label-width="170px" class="demo-devicelForm">
        <el-form-item :label="$t('devicel.devicelId')" prop="devicelId">
          <el-input v-model="devicelForm.devicelId" v-if="devicelAddEdit" @blur="checkUserId" :placeholder="$t('devicel.devicelIdTitle')"></el-input>
          <el-input v-model="devicelForm.devicelId" v-else :readonly="!devicelAddEdit"></el-input>
        </el-form-item>
        <el-form-item :label="$t('devicel.devicelName')">
          <el-input v-model="devicelForm.devicelName" :placeholder="$t('devicel.devicelNameTitle')"></el-input>
        </el-form-item>
        <el-form-item :label="$t('devicel.devicelPassword')">
          <el-input v-if="passwordBool" v-model="devicelForm.devicelPassword" type="password" :placeholder="$t('devicel.devicelPasswordTitle')">
            <i slot="suffix" v-if="devicelForm.devicelPassword" style="margin-right:8px;" class="iconfont well-4g-icon-guanbi-yanjing" @click="close"></i>
          </el-input>
          <el-input v-else v-model="devicelForm.devicelPassword" :placeholder="$t('devicel.devicelPasswordTitle')">
            <i slot="suffix" v-if="devicelForm.devicelPassword" style="margin-right:8px;" class="iconfont well-4g-icon-yanjing" @click="open"></i>
          </el-input>
        </el-form-item>
        <el-form-item :label="$t('devicel.devicelCode')">
          <el-input v-model="devicelForm.devicelCode" :placeholder="$t('devicel.devicelCodeTitle')"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom:0px;">
          <el-button type="primary" @click="submitForm('devicelForm')">{{$t('common.confirm')}}</el-button>
          <el-button @click="devicelVisible=false">{{$t('common.cancel')}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 批量新增弹窗 -->
    <el-dialog :title="$t('common.addBatch')" :visible.sync="batchVisible" width="1024px" id="batch">
      <el-form>
        <el-row :gutter="10">
          <el-col :span="8" align="center" style="font-size:14px;font-weight:bold;">
            {{$t('devicel.devicelId')}}
            <span class="asterisk">*</span>
          </el-col>
          <el-col :span="8" align="center" style="font-size:14px;font-weight:bold;">{{$t('devicel.devicelName')}}</el-col>
          <el-col :span="8" align="center" style="font-size:14px;font-weight:bold;">{{$t('devicel.devicelPassword')}}</el-col>
        </el-row>
        <el-row :gutter="10" v-for="(item,index ) in batchForm" :key="item.id" style="margin-bottom:10px;" >
          <el-col :span="8">
            <el-input v-model="item.devicelId" @blur="checkDatchDeviceId(item.devicelId,index)" ></el-input>
          </el-col>
          <el-col :span="8">
            <el-input v-model="item.devicelName" :placeholder="index==0?$t('devicel.devicelNameTitle'):$t('common.ditto')" ></el-input>
          </el-col>
          <el-col :span="8">
            <el-input v-if="item.passwordBool" v-model="item.devicelPassword" type="password" :placeholder="index==0?$t('devicel.devicelPasswordTitle'):$t('common.ditto')" >
              <i slot="suffix" v-if="item.devicelPassword" class="iconfont well-4g-icon-guanbi-yanjing" @click="closeList(index)" style="margin-top:9px;margin-right:8px;display:block;"></i>
            </el-input>
            <el-input v-else v-model="item.devicelPassword" :placeholder="index==0?$t('devicel.devicelPasswordTitle'):$t('common.ditto')" >
              <i slot="suffix" v-if="item.devicelPassword" class="iconfont well-4g-icon-yanjing" @click="openList(index)" style="margin-top:9px;margin-right:8px;display:block;"></i>
            </el-input>
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
      passwordBool: true,
      dateQuery: {
        devicelList: [],
        devicelName: ""
      },
      devicelData: [],
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
        devicelId: "",
        devicelName: "",
        devicelPassword: "",
        devicelCode: ""
      },
      rules: {
        devicelId: [
          {
            required: true,
            message: this.$t("devicel.devicelIdTitle"),
            trigger: "change"
          }
        ],
        devicelName: [
          {
            required: true,
            message: this.$t("devicel.devicelNameTitle"),
            trigger: "change"
          }
        ],
        devicelPassword: [
          {
            required: true,
            message: this.$t("devicel.devicelPasswordTitle"),
            trigger: "change"
          }
        ],
        devicelCode: [
          {
            required: true,
            message: this.$t("devicel.devicelCodeTitle"),
            trigger: "change"
          }
        ]
      },
      batchVisible: false,
      batchForm: [
        {
          devicelId: "",
          devicelName: "",
          devicelPassword: "",
          passwordBool: true
        },
        {
          devicelId: "",
          devicelName: "",
          devicelPassword: "",
          passwordBool: true
        },
        {
          devicelId: "",
          devicelName: "",
          devicelPassword: "",
          passwordBool: true
        },
        {
          devicelId: "",
          devicelName: "",
          devicelPassword: "",
          passwordBool: true
        },
        {
          devicelId: "",
          devicelName: "",
          devicelPassword: "",
          passwordBool: true
        },
        {
          devicelId: "",
          devicelName: "",
          devicelPassword: "",
          passwordBool: true
        },
        {
          devicelId: "",
          devicelName: "",
          devicelPassword: "",
          passwordBool: true
        },
        {
          devicelId: "",
          devicelName: "",
          devicelPassword: "",
          passwordBool: true
        },
        {
          devicelId: "",
          devicelName: "",
          devicelPassword: "",
          passwordBool: true
        },
        {
          devicelId: "",
          devicelName: "",
          devicelPassword: "",
          passwordBool: true
        }
      ]
    };
  },
  created() {},
  methods: {
    close(){
      this.passwordBool = false;
    },
    open(){
      this.passwordBool = true;
    },
    closeList(val){
      this.batchForm[val].passwordBool = false;
    },
    openList(val){
      this.batchForm[val].passwordBool = true;
    },
    //获取设备登录下拉列表数据
    getDevicelList() {
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
            // this.total = res.data.data.count
            this.dateQuery.devicelList = [];
            res.data.data.resultObjects.forEach(val => {
              this.dateQuery.devicelList.push({
                value: val.devicelId,
                label: val.devicelId + " " + val.devicelName
              });
            });
            this.pageResize();
          } else if (res.data.statusCode == 407 || res.data.statusCode == 402) {
            this.$router.push({ path: "/login" });
            this.$message({
              type: "warning",
              message: this.$t("common.logoutTitle"),
              showClose: true,
              duration: 2000
            });
          }
        })
        .catch(res => {
          // console.log(res)
        });
    },
    //获取列表数据
    getDeviceUser(pageIndex, pageSize, devicelId) {
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG + "/api/devicelogin/select",
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
          devicelId: devicelId
        }
      })
        .then(res => {
          // console.log(res)
          if (res.data.statusCode == 200) {
            this.total = res.data.data.count;
            this.devicelData = [];
            res.data.data.resultObjects.forEach(val => {
              this.devicelData.push({
                devicelId: val.devicelId,
                devicelName: val.devicelName,
                devicelPassword: val.devicelPassword,
                devicelCode: val.devicelAcode,
                creator: val.devicelCreator,
                creationTime: val.devicelCreatetime
              });
            });
            this.pageResize();
          } else if (res.data.statusCode == 407 || res.data.statusCode == 402) {
            this.$router.push({ path: "/login" });
            this.$message({
              type: "warning",
              message: this.$t("common.logoutTitle"),
              showClose: true,
              duration: 2000
            });
          }
        })
        .catch(res => {
          // console.log(res)
        });
    },
    //条件查询设备用户
    onSubmit() {
      this.getDeviceUser(1, this.pageTotal, this.dateQuery.devicelName);
    },
    //表格选择事件
    handleSelection(val) {
      this.selection = [];
      if (val.length) {
        for (let i = 0; i < val.length; i++) {
          this.selection.push(val[i].devicelId);
        }
      }
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
      if(this.devicelForm.devicelId){
        this.devicelForm.devicelId = this.devicelForm.devicelId.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
      }
      if (!this.devicelForm.devicelId) {
        return false;
      }
      this.$axios({
        method: "get",
        url:
          NEW_URL_CONFIG +
          "/api/devicelogin/check/" +
          this.devicelForm.devicelId,
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            sessionStorage.getItem("loginPrefix") +
            " " +
            sessionStorage.getItem("loginToken")
        },
        params: this.devicelForm.devicelId
      })
        .then(res => {
          if (res.data.statusCode == 200 && res.data.data) {
            this.devicelForm.devicelId = "";
            this.$message({
              type: "warning",
              message: this.$t("devicel.checkUserId"),
              showClose: true,
              duration: 2000
            });
          } else if (res.data.statusCode == 407 || res.data.statusCode == 402) {
            this.$router.push({ path: "/login" });
            this.$message({
              type: "warning",
              message: this.$t("common.logoutTitle"),
              showClose: true,
              duration: 2000
            });
          }
        })
        .catch(res => {});
    },
    //新增职员
    addStaff() {
      this.devicelVisible = true;
      this.devicelAddEdit = true;
      this.passwordBool = true;
      this.devicelVisibleTitle = this.$t("common.add");
      this.devicelForm.devicelId = "";
      this.devicelForm.devicelName = "";
      this.devicelForm.devicelPassword = "";
      this.devicelForm.devicelCode = "";
      this.$nextTick(()=>{
        this.$refs.devicelForm.clearValidate();
      });
    },
    //编辑职员
    handleEdit(index, row) {
      // console.log(row)
      this.devicelVisible = true;
      this.devicelAddEdit = false;
      this.passwordBool = true;
      this.devicelVisibleTitle = this.$t("common.edit");
      this.devicelForm.devicelId = row.devicelId;
      this.devicelForm.devicelName = row.devicelName;
      this.devicelForm.devicelPassword = row.devicelPassword;
      this.devicelForm.devicelCode = row.devicelCode;
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
            url: NEW_URL_CONFIG + "/api/devicelogin/delete/" + row.devicelId,
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
                if (this.devicelData.length == "1" && this.currentPage != "1") {
                  this.currentPage = this.currentPage - 1;
                  this.getDeviceUser(
                    this.currentPage,
                    this.pageTotal,
                    this.dateQuery.devicelName
                  );
                } else {
                  this.getDeviceUser(
                    this.currentPage,
                    this.pageTotal,
                    this.dateQuery.devicelName
                  );
                }
                this.getDevicelList();
                this.$message({
                  type: "success",
                  message: this.$t("common.delSuccessTitle"),
                  showClose: true,
                  duration: 2000
                });
              } else if (
                res.data.statusCode == 407 ||
                res.data.statusCode == 402
              ) {
                this.$router.push({ path: "/login" });
                this.$message({
                  type: "warning",
                  message: this.$t("common.logoutTitle"),
                  showClose: true,
                  duration: 2000
                });
              } else if (res.data.statusCode == 202) {
                this.$message({
                  type: "success",
                  message: this.$t("devicel.delErrorTitle"),
                  showClose: true,
                  duration: 2000
                });
              }
            })
            .catch(res => {});
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: this.$t("common.canceledDeletion"),
            showClose: true,
            duration: 2000
          });
        });
    },
    //单个设备用户保存
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let devicelName = '';
          let devicelPassword = '';
          let devicelAcode = '';
          if(this.devicelForm.devicelName){
            devicelName = this.devicelForm.devicelName.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '')
          }
          if(this.devicelForm.devicelPassword){
            devicelPassword = this.devicelForm.devicelPassword.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '')
          }
          if(this.devicelForm.devicelAcode){
            devicelAcode = this.devicelForm.devicelAcode.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '')
          }
          let postData = {
            'devicelId': this.devicelForm.devicelId,
            'devicelName': devicelName,
            'devicelPassword': devicelPassword,
            'devicelAcode': devicelAcode
          };
          if (this.devicelAddEdit) {
            //新增的保存
            this.$axios({
              method: "post",
              url: NEW_URL_CONFIG + "/api/devicelogin/add/single",
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
                  this.getDevicelList();
                  this.$message({
                    type: "success",
                    message: this.$t("common.addSuccessTitle"),
                    showClose: true,
                    duration: 2000
                  });
                  this.devicelVisible = false;
                } else if (
                  res.data.statusCode == 407 ||
                  res.data.statusCode == 402
                ) {
                  this.$router.push({ path: "/login" });
                  this.$message({
                    type: "warning",
                    message: this.$t("common.logoutTitle"),
                    showClose: true,
                    duration: 2000
                  });
                }
              })
              .catch(res => {});
          } else {
            //编辑的保存
            this.$axios({
              method: "put",
              url: NEW_URL_CONFIG + "/api/devicelogin/edit",
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
                  this.getDevicelList();
                  this.$message({
                    type: "success",
                    message: this.$t("common.editSuccessTitle"),
                    showClose: true,
                    duration: 2000
                  });
                  this.devicelVisible = false;
                } else if (
                  res.data.statusCode == 407 ||
                  res.data.statusCode == 402
                ) {
                  this.$router.push({ path: "/login" });
                  this.$message({
                    type: "warning",
                    message: this.$t("common.logoutTitle"),
                    showClose: true,
                    duration: 2000
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
          devicelId: "",
          devicelName: "",
          devicelPassword: "",
          passwordBool: true
        },
        {
          devicelId: "",
          devicelName: "",
          devicelPassword: "",
          passwordBool: true
        },
        {
          devicelId: "",
          devicelName: "",
          devicelPassword: "",
          passwordBool: true
        },
        {
          devicelId: "",
          devicelName: "",
          devicelPassword: "",
          passwordBool: true
        },
        {
          devicelId: "",
          devicelName: "",
          devicelPassword: "",
          passwordBool: true
        },
        {
          devicelId: "",
          devicelName: "",
          devicelPassword: "",
          passwordBool: true
        },
        {
          devicelId: "",
          devicelName: "",
          devicelPassword: "",
          passwordBool: true
        },
        {
          devicelId: "",
          devicelName: "",
          devicelPassword: "",
          passwordBool: true
        },
        {
          devicelId: "",
          devicelName: "",
          devicelPassword: "",
          passwordBool: true
        },
        {
          devicelId: "",
          devicelName: "",
          devicelPassword: "",
          passwordBool: true
        }
      ];
    },
    // 验证多个新增职员编号是否已存在
    checkDatchDeviceId(val, index) {
      if(this.batchForm[index].devicelId){
        this.batchForm[index].devicelId = this.batchForm[index].devicelId.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
      }
      if (!this.batchForm[index].devicelId) {
        return false;
      }
      let postData = [];
      let he = 0;
      for (let i = 0; i < this.batchForm.length; i++) {
        const ele = this.batchForm[i];
        if (ele.devicelId) {
          postData.push({
            devicelId: ele.devicelId
          });
        }
      }
      postData.sort();
      for (var i = 0; i < postData.length; i++) {
        if (postData[i].devicelId == this.batchForm[index].devicelId) {
          he++;
        }
      }
      if (he > 1) {
        this.batchForm[index].devicelId = "";
        this.$message({
          type: "warning",
          message: this.$t("devicel.checkUserId"),
          showClose: true,
          duration: 2000
        });
        return false
      }
      this.$axios({
        method: "get",
        url: NEW_URL_CONFIG + "/api/devicelogin/check/" + this.batchForm[index].devicelId,
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            sessionStorage.getItem("loginPrefix") +
            " " +
            sessionStorage.getItem("loginToken")
        },
        params: this.batchForm[index].devicelId
      })
        .then(res => {
          if (res.data.statusCode == 200 && res.data.data) {
            this.batchForm[index].devicelId = "";
            this.$message({
              type: "warning",
              message: this.$t("devicel.checkUserId"),
              showClose: true,
              duration: 2000
            });
          } else if (res.data.statusCode == 407 || res.data.statusCode == 402) {
            this.$router.push({ path: "/login" });
            this.$message({
              type: "warning",
              message: this.$t("common.logoutTitle"),
              showClose: true,
              duration: 2000
            });
          }
        })
        .catch(res => {});
    },
    //保存批量修改
    submitBatch() {
      let postData = [];
      let eleDevicelName = "";
      let eleDevicelPassword = "";
      for (let i = 0; i < this.batchForm.length; i++) {
        const ele = this.batchForm[i];
        if (i == "0") {
          if (ele.devicelId) {
            postData.push(ele);
            if (ele.devicelName) {
              eleDevicelName = ele.devicelName;
            }
            if (ele.devicelPassword) {
              eleDevicelPassword = ele.devicelPassword;
            }
          } else {
            this.$message({
              type: "warning",
              message:
                this.$t("common.batchLineTitle1") +
                (i + 1) +
                this.$t("common.batchLineTitle2") +
                this.$t("devicel.devicelId") +
                // this.$t('common.batchLineTitle3')+
                // this.$t('devicel.devicelName')+
                // this.$t('common.batchLineTitle3')+
                // this.$t('devicel.devicelPassword')+
                this.$t("common.batchLineTitle4"),
              showClose: true,
              duration: 2000
            });
            return false;
          }
        } else {
          if (
            (ele.devicelName && !ele.devicelId) ||
            (ele.devicelPassword && !ele.devicelId)
          ) {
            this.$message({
              type: "warning",
              message:
                this.$t("common.batchLineTitle1") +
                (i + 1) +
                this.$t("common.batchLineTitle2") +
                this.$t("devicel.devicelId") +
                this.$t("common.batchLineTitle4"),
              showClose: true,
              duration: 2000
            });
            return false;
          } else if (!ele.devicelId) {
          } else {
            if (ele.devicelName) {
              eleDevicelName = ele.devicelName;
            }
            if (ele.devicelPassword) {
              eleDevicelPassword = ele.devicelPassword;
            }
            ele.devicelName = eleDevicelName;
            ele.devicelPassword = eleDevicelPassword;
            postData.push(ele);
          }
        }
      }

      for (let i = 0; i < postData.length; i++) {
        if(postData[i].devicelName){
          postData[i].devicelName = postData[i].devicelName.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
        }
        if(postData[i].devicelPassword){
          postData[i].devicelPassword = postData[i].devicelPassword.replace(/^(\s|\xA0)+|(\s|\xA0)+$/g, '');
        }
      }
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG + "/api/devicelogin/add",
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
              type: "success",
              message: this.$t("common.addSuccessTitle"),
              showClose: true,
              duration: 2000
            });
            this.batchVisible = false;
            this.getDeviceUser(this.currentPage, this.pageTotal);
            this.getDevicelList();
          } else if (res.data.statusCode == 407 || res.data.statusCode == 402) {
            this.$router.push({ path: "/login" });
            this.$message({
              type: "warning",
              message: this.$t("common.logoutTitle"),
              showClose: true,
              duration: 2000
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
              url: NEW_URL_CONFIG + "/api/devicelogin/delete",
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
                  // this.getDeviceUser(this.currentPage,this.pageTotal);
                  if (
                    this.selection.length == this.devicelData.length &&
                    this.currentPage == "1"
                  ) {
                    this.getDeviceUser(
                      this.currentPage,
                      this.pageTotal,
                      this.dateQuery.devicelName
                    );
                  } else {
                    this.currentPage = this.currentPage - 1;
                    this.getDeviceUser(
                      this.currentPage,
                      this.pageTotal,
                      this.dateQuery.devicelName
                    );
                  }
                  this.getDevicelList();
                  this.$message({
                    type: "success",
                    message: this.$t("common.delSuccessTitle"),
                    showClose: true,
                    duration: 2000
                  });
                } else if (
                  res.data.statusCode == 407 ||
                  res.data.statusCode == 402
                ) {
                  this.$router.push({ path: "/login" });
                  this.$message({
                    type: "warning",
                    message: this.$t("common.logoutTitle"),
                    showClose: true,
                    duration: 2000
                  });
                } else if (res.data.statusCode == 202) {
                  this.$message({
                    type: "success",
                    message: this.$t("devicel.delErrorTitle"),
                    showClose: true,
                    duration: 2000
                  });
                }
              })
              .catch(res => {});
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: this.$t("common.canceledDeletion"),
              showClose: true,
              duration: 2000
            });
          });
      } else {
        this.$message({
          type: "warning",
          message: this.$t("devicel.delNullTitle"),
          showClose: true,
          duration: 2000
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
        devicelId: [
          {
            required: true,
            message: this.$t("devicel.devicelIdTitle"),
            trigger: "change"
          }
        ],
        devicelName: [
          {
            required: true,
            message: this.$t("devicel.devicelNameTitle"),
            trigger: "change"
          }
        ],
        devicelPassword: [
          {
            required: true,
            message: this.$t("devicel.devicelPasswordTitle"),
            trigger: "change"
          }
        ],
        devicelCode: [
          {
            required: true,
            message: this.$t("devicel.devicelCodeTitle"),
            trigger: "change"
          }
        ]
      };
    });
    let _this = this;
    _this.pageResize();
    _this.getDeviceUser(1, 10);
    _this.getDevicelList();
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
    .asterisk {
      color: #f00;
      font-size: 15px;
      text-align: center;
      display: inline-block;
      width: 12px;
      line-height: 21px;
    }
  }
}
</style>
