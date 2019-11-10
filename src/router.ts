import App from '@/App.vue'
import { client } from '@/client'
import { Player } from '@/store/types'
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
      try {
        const session = (await client.get(`/${to.params.sessionId}`)).data
        // tslint:disable-next-line:no-console
        console.log(`retrieved session: `, session)
        session.players.forEach((player: Player) => {
          if (player.name !== store.state.user.name) store.commit('addPlayer', player)
        })
      } catch (err) {
        // tslint:disable-next-line:no-console
        console.log(err)
      }
      store.commit('sessionId', to.params.sessionId)
      next()
    },
  },
]
export default new VueRouter({ mode: 'history', routes })
