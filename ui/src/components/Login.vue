<template>
  <div class="login-box" id="login">
    <div class="login">
      <div class="header">
        <h3>{{$t('login.systemName')}}</h3>
        <el-select v-model="language" size="small" class="language" @change="selLanguage" :placeholder="$t('common.select')">
          <el-option v-for="item in languageArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
      <div class="logo">
        <img src="../assets/img/logo.jpg" alt="logo">
      </div>
      <div class="signIn">
        <el-form :model="loginForm" :rules="loginRules" ref="loginForm" status-icon label-width="80px" class="demo-ruleForm" >
          <el-form-item :label="$t('login.comNum')" size="small" style="width:292px;margin-bottom:15px;" prop="comName">
            <el-input type="comName" v-model="loginForm.comName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item :label="$t('login.userName')" size="small" style="width:292px;margin-bottom:15px;" prop="userName">
            <el-input type="userName" v-model="loginForm.userName" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item :label="$t('login.password')" size="small" style="width:292px;margin-bottom:15px;" prop="password">
            <el-input type="password" v-model="loginForm.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item size="small" style="width:292px;margin-bottom:10px;">
            <el-button type="primary" size="small" style="background:#0c64eb;" @click="submitForm('loginForm')" v-loading.fullscreen.lock="loginForm.loginLoading">{{$t('login.signIn')}}</el-button>
            <el-button type="text" @click="register">{{$t('common.register')}}</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import { toggleClass } from "@/api/language";
import storage from "../api/storage.js";
export default {
  data() {
    return {
      language: this.storage.get("language") || "zh-cn",
      languageArr: [
        {
          value: "zh-cn",
          label: "简体"
        },
        {
          value: "zh-tw",
          label: "繁体"
        },
        {
          value: "en",
          label: "English"
        }
      ],
      loginForm: {
        comName: sessionStorage.getItem("comName"),
        userName: "",
        password: "",
        loginLoading: false,
        remember: sessionStorage.getItem("remember") || false
      },
      loginRules: {
        userName: [
          {
            required: true,
            message: this.$t("login.userTips"),
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: this.$t("login.passwordTips"),
            trigger: "blur"
          }
        ],
        comName: [
          {
            required: true,
            message: this.$t("login.comNumTips"),
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {},
  methods: {
    selLanguage(val) {
      this.$i18n.locale = val;
      this.storage.set("language", val);
			switch (val) {
				case 'zh-tw':
					localStorage.setItem("languageType", 'zh-TW')
					break;
				case 'zh-cn':
					localStorage.setItem("languageType", 'zh-CN')
					break;
				case 'en':
					localStorage.setItem("languageType", 'en-US')
					break;
			}
      this.loginRules = {
        userName: [
          {
            required: true,
            message: this.$t("login.userTips"),
            trigger: "change"
          }
        ],
        password: [
          {
            required: true,
            message: this.$t("login.passwordTips"),
            trigger: "change"
          }
        ],
        comName: [
          {
            required: true,
            message: this.$t("login.comNameTips"),
            trigger: "change"
          }
        ]
      };
      this.$nextTick(()=>{
        this.$refs.loginForm.clearValidate();
      });
    },
    submitForm(loginForm) {
      this.$refs[loginForm].validate(valid => {
        if (valid) {
          this.loginForm.loginLoading = true;
          this.$axios({
            method: "post",
            url: NEW_URL_CONFIG + "/api/weblogin/login",
            headers: {
              accept: "application/json",
              "Content-Type": "application/json"
            },
            timeout: 5000,
            data: JSON.stringify({
              clientId: this.loginForm.comName,
              loginId: this.loginForm.userName,
              userPassword: this.loginForm.password
            })
          })
            .then(res => {
              if (res.data.statusCode == "200") {
                this.$store.state.headerBool = true;
                sessionStorage.setItem(
                  "loginPrefix",
                  res.data.data.tokenResult.accessPrefix
                );
                sessionStorage.setItem("loginToken", res.data.data.tokenResult.accessToken);
                sessionStorage.setItem("user_name", this.loginForm.userName);
                sessionStorage.setItem("comName", this.loginForm.comName);
                sessionStorage.setItem("remember", this.loginForm.remember);
                this.storage.set("language", this.$i18n.locale);
                this.loginForm.loginLoading = false;
                this.$router.push({
                  path: "/home/home"
                });
              } else if (res.data.statusCode == "201") {
                this.loginForm.loginLoading = false;
                this.$message({
                  showClose: true,
                  duration: 2000,
                  message: this.$t("login.loginErrorTitle"),
                  type: "error"
                });
              } else if (res.data.statusCode == "500201") {
                this.loginForm.loginLoading = false;
                this.$message({
                  showClose: true,
                  duration: 2000,
                  message: this.$t("login.noUserTitle"),
                  type: "error"
                });
              }
            })
            .catch(res => {
              this.loginForm.loginLoading = false;
              if (res.config.maxContentLength == "-1") {
                this.$message({
                  showClose: true,
                  duration: 2000,
                  message: this.$t("login.timeOut"),
                  type: "error"
                });
              }
            });
        } else {
          return false;
        }
      });
    },
    //进入注册页面
    register() {
      this.$router.push("/register");
    }
  },
  created() {
    this.$i18n.locale = this.storage.get("language") || "zh-cn";
    // 设置默认主题
    this.storage.set("theme", "custom-0c64eb");
  },
  mounted() {
    // 设置默认主题
    toggleClass(document.body, this.storage.get("theme"));
    var windowH = window.innerHeight;
    document.getElementById("login").style.height = windowH + "px";
    // 定义窗口大小变更通知事件
    window.onresize = function() {
      var windowH = window.innerHeight;
      document.getElementById("login").style.height = windowH + "px";
    };
    let that = this;
    document.onkeydown = function(e) {
      e = window.event || e;
      if (
        that.$route.path == "/login" && (e.keyCode == 13)) {
        that.submitForm("loginForm");
      }
    };
    if(this.$route.query.code == 405){
      this.$message({
        showClose: true,
        duration: 2000,
        type: "warning",
        message: this.$t('common.duplicateLogon')
      });
    }
  },
  watch: {},
  destroyed() {
    window.onresize = null;
  }
};
</script>
<style scoped>
.login-box {
  width: 100%;
  height: 100%;
  background-color: #1183fb;
  position: relative;
}
.login {
  position: absolute;
  left: 50%;
  top: 50%;
  margin-left: -260px;
  margin-top: -150px;
  width: 520px;
  height: 300px;
  background-color: #fff;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  -ms-border-radius: 4px;
  -o-border-radius: 4px;
  border-radius: 4px;
  -webkit-box-shadow: 1px 1px 4px 0px #333, -1px -1px 4px 0px #333;
  -moz-box-shadow: 1px 1px 4px 0px #333, -1px -1px 4px 0px #333;
  -ms-box-shadow: 1px 1px 4px 0px #333, -1px -1px 4px 0px #333;
  -o-box-shadow: 1px 1px 4px 0px #333, -1px -1px 4px 0px #333;
  box-shadow: 1px 1px 4px 0px #333, -1px -1px 4px 0px #333;
}
.login .header {
  padding: 20px;
  border-bottom: 1px #eee solid;
  position: relative;
}
.login .header h3 {
  margin: 0;
  height: 32px;
  line-height: 32px;
  font-size: 16px;
  text-align: left;
}
.login .header .language {
  position: absolute;
  right: 20px;
  top: 20px;
  width: 90px;
}
.el-input--suffix .el-input__inner {
  padding: 0px 20px 0px 10px !important;
}
.el-select-dropdown__item {
  padding: 0px 15px !important;
  height: 30px !important;
  line-height: 30px !important;
}
.el-input__icon {
  width: 20px;
}
.logo {
  position: absolute;
  width: 135px;
  height: 172px;
  padding: 20px 0px 20px 30px;
}
.logo img {
  float: right;
  margin-top: 40px;
  width: 135px;
}
.signIn {
  position: absolute;
  width: 345px;
  height: 192px;
  right: 0;
  padding-top: 25px;
}
</style>

