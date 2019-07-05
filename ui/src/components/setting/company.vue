<template>
  <div id="company">
    <div class="container">
      <h3>{{$t('register.company')}}</h3>
      <div class="main">
        <el-form :model="registerForm" :rules="rules" ref="registerForm" label-width="140px" class="demo-registerForm" style="padding:0px 25px;">
          <el-form-item :label="$t('register.userId')" prop="id">
            <el-input v-model="registerForm.id" style="width:90%;" :readonly="true"></el-input>
          </el-form-item>
          <el-form-item :label="$t('register.userName')" prop="name">
            <el-input v-model="registerForm.name" style="width:90%;"></el-input>
          </el-form-item>
          <el-form-item :label="$t('register.address')">
            <el-input v-model="registerForm.address" style="width:90%;"></el-input>
          </el-form-item>
          <el-form-item :label="$t('register.linkman')">
            <el-input v-model="registerForm.linkman" style="width:90%;"></el-input>
          </el-form-item>
          <el-form-item :label="$t('register.number')">
            <el-input v-model="registerForm.number" style="width:90%;"></el-input>
          </el-form-item>
          <el-form-item :label="$t('register.logo')" prop="logo">
            <div class="upload-box-logo">
              <el-upload :action="actionUrl" accept="image/jpeg" list-type="picture-card" :data="registerForm.imgType" :headers="headerdate" :show-file-list="false" :before-upload="bgUpload" :on-success="bgSuccess" :on-error="bgError">
                <i class="el-icon-plus"></i>
              </el-upload>
              <div class="popUp" v-show="registerForm.logoBg" @mouseover="bgOver" @mouseout="bgOut">
                <img :src="registerForm.logo" alt="logo">
                <div class="mask" v-show="registerForm.logoMask">
                  <i class="el-icon-delete" @click="deleteBgImg"></i>
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item style="margin-bottom:0px;">
            <el-button type="primary" @click="submitForm('registerForm')">{{$t('common.confirm')}}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      headerdate: {},
      //上传文件地址
      actionUrl: NEW_URL_CONFIG + "/api/file/upload",
      registerForm: {
        id: "",
        name: "",
        address: "",
        linkman: "",
        number: "",
        clientId: "",
        imgType: {
          targetEnum: "Temp"
        },
        logoBg: false,
        logo: "",
        logoUrl: "",
        logoMask: false
      },
      rules: {
        id: [
          {
            required: true,
            message: this.$t("register.userIdTitle"),
            trigger: "change"
          }
        ],
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
        clientId: [
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
    getCompany() {
      this.$axios({
        method: "get",
        url: NEW_URL_CONFIG + "/api/client/select",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            sessionStorage.getItem("loginPrefix") +
            " " +
            sessionStorage.getItem("loginToken")
        },
        params: ""
      })
        .then(res => {
          if (res.data.statusCode == 200) {
            this.registerForm.id = res.data.data.clientId;
            this.registerForm.name = res.data.data.clientName;
            this.registerForm.address = res.data.data.clientAddress;
            this.registerForm.linkman = res.data.data.clientContact;
            this.registerForm.number = res.data.data.clientPhone;
            this.registerForm.logo = res.data.data.clientLogo;
            this.registerForm.logoBg = true;
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
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let postData = {
            clientName: this.registerForm.name,
            clientAddress: this.registerForm.address,
            clientContact: this.registerForm.linkman,
            clientPhone: this.registerForm.number,
            clientLogo: this.registerForm.logo
          };
          this.$axios({
            method: "put",
            url: NEW_URL_CONFIG + "/api/client/edit",
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
                  message: this.$t("common.editSuccessTitle")
                });
                setTimeout(() => {
                  this.$router.go(0)
                }, 2000);
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
          return false;
        }
      });
    },
    //图片上传前验证
    bgUpload(file) {
      var fileName = new Array();
      fileName = file.name.split(".");
      const extension1 = fileName[fileName.length - 1] === "jpg";
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
      // console.log(res)
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
    this.getCompany();
  }
};
</script>
<style lang="scss">
#company {
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
  .container {
    width: 640px;
    height: 550px;
    padding: 15px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    margin: 0 auto;
    > h3 {
      margin: 0px 0px 30px 0px;
      padding: 10px;
      border-bottom: 1px solid #ccc;
    }
    .upload-box-logo {
      position: relative;
      width: 148px;
      height: 148px;
      margin: 0px;
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
}
</style>
