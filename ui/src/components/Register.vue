<template>
  <div id="register">
    <div class="container">
      <h3>{{$t('register.registerCom')}}</h3>
      <div class="main">
        <el-form :model="registerForm" :rules="rules" ref="registerForm" label-width="130px" class="demo-registerForm" style="padding:0px 25px;">
          <el-form-item :label="$t('register.userName')" prop="name">
            <el-input v-model="registerForm.name" style="width:90%;" :placeholder="$t('register.userNameTitle')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('register.address')" >
            <el-input v-model="registerForm.address" style="width:90%;" :placeholder="$t('register.addressTitle')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('register.linkman')" >
            <el-input v-model="registerForm.linkman" style="width:90%;" :placeholder="$t('register.linkmanTitle')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('register.number')" >
            <el-input v-model="registerForm.number" style="width:90%;" :placeholder="$t('register.numberTitle')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('register.authCode')" prop="authCode">
            <el-input v-model="registerForm.authCode" style="width:90%;" :placeholder="$t('register.authCodeTitle')"></el-input>
          </el-form-item>
          <el-form-item :label="$t('register.logo')">
            <div class="upload-box-logo" style="margin-left:130px;">
              <el-upload :action="actionUrl" accept="image/jpeg" list-type="picture-card" :data="registerForm.imgType" :headers="headerdate" :show-file-list="false" :before-upload="bgUpload" :on-success="bgSuccess" :on-error="bgError">
                <i class="el-icon-plus"></i>
              </el-upload>
              <div class="popUp" v-show="registerForm.logoBg" @mouseover="bgOver" @mouseout="bgOut">
                <img :src="registerForm.logo" alt="logo" v-if="registerForm.logo">
                <img src="../assets/img/logo.jpg" alt="" v-else>
                <div class="mask" v-show="registerForm.logoMask">
                  <i class="el-icon-delete" @click="deleteBgImg"></i>
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item style="margin-left:140px;">
            <el-button type="primary" @click="submitForm('registerForm')">{{$t('common.confirm')}}</el-button>
            <el-button @click="resetForm('registerForm')">{{$t('common.cancel')}}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <el-dialog title :visible.sync="dialogVisible" width="640px" :close-on-press-escape="false" :close-on-click-modal="false" :show-close="false">
      <el-form label-width="80px" :model="formLabelAlign">
        <p style="margin:15px 0px;padding-left:40px;font-size:14px;" >{{$t('register.registerSuccess1')}}</p>
        <p style="margin:15px 0px;padding-left:40px;font-size:14px;" >{{$t('register.registerSuccess2')}}</p>
        <p style="margin:15px 0px;padding-left:40px;font-size:14px;" >{{$t('register.registerSuccess3')}}</p>
        <el-form-item :label="$t('register.userId')">
          <el-input v-model="formLabelAlign.name" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item :label="$t('login.userName')">
          <el-input v-model="formLabelAlign.user" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item :label="$t('login.password')">
          <el-input v-model="formLabelAlign.password" :readonly="true"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="successSave">{{$t('common.confirm')}}</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import myValidate from '../api/myValidate'
export default {
  data() {
    return {
      // innerVisible: false,
      dialogVisible: false,
      formLabelAlign: {
        name: "",
        user: "",
        password: ""
      },
      headerdate: {},
      //上传文件地址
      actionUrl: NEW_URL_CONFIG + "/api/file/upload",
      registerForm: {
        name: "",
        address: "",
        linkman: "",
        number: "",
        authCode: "",
        imgType: {
          targetEnum: "Temp"
        },
        logoBg: true,
        logo: "",
        logoUrl: "",
        logoMask: false
      },
      rules: {
        name: [
          {
            required: true,
            message: this.$t("register.userNameTitle"),
            trigger: "change"
          }
        ],
        address: [
          {
            required: true,
            message: this.$t("register.addressTitle"),
            trigger: "change"
          }
        ],
        linkman: [
          {
            required: true,
            message: this.$t("register.linkmanTitle"),
            trigger: "change"
          }
        ],
        number: [
          {
            required: true,
            message: this.$t("register.numberTitle"),
            trigger: "change"
          }
        ],
        authCode: [
          {
            required: true,
            message: this.$t("register.authCodeTitle"),
            trigger: "change"
          }
        ],
        logo: [
          {
            required: true,
            message: this.$t("register.logoTitle"),
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    successSave() {
      this.$confirm(this.$t('register.accountsTips'), this.$t('common.tips'), {
        confirmButtonText: this.$t('common.yes'),
        cancelButtonText: this.$t('common.no'),
        type: 'warning'
      }).then(() => {
        this.$message({
          showClose: true,
          duration: 2000,
          type: 'success',
          message: this.$t("register.successTips")
        });
        this.dialogVisible = false;
        this.$router.push("/login");
      }).catch(() => {
      });
    },
    //适配
    autoPage() {
      let winWid = document.documentElement.clientWidth;
      let winHei = document.documentElement.clientHeight;
      let register = document.getElementById("register");
      register.style.width = winWid + "px";
      register.style.height = winHei + "px";
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if(this.registerForm.number&&!myValidate.phone(this.registerForm.number)){
            this.$message({
              showClose: true,
              duration: 2000,
              type: "warning",
              message: this.$t("register.numberTitle")
            });
            return false
          }
          let postData = {
            regkId: this.registerForm.authCode,
            clientName: this.registerForm.name,
            clientAddress: this.registerForm.address,
            clientContact: this.registerForm.linkman,
            clientPhone: this.registerForm.number,
            clientLogo: this.registerForm.logoUrl
          };
          this.$axios({
            method: "post",
            url: NEW_URL_CONFIG + "/api/client/web/register",
            headers: {
              accept: "application/json",
              "Content-Type": "application/json"
            },
            data: postData
          })
            .then(res => {
              if (res.data.statusCode == 200) {
                this.dialogVisible = true;
                (this.formLabelAlign.name = res.data.data.clientId),
                  (this.formLabelAlign.user = res.data.data.loginId),
                  (this.formLabelAlign.password = res.data.data.userPassword);
              } else if (res.data.statusCode == 201) {
                this.$message({
                  showClose: true,
                  duration: 2000,
                  type: "warning",
                  message: this.$t("register.registerError")
                });
              }
            })
            .catch(res => {});
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].clearValidate();
      this.$router.push("/login");
    },
    //图片上传前验证
    bgUpload(file) {
      var fileName = new Array();
      fileName = file.name.split(".");
      const extension1 = fileName[fileName.length - 1] === "jpg";
      // const extension2 = fileName[fileName.length - 1] === "png";
      const isLt2M = file.size / 1024 / 1024 < 10;
      if (!extension1) {
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
      return extension1 && isLt2M;
    },
    // 背景图片上传成功
    bgSuccess(res) {
      if (res.statusCode == 200) {
        this.registerForm.logoBg = true;
        this.registerForm.logo = res.data[0].fileUrl;
        this.registerForm.logoUrl = res.data[0].fileUrl;
      } else {
      }
    },
    // 背景图片上传失败
    bgError(res) {
      console.log(res);
    },

    deleteBgImg() {
      this.registerForm.logoBg = false;
      this.registerForm.logo = "";
      this.registerForm.logoUrl = "";
    },
    bgOver() {
      this.registerForm.logoMask = true;
    },
    bgOut() {
      this.registerForm.logoMask = false;
    }
  },
  created() {
    //上传文件时验证用户的状态码
    this.headerdate = {
      Authorization:
        sessionStorage.getItem("loginPrefix") +
        " " +
        sessionStorage.getItem("loginToken")
    };
  },
  mounted() {
    let _this = this;
    _this.autoPage();
    window.onresize = function() {
      _this.autoPage();
    };
  },
  destroyed() {
    window.onresize = null;
  }
};
</script>
<style lang="scss">
#register {
  background: #1183fb;
  height: 100%;
  position: relative;
  .container {
    position: absolute;
    width: 640px;
    height: 580px;
    left: 50%;
    top: 50%;
    margin-top: -305px;
    margin-left: -335px;
    background: #fff;
    border-radius: 4px;
    padding: 15px;
    > h3 {
      margin: 0px 0px 30px 0px;
      padding: 10px;
      border-bottom: 1px solid #ccc;
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
  .el-dialog__header {
    padding: 0;
    height: 0px;
    border-bottom: 0px solid #dcdfe6 !important;
    padding-bottom: 0px !important;
  }
}
</style>
