// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import './config/rem'
import store from './store/'
Vue.config.productionTip = false
window.Bmob = require('../static/Bmob-1.6.3.min.js');
Bmob.initialize(
	"789f6711a42cb8e61a5dde589b559e69",
	"55e875d5e5ef1476762ad60c5baeacc6",
	"841b8167851edfafc48ec9a7835d33b7"
);
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
