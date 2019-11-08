import Vue from 'vue'
import App from './App.vue'
import store from './store'
import VueSocketIOExt from 'vue-socket.io-extended'
import io from 'socket.io-client'

const socket = io(':8081')
Vue.use(VueSocketIOExt, socket)

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App),
}).$mount('#app')
