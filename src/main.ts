import io from 'socket.io-client'
import Vue from 'vue'
import VueSocketIOExt from 'vue-socket.io-extended'
import App from './App.vue'
import router from './router'
import store from './store'

const socket = io(`:8081/`)
Vue.use(VueSocketIOExt, socket, { store })

Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App),
}).$mount('#app')
