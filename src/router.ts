import App from '@/App.vue'
import { client } from '@/client'
import { Player } from '@/store/types'
import uuid from 'uuid/v4'
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    component: App,
    props: true,
    beforeEnter: async (to: any, from: any, next: any) => {
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
      store.commit('sessionId', to.params.sessionId)
      if (!store.state.userId) store.commit('userId', uuid())
      try {
        const session = (await client.get(`/${to.params.sessionId}`)).data
        console.log('session: ', session)
        await store.dispatch('initPlayers', session.players)
      } catch (err) {
        // tslint:disable-next-line:no-console
        console.log(err)
      }
      next()
    },
  },
]
export default new VueRouter({ mode: 'history', routes })
