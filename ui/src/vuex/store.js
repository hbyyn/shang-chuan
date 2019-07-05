import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
var state = {
  language: 'zh-cn',
  languageArr: [
    {
      value: 'zh-cn',
      label: '简体'
    },
    {
      value: 'zh-tw',
      label: '繁体'
    },
    {
      value: 'en',
      label: 'English'
    }
  ]
}

var mutations = {
  changeLanguage (state, payload) {
    state.language = payload.amount
  }
}

const store = new Vuex.Store({
  state,
  mutations
})

export default store
