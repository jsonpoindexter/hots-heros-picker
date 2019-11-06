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
  user: Player
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
    user: { name: 'muffinsticks', team: Team.red, selectedId: 0 },
    players: [{ name: 'foo', team: Team.blue, selectedId: 1 }, { name: 'boo', team: Team.blue, selectedId: 2 }, { name: 'woo', team: Team.red, selectedId: 3 }],
  },
  mutations: {
    selectHero({ user, heros }, heroId: number) {
      user.selectedId = user.selectedId === heroId ? null : heroId
    },
    team({ user }, team: Team) {
      if (user) user.team = team
    },
    resetHeros({ user, heros }) {
      if (user) user.selectedId = null
      heros = JSON.parse(JSON.stringify(defaultHeros))
    },
    resetUserSelected({ user, heros }) {
      if (user && user.selectedId) {
        user.selectedId = null
      }
    },
    username({ user }, username: string) {
      if (user) user.name = username
    },
  },
  actions: {
    // Select team color
    updateTeam(context: any, team: Team) {
      // context.commit('resetUserSelected')
      context.commit('team', team)
      instance.post(`/player/team/${Team[team]}`)
    },

    // Select / Deselect heros
    updateSelected({ getters, commit, state: { heros, user, players } }, heroId: number) {
      // Check if User is trying to select a hero thas has been selected by another player
      const otherPlayerHeros = players.map((player: Player) => player.selectedId)
      if (otherPlayerHeros.includes(heroId)) return
      commit('selectHero', heroId)
      const url = `/hero/select/${heros[heroId].urlName}/`
      user.selectedId ? instance.post(url) : instance.delete(url)
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
      return (user && user.selectedId && heros[user.selectedId]) || null
    },
    players({ user, players }) {
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
