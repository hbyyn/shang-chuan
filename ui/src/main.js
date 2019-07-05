// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import i18n from './locale/index'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router'
import axios from 'axios'
import store from './vuex/store'
import storage from './api/storage'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.snow.css'

import './assets/css/iconfont.css' /*引入图标*/
import './assets/css/xmy.css' /*引入公共样式*/
import VueAwesomeSwiper from 'vue-awesome-swiper'
import 'swiper/dist/css/swiper.css'
//图片展示
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'
Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 9999
  }
})
Viewer.setDefaults({
  Options: {
    'inline': true, // 启用 inline 模式
    'button': true, // 显示右上角关闭按钮
    'navbar': true, // 显示缩略图导航
    'title': true, // 显示当前图片的标题
    'toolbar': true, // 显示工具栏
    'tooltip': true, // 显示缩放百分比
    'movable': true, // 图片是否可移动
    'zoomable': true, // 图片是否可缩放
    'rotatable': true, // 图片是否可旋转
    'scalable': true, // 图片是否可翻转
    'transition': true, // 使用 CSS3 过度
    'fullscreen': true, // 播放时是否全屏
    'keyboard': true, // 是否支持键盘
    'url': 'data-source' // 设置大图片的 url
  }
})
Vue.use(VueAwesomeSwiper)
//element Dialog 拖拽功能、大小改变功能
import './api/directives.js'
// import Blob from './excel/Blob.js'
// import Export2Excel from './excel/Export2Excel.js'
// if(MAP_TYPE!==0){
	let createMap = () => {
		const promise = new Promise(function(resolve, reject) {
			let script = document.createElement('script')
			script.type = 'text/javascript'
			script.id = 'mapsApi'
			document.body.appendChild(script)
			script.onload = function() {
				// console.log("加载完毕");
				if (script.nodeName === 'SCRIPT') {
					resolve()
				} else {
					reject(new Error('Could not script image at ' + script.src))
				}
			}
			if (MAP_TYPE == 1) {
				script.src = 'https://webapi.amap.com/maps?v=1.4.12&key=55c946e54db85b15aa34c9037f8ed115&plugin=AMap.Driving' // 高德地图
			} else if (MAP_TYPE == 2) {
				//en-US zh-CN zh-TW
				if(localStorage.getItem("languageType")){
					script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDtxkNkKLY-PRQe6gMidyyPAKrRAWgBBhI&language='+localStorage.getItem("languageType") //谷歌地图
				}else{
					script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDtxkNkKLY-PRQe6gMidyyPAKrRAWgBBhI' //谷歌地图
				}
			}
		})
		return promise
	}
	createMap().then(function() {
		console.log('读取地图成功')
		// 加載當前的ip定位
	}).catch(function(error) {
		// 处理 getJSON 和 前一个回调函数运行时发生的错误
		console.log('发生错误！', error)
	})
// }


Vue.prototype.$axios = axios
Vue.prototype.storage = storage
Vue.config.productionTip = false
Vue.use(ElementUI, {
	size: 'small',
	zIndex: 3000
})
// Vue.config.lang = 'zh-cn'
Vue.use(ElementUI, {
	i18n: (key, value) => i18n.t(key, value)
});
Vue.use(VueQuillEditor);

axios.interceptors.response.use(function (res) {
  // 账号在其他地方登录
  if (res.data.statusCode == '405') {
    router.push({
      path: '/login',
      query: {
        code: 405
      }
    });
    sessionStorage.removeItem('loginPrefix');
    sessionStorage.removeItem('loginToken');
    sessionStorage.removeItem('user_name')
    sessionStorage.removeItem('remember')
  }
  return res;
}, function (error) {
  // 对响应错误做点什么
  router.push({
    path: '/login'
  });
  ElementUI.Message({
    message: 'Service failure',
    type: 'error'
  });
  return Promise.reject(error);
});
router.beforeEach((to, from, next) => {
	const role = sessionStorage.getItem('user_name')

	if (!role && to.path !== '/login' && to.path !== '/register') {
		next('/login')
	} else if (to.matched.length === 0) {
		next('/404')
	} else {
		next()
	}
	// console.log(navigator.onLine)
})
/* eslint-disable no-new */
new Vue({
	el: '#app',
	i18n,
	router,
	data: {
		Bus: new Vue()
	},
	store,
	components: {
		App
	},
	template: '<App/>'
})

