<template>
  <div id="header">
    <div class="mainHeader">
      <div class="container">
        <hgroup><h1><img :src="logoUrl" v-if="logoUrl" alt="logo" width="30" height="30" style="float:left;"><a href="/" :title="companyName">{{companyName}}</a></h1></hgroup>
        <nav class="navHeader">
          <ul>
            <li><router-link :class="{ active: 'home' == $route.path.split('/')[1] }" :to="{path: '/home/home'}">{{$t('header.supCol.home')}}</router-link></li>
            <li><router-link :class="{ active: 'online' == $route.path.split('/')[1] }" :to="{path: '/online/video'}">{{$t('header.supCol.online')}}</router-link></li>
            <li><router-link :class="{ active: 'device' == $route.path.split('/')[1] }" :to="{path: '/device/productType'}">{{$t('header.supCol.device')}}</router-link></li>
            <li><router-link :class="{ active: 'date' == $route.path.split('/')[1] }" :to="{path: '/date/enforcealaw'}">{{$t('header.supCol.date')}}</router-link></li>
            <li><router-link :class="{ active: 'organize' == $route.path.split('/')[1] }" :to="{path: '/organize/department'}">{{$t('header.supCol.organize')}}</router-link></li>
            <li><router-link :class="{ active: 'statistics' == $route.path.split('/')[1] }" :to="{path: '/statistics/faceChange'}">{{$t('header.supCol.statistics')}}</router-link></li>
            <li><router-link :class="{ active: 'setting' == $route.path.split('/')[1] }" :to="{path: '/setting/admin'}">{{$t('header.supCol.setting')}}</router-link></li>
            <li><router-link :class="{ active: 'help' == $route.path.split('/')[1] }" :to="{path: '/help/feedback'}">{{$t('header.supCol.help')}}</router-link></li>
          </ul>
        </nav>
        <div class="personal" @mouseenter="enterManager" @mouseleave="leaveManager">
          <div class="dropdown-toggle" :class="{ active: manActive }" >{{userName}}</div>
          <ul class="dropdown-menu" v-show="managerBool">
            <li>
              <span>
                <div>H</div>
                <div class="overflow-hidden">{{userName}}</div>
                <!-- <div class="overflow-hidden">开发1111</div> -->
              </span>
            </li>
            <li class="divider"></li>
            <li @click="sendProfile"><span>{{$t('header.profile.name')}}</span></li>
            <li @click="sendPassword"><span>{{$t('header.password.name')}}</span></li>
            <li class="divider"></li>
            <li class="dropdown-submenu" @mouseenter="enterTheme" @mouseleave="leaveTheme">
              <span :class="{ active: themeActive }">{{$t('header.theme')}}</span>
              <ul v-show="themeBool">
                <li v-for='theme in $t("header.themes")' :key='theme.name' :class="{active: theme.id == storage.get('theme')}" @click="selTheme(theme)">{{theme.name}}</li>
              </ul>
            </li>
            <li class="dropdown-submenu" @mouseenter="enterLan" @mouseleave="leaveLan">
              <span :class="{ active: lanActive }" v-html="language"></span>
              <ul v-show="lanBool">
                <li v-for="item in $store.state.languageArr" :key="item.value" :class="{active: item.value==storage.get('language')}" @click="selLanguage(item)">{{item.label}}</li>
              </ul>
            </li>
            <!-- <li><span>{{$t('header.customMen')}}</span></li> -->
            <li class="divider"></li>
            <li class="dropdown-submenu" @mouseenter="enterHelp" @mouseleave="leaveHelp">
              <span :class="{ active: helpActive }">{{$t('header.help')}}</span>
              <ul v-show="helpBool">
                <li>{{$t('header.help1')}}</li>
                <li>{{$t('header.help2')}}</li>
                <li>{{$t('header.help3')}}</li>
              </ul>
            </li>
            <li><span @click="about">{{$t('header.system')}}</span></li>
            <li class="divider"></li>
            <li><span @click="logout">{{$t('header.logout')}}</span></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="subHeadr">
      <div class="container">
        <ul>
          <li v-for="col in subCol" v-show="col[0].path.split('/')[1] == $route.path.split('/')[1]" :key="col[0].name">
            <dl>
              <dd v-for="subcol in col" :key="subcol.name"><router-link :class="{ active: subcol.path == $route.path }" :to="{ path: subcol.path}">{{subcol.name}}</router-link></dd>
            </dl>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import storage from '@/api/storage'
import { toggleClass } from '@/api/language'
export default {
  name: 'Header',
  data(){
    return {
      logoUrl: '',
      companyName: '',
      language: this.$t('header.language'),
      userName: sessionStorage.getItem('user_name'),
      managerBool: false,
      themeBool: false,
      lanBool: false,
      helpBool: false,
      manActive: false,
      themeActive: false,
      lanActive: false,
      helpActive: false,
      subCol: [
        [
          {
            name: this.$t('header.subCol.home'),
            path: '/home/home',
            visibleBool: true
          }
        ],
        [
          {
            name: this.$t('header.subCol.video'),
            path: '/online/video',
            visibleBool: true
          },
          {
            name: this.$t('header.subCol.patrol'),
            path: '/online/patrol',
            visibleBool: true
          },
          {
            name: this.$t('header.subCol.face'),
            path: '/online/face',
            visibleBool: true
          },
          {
            name: this.$t('header.subCol.contrast'),
            path: '/online/contrast',
            visibleBool: true
          }
        ],
        [
          {
            name: this.$t('header.subCol.productType'),
            path: '/device/productType',
            visibleBool: true
          },
          {
            name: this.$t('header.subCol.device'),
            path: '/device/device',
            visibleBool: true
          },
          {
            name: this.$t('header.subCol.deviceLogin'),
            path: '/device/deviceLogin',
            visibleBool: true
          },
          {
            name: this.$t('header.subCol.loginRelation'),
            path: '/device/loginRelation',
            visibleBool: true
          },
          {
            name: this.$t('header.subCol.deviceUser'),
            path: '/device/deviceUser',
            visibleBool: true
          },
          {
            name: this.$t('header.subCol.userRelation'),
            path: '/device/userRelation',
            visibleBool: true
          }
        ],
        [
          {
            name: this.$t('header.subCol.enforcealaw'),
            path: '/date/enforcealaw',
            visibleBool: true
          },
          {
            name: this.$t('header.subCol.alcohol'),
            path: '/date/alcohol',
            visibleBool: true
          },
          {
            name: this.$t('header.subCol.face'),
            path: '/date/face',
            visibleBool: true
          },
          {
            name: this.$t('header.subCol.alcoholFace'),
            path: '/date/alcoholFace',
            visibleBool: true
          },
          {
            name: this.$t('header.subCol.drugs'),
            path: '/date/drugs',
            visibleBool: true
          }
        ],
        [
          {
            name: this.$t('header.subCol.department'),
            path: '/organize/department',
            visibleBool: true
          },
          {
            name: this.$t('header.subCol.staff'),
            path: '/organize/staff',
            visibleBool: true
          }
        ],
        [
          {
            name: this.$t('header.subCol.faceChange'),
            path: '/statistics/faceChange',
            visibleBool: true
          },
          {
            name: this.$t('header.subCol.alcoholChange'),
            path: '/statistics/alcoholChange',
            visibleBool: true
          },
          {
            name: this.$t('header.subCol.deviceChange'),
            path: '/statistics/deviceChange',
            visibleBool: true
          },
          {
            name: this.$t('header.subCol.deviceUserChange'),
            path: '/statistics/deviceUserChange',
            visibleBool: true
          },
          {
            name: this.$t('header.subCol.loginInfo'),
            path: '/statistics/loginInfo',
            visibleBool: true
          }
        ],
        [
          {
            name: this.$t('header.subCol.admin'),
            path: '/setting/admin',
            visibleBool: true
          },
          {
            name: this.$t('header.subCol.role'),
            path: '/setting/role',
            visibleBool: true
          },
          {
            name: this.$t('header.subCol.config'),
            path: '/setting/config',
            visibleBool: true
          },
					{
					  name: this.$t('header.subCol.mapSetting'),
					  path: '/setting/maps',
					  visibleBool: true
					},
          {
            name: this.$t('header.subCol.qrcode'),
            path: '/setting/qrcode',
            visibleBool: true
          }
        ],
        [
          {
            name: this.$t('header.subCol.about'),
            path: '/help/about',
            visibleBool: true
          },
          {
            name: this.$t('header.subCol.feedback'),
            path: '/help/feedback',
            visibleBool: true
          }
        ]
      ]
    }
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
            // this.registerForm.name = res.data.data.clientName;
            if(res.data.data.clientName){
              this.companyName = res.data.data.clientName;
            } else {
              this.companyName = this.$t('company');
            }
            this.logoUrl = res.data.data.clientLogo;
            // this.registerForm.logoBg = true;
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
    enterManager(){
      this.managerBool = true;
      this.manActive = true;
    },
    leaveManager(){
      this.managerBool = false;
      this.manActive = false;
    },
    enterTheme(){
      this.themeBool = true;
      this.themeActive = true;
    },
    leaveTheme(){
      this.themeBool = false;
      this.themeActive = false;
    },
    enterLan(){
      this.lanBool = true;
      this.lanActive = true;
    },
    leaveLan(){
      this.lanBool = false;
      this.lanActive = false;
    },
    enterHelp(){
      this.helpBool = true;
      this.helpActive = true;
    },
    leaveHelp(){
      this.helpBool = false;
      this.helpActive = false;
    },
    //设置语言
    selLanguage(e){
			this.$emit("changeLanguage-a",e)
      this.storage.set("language",e.value)
      this.$i18n.locale = e.value;
      //传递语言修改信号
      this.$root.Bus.$off('languageChange');
      this.$root.Bus.$emit('languageChange',e);
      this.language = this.$t('header.language');
      this.subCol = [
        [
          {
            name: this.$t('header.subCol.home'),
            path: '/home/home',
            visibleBool: true
          }
        ],
        [
          {
            name: this.$t('header.subCol.video'),
            path: '/online/video',
            visibleBool: true
          },
          {
            name: this.$t('header.subCol.patrol'),
            path: '/online/patrol',
            visibleBool: true
          },
          {
            name: this.$t('header.subCol.face'),
            path: '/online/face',
            visibleBool: true
          },
          {
            name: this.$t('header.subCol.contrast'),
            path: '/online/contrast',
            visibleBool: true
          }
        ],
        [
          {
            name: this.$t('header.subCol.productType'),
            path: '/device/productType',
            visibleBool: true
          },
          {
            name: this.$t('header.subCol.device'),
            path: '/device/device',
            visibleBool: true
          },
          {
            name: this.$t('header.subCol.deviceLogin'),
            path: '/device/deviceLogin',
            visibleBool: true
          },
          {
            name: this.$t('header.subCol.loginRelation'),
            path: '/device/loginRelation',
            visibleBool: true
          },
          {
            name: this.$t('header.subCol.deviceUser'),
            path: '/device/deviceUser',
            visibleBool: true
          },
          {
            name: this.$t('header.subCol.userRelation'),
            path: '/device/userRelation',
            visibleBool: true
          }
        ],
        [
          {
            name: this.$t('header.subCol.enforcealaw'),
            path: '/date/enforcealaw',
            visibleBool: true
          },
          {
            name: this.$t('header.subCol.alcohol'),
            path: '/date/alcohol',
            visibleBool: true
          },
          {
            name: this.$t('header.subCol.face'),
            path: '/date/face',
            visibleBool: true
          },
          {
            name: this.$t('header.subCol.alcoholFace'),
            path: '/date/alcoholFace',
            visibleBool: true
          },
          {
            name: this.$t('header.subCol.drugs'),
            path: '/date/drugs',
            visibleBool: true
          }
        ],
        [
          {
            name: this.$t('header.subCol.department'),
            path: '/organize/department',
            visibleBool: true
          },
          {
            name: this.$t('header.subCol.staff'),
            path: '/organize/staff',
            visibleBool: true
          }
        ],
        [
          {
            name: this.$t('header.subCol.faceChange'),
            path: '/statistics/faceChange',
            visibleBool: true
          },
          {
            name: this.$t('header.subCol.alcoholChange'),
            path: '/statistics/alcoholChange',
            visibleBool: true
          },
          {
            name: this.$t('header.subCol.deviceChange'),
            path: '/statistics/deviceChange',
            visibleBool: true
          },
          {
            name: this.$t('header.subCol.deviceUserChange'),
            path: '/statistics/deviceUserChange',
            visibleBool: true
          },
          {
            name: this.$t('header.subCol.loginInfo'),
            path: '/statistics/loginInfo',
            visibleBool: true
          }
        ],
        [
          {
            name: this.$t('header.subCol.admin'),
            path: '/setting/admin',
            visibleBool: true
          },
          {
            name: this.$t('header.subCol.role'),
            path: '/setting/role',
            visibleBool: true
          },
          {
            name: this.$t('header.subCol.config'),
            path: '/setting/config',
            visibleBool: true
          },
					{
					  name: this.$t('header.subCol.mapSetting'),
					  path: '/setting/maps',
					  visibleBool: true
					},
          {
            name: this.$t('header.subCol.qrcode'),
            path: '/setting/qrcode',
            visibleBool: true
          },
          {
            name: this.$t('header.subCol.company'),
            path: '/setting/company',
            visibleBool: true
          }
        ],
        [
          {
            name: this.$t('header.subCol.about'),
            path: '/help/about',
            visibleBool: true
          },
          {
            name: this.$t('header.subCol.feedback'),
            path: '/help/feedback',
            visibleBool: true
          }
        ]
      ];
      this.getCompany();
    },
    // 切换主题
    selTheme(e){
      // console.log(e)
      this.storage.set('theme',e.id)
      toggleClass(document.body, e.id);
      this.$forceUpdate();
    },
    //跳转关于系统
    about(){
      this.$router.push('/help/about');
    },
    //退出登录
    logout(){
      this.$axios({
        method: "get",
        url: NEW_URL_CONFIG+"/api/weblogin/logout",
        headers: {
            "accept": "application/json",
            "Content-Type": "application/json",
            Authorization: sessionStorage.getItem("loginPrefix")+' '+sessionStorage.getItem("loginToken")
        },
        params: ''
      }).then(res=>{
        if(res.data.statusCode == 200){
          sessionStorage.removeItem('loginPrefix');
          sessionStorage.removeItem('loginToken');
          sessionStorage.removeItem('user_name')
          sessionStorage.removeItem('remember')
          this.$message({
              type: 'success',
              message: this.$t('common.logoutTitle'),
              showClose: true,
              duration:2000
          });
          this.$router.push('/login');
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
    //控制修改密码弹窗
    sendPassword(){
      this.$root.Bus.$emit('passwordChange',true)
    },
    //控制修改个人档案弹窗
    sendProfile(){
      this.$root.Bus.$emit('profileChange',true)
    }
  },
  created(){
    this.getCompany()
  },
  mounted(){
    // 获取当前的语言
    this.$i18n.locale = this.storage.get('language');
    this.subCol = [
      [
        {
          name: this.$t('header.subCol.home'),
          path: '/home/home',
          visibleBool: true
        }
      ],
      [
        {
          name: this.$t('header.subCol.video'),
          path: '/online/video',
          visibleBool: true
        },
        {
          name: this.$t('header.subCol.patrol'),
          path: '/online/patrol',
          visibleBool: true
        },
        {
          name: this.$t('header.subCol.face'),
          path: '/online/face',
          visibleBool: true
        },
        {
          name: this.$t('header.subCol.contrast'),
          path: '/online/contrast',
          visibleBool: true
        }
      ],
      [
        {
          name: this.$t('header.subCol.productType'),
          path: '/device/productType',
          visibleBool: true
        },
        {
          name: this.$t('header.subCol.device'),
          path: '/device/device',
          visibleBool: true
        },
        {
          name: this.$t('header.subCol.deviceLogin'),
          path: '/device/deviceLogin',
          visibleBool: true
        },
        {
          name: this.$t('header.subCol.loginRelation'),
          path: '/device/loginRelation',
          visibleBool: true
        },
        {
          name: this.$t('header.subCol.deviceUser'),
          path: '/device/deviceUser',
          visibleBool: true
        },
        {
          name: this.$t('header.subCol.userRelation'),
          path: '/device/userRelation',
          visibleBool: true
        }
      ],
      [
        {
          name: this.$t('header.subCol.enforcealaw'),
          path: '/date/enforcealaw',
          visibleBool: true
        },
        {
          name: this.$t('header.subCol.alcohol'),
          path: '/date/alcohol',
          visibleBool: true
        },
        {
          name: this.$t('header.subCol.face'),
          path: '/date/face',
          visibleBool: true
        },
        {
          name: this.$t('header.subCol.alcoholFace'),
          path: '/date/alcoholFace',
          visibleBool: true
        },
        {
          name: this.$t('header.subCol.drugs'),
          path: '/date/drugs',
          visibleBool: true
        }
      ],
      [
        {
          name: this.$t('header.subCol.department'),
          path: '/organize/department',
          visibleBool: true
        },
        {
          name: this.$t('header.subCol.staff'),
          path: '/organize/staff',
          visibleBool: true
        }
      ],
      [
        {
          name: this.$t('header.subCol.faceChange'),
          path: '/statistics/faceChange',
          visibleBool: true
        },
        {
          name: this.$t('header.subCol.alcoholChange'),
          path: '/statistics/alcoholChange',
          visibleBool: true
        },
        {
          name: this.$t('header.subCol.deviceChange'),
          path: '/statistics/deviceChange',
          visibleBool: true
        },
        {
          name: this.$t('header.subCol.deviceUserChange'),
          path: '/statistics/deviceUserChange',
          visibleBool: true
        },
        {
          name: this.$t('header.subCol.loginInfo'),
          path: '/statistics/loginInfo',
          visibleBool: true
        }
      ],
      [
        {
          name: this.$t('header.subCol.admin'),
          path: '/setting/admin',
          visibleBool: true
        },
        {
          name: this.$t('header.subCol.role'),
          path: '/setting/role',
          visibleBool: true
        },
        {
          name: this.$t('header.subCol.config'),
          path: '/setting/config',
          visibleBool: true
        },
				{
				  name: this.$t('header.subCol.mapSetting'),
				  path: '/setting/maps',
				  visibleBool: true
				},
        {
          name: this.$t('header.subCol.qrcode'),
          path: '/setting/qrcode',
          visibleBool: true
        },
        {
          name: this.$t('header.subCol.company'),
          path: '/setting/company',
          visibleBool: true
        }
      ],
      [
        {
          name: this.$t('header.subCol.feedback'),
          path: '/help/feedback',
          visibleBool: true
        },
        {
          name: this.$t('header.subCol.about'),
          path: '/help/about',
          visibleBool: true
        }
      ]
    ]
    // 设置默认主题
    toggleClass(document.body, this.storage.get('theme'));
  },
  watch: {

  },
  computed: {

  }
}
</script>
<style lang="scss">
#header{
  position: fixed;
  top: 0px;
  z-index: 2000;
  width: 100%;
  .mainHeader{
    border-top-color: #0c64eb;
    border-bottom-color: #e9f2fb;
    .container{
      height: 50px;
      position: relative;
      text-align: center;
      hgroup{
        position: absolute;
        margin-top: 10px;
      }
      nav{
        height: 50px;
      }
      .navHeader{
        ul{
          display: inline-block;
          li{
            float: left;
            a{
              display: inline-block;
              padding: 10px 15px;
              line-height: 30px;
              color: #fff;
              &.active{
                background: rgba(0,0,0,.1);
              }
              &:hover{
                background: rgba(0,0,0,.1);
              }
            }
          }
          .active{
            background: rgba(0,0,0,0.1);
          }
        }
      }
      .personal{
        position: absolute;
        top: 10px;
        .dropdown-toggle{
          padding: 3px 18px 3px 10px;
          margin-left: 3px;
          color: #fff;
          border-radius: 4px;
          cursor: pointer;
          position: relative;
          vertical-align: middle;
          max-width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          line-height: 24px;
          font-size: 15px;
          &.active{
            background: rgba(0,0,0,0.2);
          }
          &:after{
            position: absolute;
            right: 5px;
            top: 12px;
            content: '';
            width: 0;
            height: 0;
            margin-bottom: 2px;
            margin-left: 2px;
            vertical-align: middle;
            border-top: 4px dashed #fff;
            border-right: 4px solid transparent;
            border-left: 4px solid transparent;
          }
        }
        .dropdown-menu{
          position: absolute;
          top: 100%;
          top: 28px;
          right: 0;
          z-index: 1000;
          min-width: 148px;
          margin: 2px 0 0;
          font-size: 13px;
          list-style: none;
          background-color: #fff;
          border: 1px solid rgba(0,0,0,.15);
          border-radius: 4px;
          -webkit-box-shadow: 0 6px 12px rgba(0,0,0,.175);
          box-shadow: 0 6px 12px rgba(0,0,0,.175);
          border-radius: 4px;
          padding: 5px 0px;
          border-color: rgba(0,0,0,.1);
          li{
            position: relative;
            padding: 0px 10px;
            span{
              padding: 0px 10px;
              margin: 4px 0;
              border-radius: 3px;
              font-weight: 400;
              line-height: 24px;
              text-align: left;
              color:#333;
              cursor: pointer;
              display: block;
              &hover{
                background: #0c64eb;
                color:#fff;
              }
              &.active{
                background: #0c64eb;
                color:#fff;
              }
            }
            ul{
              background-color: #fff;
              position: absolute;
              left: -150px;
              top: -5px;
              width: 128px;
              border: 1px solid rgba(0,0,0,.15);
              padding: 5px 10px;
              border: 1px solid rgba(0,0,0,.15);
              border-radius: 4px;
              -webkit-box-shadow: 0 6px 12px rgba(0,0,0,.175);
              box-shadow: 0 6px 12px rgba(0,0,0,.175);
              text-align: left;
              li{
                padding: 2px 10px;
                margin: 5px 0;
                border-radius: 3px;
                cursor: pointer;
                height: 18px;
                line-height: 18px;
                font-size: 13px;
                &hover{
                  background: #0c64eb;
                  color:#fff;
                }
                &.active{
                  background: #0c64eb;
                  color:#fff;
                }
              }
            }
          }
          >li:nth-of-type(1){
            position: relative;
            margin: 5px 0;
            span{
              display: block;
              height: 44px;
              :nth-of-type(1){
                position: absolute;
                top: 6px;
                left: 15px;
                width: 30px;
                height: 30px;
                background: #16a8f8;
                text-align: center;
                line-height: 30px;
                color: #fff;
                -webkit-border-radius: 50%;
                -moz-border-radius: 50%;
                -ms-border-radius: 50%;
                -o-border-radius: 50%;
                border-radius: 50%;
              }
              :nth-of-type(2){
                font-size: 15px;
                position: absolute;
                left: 50px;
                width: 80px;
                height: 24px;
                text-align: left;
                line-height: 24px;
                top:8px;
                font-weight: bolder;
              }
              :nth-of-type(3){
                font-size: 13px;
                color:#999;
                position: absolute;
                left: 50px;
                top: 24px;
                width: 80px;
                height: 20px;
                text-align: left;
                line-height: 20px;
              }
            }
          }
          li.divider{
            height: 1px;
            overflow: hidden;
            background-color: #eee;
            padding: 0px 10px;
            margin: 8px 0;
          }
          li.dropdown-submenu span{
            &:after{
              content: '';
              width: 0px;
              height: 0px;
              border-width: 5px 0px 5px 5px;
              border-style: solid;
              border-color: transparent;
              border-left-color: #ccc;
              float: right;
              margin-top: 6px;
              margin-right: -4px;
            }
          }
          li.dropdown-submenu spanhover,li.dropdown-submenu span.active{
            &:after{
              border-left-color: #fff;
            }
          }
        }
      }
      h1{
        margin: 0;
        a{
          color: #fff;
          float: left;
          max-width: 300px;
          margin: 0px 0px 0px 5px;
          overflow: hidden;
          font-size: 20px;
          font-weight: 400;
          line-height: 30px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
  }
  .subHeadr{
    background: #fff;
    padding: 5px 0px;
    height: 40px;
    .container{
      text-align: center;
      ul{
        li{
          dl{
            margin: 0px;
            text-align: center;
            dd{
              height: 40px;
              margin: 0;
              display: inline-block;
              a{
                padding: 8px 12px;
                line-height: 24px;
                color: #3c4353;
                display: inline-block;
                font-size: 14px;
                border-radius: 4px;
                &:hover{
                  background: rgba(0,0,0,.1);
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
