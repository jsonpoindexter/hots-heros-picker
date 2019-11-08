import App from '@/App.vue'
import { client } from '@/client'
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'
import VueSocketIOExt from 'vue-socket.io-extended'
import io from 'socket.io-client'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: App,
    beforeEnter: async (to: any, from: any, next: (arg0: string) => void) => {
      try {
        const sessionId = (await client.get('/')).data
        if (sessionId) {
          store.commit('sessionId', sessionId)
          next(`/${sessionId}`)
        }
      } catch (err) {
        // TODO add route handling for no sessionId
        // tslint:disable-next-line:no-console
        console.log(err)
      }
    },
  },
  {
    path: '/:sessionId',
    component: App,
    beforeEnter: async (to: any, from: any, next: () => void) => {
      try {
        const sessionId = (await client.post(`session/${to.params.sessionId}`)).data
        if (sessionId) {
          const socket = io(`:8081/${sessionId}`)
          Vue.use(VueSocketIOExt, socket)
        }
      } catch (err) {
        // TODO add route handling for no sessionId
        // tslint:disable-next-line:no-console
        console.log(err)
      }
      next()
    },
  },
]
export default new VueRouter({ mode: 'history', routes })
