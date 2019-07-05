import Vue from 'vue'
import VueI18n from 'vue-i18n'
import locale from 'element-ui/lib/locale'
import customZhCn from './lang/zh-cn'
import customZhTw from './lang/zh-tw'
import customEnUs from './lang/en'
import zhCnLocale from 'element-ui/lib/locale/lang/zh-CN'
import zhTwLocale from 'element-ui/lib/locale/lang/zh-TW'
import enUsLocale from 'element-ui/lib/locale/lang/en'

Vue.use(VueI18n)

// 自动根据浏览器系统语言设置语言
const navLang = navigator.language
// console.log(navLang) // zh-CN
const localLang = (navLang === 'zh-cn' || navLang === 'en') ? navLang : false
let lang = window.localStorage.lang || localLang || 'zh-cn'
Vue.config.lang = lang

// vue-i18n 6.x+写法
// Vue.locale = () => {}
const messages = {
  'zh-cn': Object.assign(zhCnLocale, customZhCn),
  'zh-tw': Object.assign(zhTwLocale, customZhTw),
  'en': Object.assign(enUsLocale, customEnUs)
}
const i18n = new VueI18n({
  locale: lang,
  messages
})

locale.i18n((key, value) => i18n.t(key, value)) // 为了实现element插件的多语言切换

export default i18n

// vue-i18n 5.x写法
// Vue.locale('zh-CN', Object.assign(zhCnLocale, customZhCn))
// Vue.locale('en-US', Object.assign(zhTwLocale, customZhTw))
// Vue.locale('zh-TW', Object.assign(enUsLocale, customEnUs))
