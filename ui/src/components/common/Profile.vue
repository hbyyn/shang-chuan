<template>
  <el-dialog :title="$t('header.profile.name')" :visible.sync="profileVisible" width="500px" class="profile">
    <el-form :model="changeProfile" ref="changeProfile" style="padding:0px 30px;" label-width="130px">
      <el-form-item :label="$t('header.profile.loginId')" >
        <el-input v-model="changeProfile.loginId" readonly></el-input>
      </el-form-item>
      <el-form-item :label="$t('header.profile.loginName')" >
        <el-input v-model="changeProfile.loginName" :readonly="!editProfileBool"></el-input>
      </el-form-item>
      <!-- <el-form-item :label="$t('header.profile.loginAcode')" >
        <el-input v-model="changeProfile.loginAcode" readonly></el-input>
      </el-form-item> -->
      <el-form-item :label="$t('header.profile.creatorId')" >
        <el-input v-model="changeProfile.creatorId" readonly></el-input>
      </el-form-item>
      <el-form-item :label="$t('header.profile.createTime')">
        <el-input v-model="changeProfile.createTime" readonly></el-input>
      </el-form-item>
      <el-form-item :label="$t('header.profile.updatorId')">
        <el-input v-model="changeProfile.updatorId" readonly></el-input>
      </el-form-item>
      <el-form-item :label="$t('header.profile.updateTime')">
        <el-input v-model="changeProfile.updateTime" readonly></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="editProfileFun" v-if="!editProfileBool">{{$t('header.profile.editProfile')}}</el-button>
        <div v-else>
          <el-button type="primary" @click="saveProfile">{{$t('common.save')}}</el-button>
          <el-button @click="cancelProfile">{{$t('common.cancel')}}</el-button>
        </div>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
export default {
  data(){
    return {
      profileVisible: false,
      editProfileBool: false, //true表示编制状态，false表示非编辑状态
      changeProfile: {
        loginId: '',
        loginName: '',
        loginAcode: '',
        creatorId: '',
        createTime: '',
        updatorId: '',
        updateTime: ''
      }
    }
  },
  methods:{
    //编辑个人档案
    editProfileFun(){
      this.editProfileBool = true;
    },
    //保存编辑个人档案
    saveProfile(){
      this.$axios({
        method: "put",
        url: NEW_URL_CONFIG + "/api/weblogin/private/edit",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            sessionStorage.getItem("loginPrefix") +
            " " +
            sessionStorage.getItem("loginToken")
        },
        data: {
          "loginName": this.changeProfile.loginName
        }
      }).then(res=>{
        if(res.data.statusCode == 200){
          this.$message({
            type: 'success',
            message: this.$t('header.profile.updateSuccess'),
            showClose: true,
            duration:2000
          });
          this.editProfileBool = false;
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
    },
    //取消编辑个人档案
    cancelProfile(){
     this.editProfileBool = false;
    }
  },
  created(){

  },
  mounted() {
    this.$root.Bus.$on('profileChange',val=>{
      this.profileVisible = val;
      this.editProfileBool = !val;
      this.$axios({
        method: "get",
        url: NEW_URL_CONFIG + "/api/weblogin/private/data",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization:
            sessionStorage.getItem("loginPrefix") +
            " " +
            sessionStorage.getItem("loginToken")
        },
        params: ''
      }).then(res=>{
        if(res.data.statusCode == 200){
            this.changeProfile.loginId = res.data.data.resultObjects[0].loginId;
            this.changeProfile.loginName = res.data.data.resultObjects[0].loginName;
            this.changeProfile.loginAcode = res.data.data.resultObjects[0].loginAcode;
            this.changeProfile.creatorId = res.data.data.resultObjects[0].creatorId;
            this.changeProfile.createTime = res.data.data.resultObjects[0].createTime;
            this.changeProfile.updatorId = res.data.data.resultObjects[0].updatorId;
            this.changeProfile.updateTime =res.data.data.resultObjects[0].updateTime;
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
    });
  },
}
</script>
<style lang="scss">
</style>

