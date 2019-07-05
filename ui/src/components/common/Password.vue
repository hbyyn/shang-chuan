<template>
<el-dialog :title="$t('header.password.changeTitle')" :visible.sync="passwordVisible" width="500px">
  <el-form :model="changePass" :rules="changePassRules" ref="changePass" style="padding:0px 30px;" label-width="110px">
    <el-form-item :label="$t('header.password.userName')">
      <el-input v-model="changePass.userName" readonly></el-input>
    </el-form-item>
    <el-form-item :label="$t('header.password.oldPass')" prop="oldPass">
      <el-input v-if="passBool" v-model="changePass.oldPass" type="password" :placeholder="$t('header.password.oldPassTitle')">
        <i slot="suffix" v-if="changePass.oldPass" style="margin-right:8px;" class="iconfont well-4g-icon-guanbi-yanjing" @click="closePass"></i>
      </el-input>
      <el-input v-else v-model="changePass.oldPass" :placeholder="$t('header.password.oldPassTitle')">
        <i slot="suffix" v-if="changePass.oldPass" style="margin-right:8px;" class="iconfont well-4g-icon-yanjing" @click="openPass"></i>
      </el-input>
    </el-form-item>
    <el-form-item :label="$t('header.password.newPass')" prop="newPass">
      <el-input v-if="passNewBool" v-model="changePass.newPass" type="password" :placeholder="$t('header.password.newPassTitle')">
        <i slot="suffix" v-if="changePass.newPass" style="margin-right:8px;" class="iconfont well-4g-icon-guanbi-yanjing" @click="closeNewPass"></i>
      </el-input>
      <el-input v-else v-model="changePass.newPass" :placeholder="$t('header.password.newPassTitle')">
        <i slot="suffix" v-if="changePass.newPass" style="margin-right:8px;" class="iconfont well-4g-icon-yanjing" @click="openNewPass"></i>
      </el-input>
    </el-form-item>
    <el-form-item :label="$t('header.password.reportPass')" prop="reportPass" style="margin-bottom:0px;">
      <el-input v-if="passRepBool" v-model="changePass.reportPass" type="password" :placeholder="$t('header.password.reportPassTitle')">
        <i slot="suffix" v-if="changePass.reportPass" style="margin-right:8px;" class="iconfont well-4g-icon-guanbi-yanjing" @click="closeRepPass"></i>
      </el-input>
      <el-input v-else v-model="changePass.reportPass" :placeholder="$t('header.password.reportPassTitle')">
        <i slot="suffix" v-if="changePass.reportPass" style="margin-right:8px;" class="iconfont well-4g-icon-yanjing" @click="openRepPass"></i>
      </el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="passwordVisible = false">{{$t('common.cancel')}}</el-button>
    <el-button type="primary" @click="savePassword('changePass')">{{$t('common.confirm')}}</el-button>
  </div>
</el-dialog>
</template>
<script>
import storage from '@/api/storage'
export default {
  data (){
    var validateOldPass = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(this.$t('header.password.oldPassTitle')))
      }else if(value.split('').length<5){
        return callback(new Error(this.$t('header.password.oldPassTitleLen')))
      }else{
        return callback();
      }
    };
    var validateNewPass = (rule, value, callback) => {
      let newPassReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/
      if (!value) {
        return callback(new Error(this.$t('header.password.newPassTitle')))
      }else if(value.split('').length<5||value.split('').length>20){
        return callback(new Error(this.$t('header.password.newPassTitleLen')))
      }else if(!newPassReg.test(value)){
        return callback(new Error(this.$t('header.password.newPassTitleCont')))
      }else{
        return callback();
      }
    };
    var validateReportPass = (rule, value, callback) => {
      if(this.changePass.newPass != value){
        return callback(new Error(this.$t('header.password.reportPassTitle')))
      }else{
        return callback();
      }
    };
    return {
      passBool: true,
      passNewBool: true,
      passRepBool: true,
      passwordVisible: false,
      changePass: {
        userName: sessionStorage.getItem('user_name'),
        oldPass: '',
        newPass: '',
        reportPass: ''
      },
      changePassRules: {
        oldPass: [
          { required: true, validator: validateOldPass, trigger: 'change' }
        ],
        newPass: [
          { required: true, validator: validateNewPass, trigger: 'change' }
        ],
        reportPass: [
          { required: true, validator: validateReportPass, trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    closePass(){
      this.passBool = false;
    },
    openPass(){
      this.passBool = true;
    },
    closeNewPass(){
      this.passNewBool = false;
    },
    openNewPass(){
      this.passNewBool = true;
    },
    closeRepPass(){
      this.passRepBool = false;
    },
    openRepPass(){
      this.passRepBool = true;
    },
    //保存密码
    savePassword(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$axios({
            method: "put",
            url: NEW_URL_CONFIG+"/api/weblogin/private/change/password",
            headers: {
                "accept": "application/json",
                "Content-Type": "application/json",
                Authorization: sessionStorage.getItem("loginPrefix")+' '+sessionStorage.getItem("loginToken")
            },
            data: {
              "oldPassword": this.changePass.oldPass,
              "newPassword": this.changePass.newPass
            }
          }).then(res=>{
            if(res.data.statusCode == 200){
              this.passwordVisible = false;
              this.$message({
                  type: 'success',
                  message: this.$t('header.password.newPassSuccess'),
                  showClose: true,
                  duration:2000
              });
              this.$router.push('/login');
            }else if(res.data.statusCode == 500102){
              this.$message({
                  type: 'warning',
                  message: this.$t('header.password.oldPassError'),
                  showClose: true,
                  duration:2000
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
          });
        } else {
          // console.log('error submit!!');
          return false;
        }
      });
    }
  },
  mounted(){
    this.$root.Bus.$on('passwordChange',(val)=>{
      this.passwordVisible = val;
      this.$nextTick(()=>{
        this.changePass.oldPass = '';
        this.changePass.newPass = '';
        this.changePass.reportPass = '';
        this.$nextTick(()=>{
            this.$refs.changePass.clearValidate();
        });
      });
    });
  }
}
</script>
<style lang="scss">

</style>
