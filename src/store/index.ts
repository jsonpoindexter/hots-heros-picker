import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { Hero, Payload, Player, Team } from '@/store/types'
import { defaultHeros } from '@/variables'

Vue.use(Vuex)

const instance = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  timeout: 1000,
})

interface RootState {
  session: string
  heros: Hero[]
  user: Player | null
  players: Player[]
}

// Selecting \ Lockout
// Team Color
// Support ban
export default new Vuex.Store<RootState>({
  state: {
    // Draft session
    session: '',
    heros: JSON.parse(JSON.stringify(defaultHeros)),
    user: { name: 'muffinsticks', team: Team.red, selectedId: null },
    players: [],
  },
  mutations: {
    selected({ user, heros}, heroId: number) {
      heros[heroId].selected = !heros[heroId].selected
      // Reset user selected if 'false'
      user!.selectedId = heros[heroId].selected ? heroId : null
    },
    team({ user }, team: Team) {
      if (user) user.team = team
    },
    resetHeros({user, heros}) {
      if (user) user.selectedId = null
      heros = JSON.parse(JSON.stringify(defaultHeros))
    },
    resetUserSelected({user, heros}) {
      if (user && user.selectedId) {
        heros[
          heros.findIndex((hero: Hero) => {
            // @ts-ignore
            return hero.urlName === selected.urlName
          })
        ].selected = false
        user.selectedId = null
      }
    },
    username({user}, username: string) {
      if (user) user.name = username
    },
  },
  actions: {
    // Select team color
    updateTeam(context: any, team: Team) {
      context.commit('resetUserSelected')
      context.commit('team', team)
      instance.post(`/player/team/${Team[team]}`)
    },

    // Select / Deselect heros
    updateSelected({getters, commit}, heroId: number) {
      // Only allow one selection of hero
      if (getters.selectedHero && getters.selectedHero.selected) {
        return
      }
      commit('selected', heroId)
      const url = `/hero/select/${getters.selectedHero.urlName}/`
      getters.selectedHero.selected ? instance.post(url) : instance.delete(url)
    },
    // Ban / UnBan heros
    updateBanned(context: any, payload: Payload) {
      const url = `/hero/ban/${payload.urlName}/`
      payload.value ? instance.post(url) : instance.delete(url)
    },
    // Delete current draft session
    resetSession(context: any) {
      context.commit('resetHeros')
      // TODO: handle refresh and update session when deleted
      instance.delete('/')
    },
    // TODO: handle if username already exists
    updateUsername(context, username: string) {
      context.commit('username', username)
      instance.post(`/user/${username}`)
    },
  },
  modules: {},
  getters: {
    // hero that the User has selcted
    selectedHero({ user, heros }) {
      return user && user.selectedId && heros[user.selectedId] || null
    },
    players({user, players}) {
      return [user, ...players]
    },
    // redPlayers() {
    //   return players.filter((player: Player) => {
    //     return player.team === Team.red
    //   })
    // },
    // bluePlayers() {
    //   return players.filter((player: Player) => {
    //     return player.team === Team.blue
    //   })
    // },
  },
})
