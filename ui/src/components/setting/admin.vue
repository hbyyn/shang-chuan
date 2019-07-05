<template>
  <div id="admin">
    <el-form :inline="true" :model="dateQuery" class="demo-form-inline" id="adminQuery">
      <div></div>
      <el-form-item :label="$t('admin.createTime')">
        <el-date-picker v-model="startTime" type="datetime" :placeholder="$t('common.firstTime')" align="right" :picker-options="startDatePicker"></el-date-picker>
        <el-date-picker v-model="endTime" type="datetime" :placeholder="$t('common.endTime')" align="right" default-time="23:59:59" :picker-options="endDatePicker"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">{{$t('common.query')}}</el-button>
      </el-form-item>
      <el-form-item style="float:right">
        <el-button type="primary" @click="addStaff">{{$t('common.add')}}</el-button>
      </el-form-item>
    </el-form>
    <el-table id="adminTable" :data="adminData" border style="width:100%;" size="mini">
      <el-table-column prop="loginId" :label="$t('admin.loginId')"></el-table-column>
      <el-table-column prop="loginName" :label="$t('admin.loginName')"></el-table-column>
      <el-table-column prop="loginAcode" :label="$t('admin.loginAcode')" width="180"></el-table-column>
      <el-table-column prop="createTime" :label="$t('admin.createTime')" width="180"></el-table-column>
      <el-table-column prop="operation" :label="$t('common.operation')" align="center" width="240">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.$index, scope.row)">{{$t('common.edit')}}</el-button>
          <el-button type="primary" size="mini" @click="handleRole(scope.row$index, scope.row)">{{$t('admin.rolePermissions')}}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">{{$t('common.delete')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination id="adminPage" :class="{activeBackground: active}" style="border: 1px solid #ebeef5;border-top:0px;" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[10, 25, 50, 100]" :page-size="10" :pager-count="5" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    <el-dialog :title="adminVisibleTitle" :visible.sync="adminVisible" width="680px">
      <el-form :model="adminForm" :rules="rules" ref="adminForm" label-width="120px" class="demo-adminForm">
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('admin.loginId')" prop="loginId">
              <el-input v-model="adminForm.loginId" v-if="adminForm.lookEdit" @blur="checkAdminId" :placeholder="$t('admin.loginIdTitle')"></el-input>
              <el-input v-model="adminForm.loginId" v-else :readonly="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('admin.loginName')">
              <el-input v-model="adminForm.loginName" :placeholder="$t('admin.loginNameTitle')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="this.adminForm.lookEdit">
            <el-form-item :label="$t('admin.password')">
              <el-input v-model="adminForm.password" :placeholder="$t('admin.passwordTitle')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-else>
            <el-form-item :label="$t('admin.loginAcode')">
              <el-input v-model="adminForm.loginAcode"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item style="margin-bottom:0px;">
          <el-button type="primary" @click="submitForm('adminForm')">{{$t('common.confirm')}}</el-button>
          <el-button @click="adminVisible = false">{{$t('common.cancel')}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <el-dialog :title="roleVisibleTitle" :visible.sync="roleVisible" width="540px">
      <el-transfer v-model="roled" :data="roleDate" :titles="[$t('admin.notSelected'), $t('admin.selected')]" v-loading="loading"></el-transfer>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitRole">{{$t('common.confirm')}}</el-button>
        <el-button @click="roleVisible = false">{{$t('common.cancel')}}</el-button>
      </div>
    </el-dialog>
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
      dateQuery: {},
      adminData: [],
      //当前页码
      currentPage: 1,
      //每页多少条
      pageTotal: 10,
      //数据总数
      total: 0,
      active: true,
      adminVisible: false,
      adminVisibleTitle: this.$t("common.add"),
      adminForm: {
        loginId: "",
        loginName: "",
        password: "",
        loginAcode: "",
        lookEdit: false
      },
      rules: {
        loginId: [
          {
            required: true,
            message: this.$t("admin.loginIdTitle"),
            trigger: "change"
          }
        ],
        loginName: [
          {
            required: true,
            message: this.$t("admin.loginNameTitle"),
            trigger: "change"
          }
        ],
        password: [
          {
            required: true,
            message: this.$t("admin.passwordTitle"),
            trigger: "change"
          }
        ]
      },
      roleVisibleTitle: '权限设置',
      roleVisible: false,
      loading: true,
      roleDate: [],
      roled: [],
      adminId: ''
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
    //获取全部角色
    getRoleDate(){
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG+"/api/webrole/select/base",
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
            Authorization: sessionStorage.getItem("loginPrefix")+' '+sessionStorage.getItem("loginToken")
        },
        data: {
          "pageIndex": 1,
          "pageSize": 999999,
        }
      }).then(res=>{
        if(res.data.statusCode == 200){
          this.roleDate = [];
          res.data.data.resultObjects.forEach((val)=>{
            this.roleDate.push({
              key: val.roleId,
              label: val.roleName
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
    //获取管理员设置列表
    getAdmin(pageIndex, pageSize, startCreateTime, endCreateTime) {
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG + "/api/weblogin/data",
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
          startCreateTime: startCreateTime,
          endCreateTime: endCreateTime
        }
      })
        .then(res => {
          if (res.data.statusCode == 200) {
            this.adminData = [];
            this.total = res.data.data.count;
            res.data.data.resultObjects.forEach(val => {
              this.adminData.push({
                loginId: val.loginId,
                loginName: val.loginName,
                loginAcode: val.loginAcode,
                createTime: val.createTime
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
    //检索
    onSubmit() {
      let start = '', end = '';
      if(this.startTime){
        start = this.startTime.toString().split('GMT')[0];
      }
      if(this.endTime){
        end = this.endTime.toString().split('GMT')[0];
      }
      this.getAdmin(this.currentPage, this.pageTotal, start, end);
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
      this.getAdmin(this.currentPage, this.pageTotal, start, end);
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
      this.getAdmin(this.currentPage, this.pageTotal, start, end);
    },
    //验证用户编号
    checkAdminId() {
      if (!this.adminForm.loginId) {
        return false;
      }
      this.$axios({
        method: "get",
        url: NEW_URL_CONFIG + "/api/weblogin/check/" + this.adminForm.loginId,
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            sessionStorage.getItem("loginPrefix") +
            " " +
            sessionStorage.getItem("loginToken")
        },
        params: this.adminForm.loginId
      })
        .then(res => {
          if (res.data.statusCode == 200 && res.data.data) {
            this.adminForm.loginId = "";
            this.$message({
              showClose: true,
              duration: 2000,
              type: "warning",
              message: this.$t("admin.checkAdminId")
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
    //新增职员
    addStaff() {
      this.adminVisible = true;
      this.adminVisibleTitle = this.$t("common.add");
      this.adminForm.lookEdit = true;
      this.adminForm.loginId = "";
      this.adminForm.loginName = "";
      this.adminForm.password = "";
      this.$nextTick(()=>{
        this.$refs.adminForm.clearValidate();
      });
    },
    //编辑职员
    handleEdit(index, row) {
      // console.log(row)
      this.adminVisible = true;
      this.adminVisibleTitle = this.$t("common.look");
      this.adminForm.lookEdit = false;
      this.adminForm.loginId = row.loginId;
      this.adminForm.loginName = row.loginName;
      this.adminForm.loginAcode = row.loginAcode;
    },
    // 角色设置
    handleRole(index,row){
      this.roleVisible = true;
      this.adminId = row.loginId;
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG+"/api/weblwebr/select",
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
            Authorization: sessionStorage.getItem("loginPrefix")+' '+sessionStorage.getItem("loginToken")
        },
        data: {
          "loginId": row.loginId,
          "pageIndex": 1,
          "pageSize": 999999,
        }
      }).then(res=>{
        if(res.data.statusCode == 200){
          this.roled = [];
          res.data.data.resultObjects.forEach((val)=>{
            this.roled.push(val.roleId)
          });
          this.loading = false;
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
    //删除职员
    handleDelete(index, row) {
      this.$confirm(
        this.$t("common.delTitleTips1") +
          this.$t("admin.login") +
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
            url: NEW_URL_CONFIG + "/api/weblogin/delete/" + row.loginId,
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
                if (this.adminData.length == "1" && this.currentPage != "1") {
                  this.currentPage = this.currentPage - 1;
                  let start = '', end = '';
                  if(this.startTime){
                    start = this.startTime.toString().split('GMT')[0];
                  }
                  if(this.endTime){
                    end = this.endTime.toString().split('GMT')[0];
                  }
                  this.getAdmin(this.currentPage, this.pageTotal, start, end);
                } else {
                  let start = '', end = '';
                  if(this.startTime){
                    start = this.startTime.toString().split('GMT')[0];
                  }
                  if(this.endTime){
                    end = this.endTime.toString().split('GMT')[0];
                  }
                  this.getAdmin(this.currentPage, this.pageTotal, start, end);
                }
                this.$message({
                  showClose: true,
                  duration: 2000,
                  type: "success",
                  message: this.$t("common.addSuccessTitle")
                });
                this.adminVisible = false;
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
              } else if ( res.data.statusCode == 202 ) {
                this.$message({
                  showClose: true,
                  duration: 2000,
                  type: "warning",
                  message: this.$t("admin.delErrorTitle")
                });
              }
            })
            .catch(res => {
              // console.log(res)
            });
        })
        .catch(() => {
          this.$message({
            showClose: true,
            duration: 2000,
            type: "info",
            message: this.$t("common.canceledDeletion")
          });
        });
      // console.log(row)
    },
    //新增、编辑的保存
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.adminForm.lookEdit) {
            this.$axios({
              method: "post",
              url: NEW_URL_CONFIG + "/api/weblogin/add/single",
              headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                Authorization:
                  sessionStorage.getItem("loginPrefix") +
                  " " +
                  sessionStorage.getItem("loginToken")
              },
              data: {
                userPassword: this.adminForm.password,
                loginId: this.adminForm.loginId,
                loginName: this.adminForm.loginName
              }
            })
              .then(res => {
                if (res.data.statusCode == 200) {
                  let start = '', end = '';
                  if(this.startTime){
                    start = this.startTime.toString().split('GMT')[0];
                  }
                  if(this.endTime){
                    end = this.endTime.toString().split('GMT')[0];
                  }
                  this.getAdmin(this.currentPage, this.pageTotal, start, end);
                  this.$message({
                    showClose: true,
                    duration: 2000,
                    type: "success",
                    message: this.$t("common.addSuccessTitle")
                  });
                  this.adminVisible = false;
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
            this.$axios({
              method: "put",
              url: NEW_URL_CONFIG + "/api/weblogin/edit",
              headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                Authorization:
                  sessionStorage.getItem("loginPrefix") +
                  " " +
                  sessionStorage.getItem("loginToken")
              },
              data: {
                loginId: this.adminForm.loginId,
                loginAcode: this.adminForm.loginAcode,
                loginName: this.adminForm.loginName
              }
            })
              .then(res => {
                if (res.data.statusCode == 200) {
                  this.$message({
                    showClose: true,
                    duration: 2000,
                    type: "success",
                    message: this.$t("common.editSuccessTitle")
                  });
                  let start = '', end = '';
                  if(this.startTime){
                    start = this.startTime.toString().split('GMT')[0];
                  }
                  if(this.endTime){
                    end = this.endTime.toString().split('GMT')[0];
                  }
                  this.getAdmin(this.currentPage, this.pageTotal, start, end);
                  this.adminVisible = false;
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
    //编辑角色的权限
    submitRole(){
      let roledList = []
      if(this.roled.length){
        for (let i = 0; i < this.roled.length; i++) {
          roledList.push({
            "roleId": this.roled[i]
          })
        }
      }
      this.$axios({
        method: "post",
        url: NEW_URL_CONFIG + "/api/weblwebr/edit",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            sessionStorage.getItem("loginPrefix") +
            " " +
            sessionStorage.getItem("loginToken")
        },
        data: {
          "roleModels": roledList,
          "loginId": this.adminId
        }
      })
        .then(res => {
          if (res.data.statusCode == 200) {
            this.roleVisible = false;
            this.$message({
              showClose: true,
              duration: 2000,
              type: "success",
              message: this.$t("common.editSuccessTitle")
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
          }
        })
        .catch(res => {});
    },
    pageResize() {
      this.$nextTick(() => {
        // var app = document.getElementById('app');
        var admin = document.getElementById("admin");
        var adminQuery = document.getElementById("adminQuery");
        var adminTable = document.getElementById("adminTable");
        var adminPage = document.getElementById("adminPage");
        if (document.body.scrollHeight > document.body.offsetHeight) {
          adminPage.style.width = adminTable.clientWidth - 11 + "px";
          adminPage.style.paddingLeft = "25px";
          adminPage.style.paddingRight = "25px";
          adminPage.style.marginLeft = -adminPage.offsetWidth / 2 + "px";
          adminPage.style.position = "fixed";
          this.active = true;
        } else {
          adminPage.style.paddingLeft = "5px";
          adminPage.style.position = "static";
          adminPage.style.marginLeft = "0px";
          this.active = false;
        }
      });
    }
  },
  created() {},
  mounted() {
    this.$root.Bus.$on("languageChange", () => {
      this.rules = {
        loginId: [
          {
            required: true,
            message: this.$t("admin.loginIdTitle"),
            trigger: "change"
          }
        ],
        loginName: [
          {
            required: true,
            message: this.$t("admin.loginNameTitle"),
            trigger: "change"
          }
        ],
        password: [
          {
            required: true,
            message: this.$t("admin.passwordTitle"),
            trigger: "change"
          }
        ]
      };
    });
    let _this = this;
    _this.getRoleDate();
    _this.getAdmin(1, 10);
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
#admin {
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
  .el-form-item {
    margin-bottom: 20px;
  }
  #adminPage {
    left: 50%;
    bottom: 40px;
    z-index: 2000;
    padding: 5px;
    background-color: rgba(75, 75, 75, 0);
    &.activeBackground {
      background-color: #fff;
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
}
</style>
