import Vue from 'vue'
import Router from 'vue-router'
// import Main from '@/components/HelloWorld'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  routes: [{
      path: '/',
      redirect: '/home/home'
    },
    {
      path: '/',
      name: 'Main',
      component: resolve => require(['../components/Main.vue'], resolve),
      meta: {
        title: '首页'
      },
      // redirect: '/home/home',
      children: [
        {
          path: '/home/home',
          name: 'Home',
          component: resolve => require(['../components/home/home.vue'], resolve),
          meta: {
            title: '首页'
          }
        },
        {
          path: '/online/:id',
          name: 'Online',
          component: resolve => require(['../components/online/online.vue'], resolve),
        },
        {
          path: '/device/device',
          name: 'Device',
          component: resolve => require(['../components/device/device.vue'], resolve)
        },
        {
          path: '/device/deviceLogin',
          name: 'DeviceLogin',
          component: resolve => require(['../components/device/deviceLogin.vue'], resolve)
        },
        {
          path: '/device/loginRelation',
          name: 'LoginRelation',
          component: resolve => require(['../components/device/loginRelation.vue'], resolve)
        },
        {
          path: '/device/deviceUser',
          name: 'DeviceUser',
          component: resolve => require(['../components/device/deviceUser.vue'], resolve)
        },
        {
          path: '/device/userRelation',
          name: 'UserRelation',
          component: resolve => require(['../components/device/userRelation.vue'], resolve)
        },
        {
          path: '/device/productType',
          name: 'ProductType',
          component: resolve => require(['../components/device/productType.vue'], resolve)
        },
        {
          path: '/date/enforcealaw',
          name: 'Enforcealaw',
          component: resolve => require(['../components/date/enforcealaw.vue'], resolve)
        },
        {
          path: '/date/alcohol',
          name: 'Alcohol',
          component: resolve => require(['../components/date/alcohol.vue'], resolve)
        },
        {
          path: '/date/face',
          name: 'Face',
          component: resolve => require(['../components/date/face.vue'], resolve)
        },
        {
          path: '/date/alcoholFace',
          name: 'FaceData',
          component: resolve => require(['../components/date/alcoholFace.vue'], resolve)
        },
        {
          path: '/date/drugs',
          name: 'drugs',
          component: resolve => require(['../components/date/drugs.vue'], resolve)
        },
        {
          path: '/organize/department',
          name: 'Department',
          component: resolve => require(['../components/organize/department.vue'], resolve)
        },
        {
          path: '/organize/staff',
          name: 'Staff',
          component: resolve => require(['../components/organize/staff.vue'], resolve)
        },
        {
          path: '/statistics/loginInfo',
          name: 'LoginInfo',
          component: resolve => require(['../components/statistics/loginInfo.vue'], resolve)
        },
        {
          path: '/statistics/faceChange',
          name: 'faceChange',
          component: resolve => require(['../components/statistics/faceChange.vue'], resolve)
        },
        {
          path: '/statistics/alcoholChange',
          name: 'AlcoholChange',
          component: resolve => require(['../components/statistics/alcoholChange.vue'], resolve)
        },
        {
          path: '/statistics/deviceChange',
          name: 'DeviceChange',
          component: resolve => require(['../components/statistics/deviceChange.vue'], resolve)
        },
        {
          path: '/statistics/deviceUserChange',
          name: 'DeviceUserChange',
          component: resolve => require(['../components/statistics/deviceUserChange.vue'], resolve)
        },
        {
          path: '/setting/admin',
          name: 'Admin',
          component: resolve => require(['../components/setting/admin.vue'], resolve)
        },
        {
          path: '/setting/role',
          name: 'Role',
          component: resolve => require(['../components/setting/role.vue'], resolve)
        },
        {
          path: '/setting/config',
          name: 'Config',
          component: resolve => require(['../components/setting/config.vue'], resolve)
        },
        {
          path: '/setting/qrcode',
          name: 'Qrcode',
          component: resolve => require(['../components/setting/qrcode.vue'], resolve)
        },
				{
				  path: '/setting/maps',
				  name: 'maps',
				  component: resolve => require(['../components/setting/maps.vue'], resolve)
				},
        {
          path: '/setting/company',
          name: 'Company',
          component: resolve => require(['../components/setting/company.vue'], resolve)
        },
        {
          path: '/help/about',
          name: 'About',
          component: resolve => require(['../components/help/about.vue'], resolve)
        },
        {
          path: '/help/feedback',
          name: 'Feedback',
          component: resolve => require(['../components/help/feedback.vue'], resolve)
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: resolve => require(['../components/Login.vue'], resolve)
    },
    {
      path: '/register',
      name: 'Register',
      component: resolve => require(['../components/Register.vue'], resolve)
    },
    {
      path: '/404',
      name: '404',
      component: resolve => require(['../components/404.vue'], resolve)
    }
  ]
})
