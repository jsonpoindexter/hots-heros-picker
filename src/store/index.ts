import { client } from '@/client'
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { Hero, Player, Team } from '@/store/types'
import { defaultHeros } from '@/variables'

Vue.use(Vuex)

interface RootState {
  sessionId: string
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
    sessionId: '',
    heros: JSON.parse(JSON.stringify(defaultHeros)),
    user: { name: localStorage.getItem('username') || '', team: null, selectedId: null, bannedIds: [] },
    players: [],
  },
  mutations: {
    sessionId(store, sessionId: string) {
      store.sessionId = sessionId
    },
    selectHero({ user }, heroId: number) {
      user.selectedId = user.selectedId === heroId ? null : heroId
    },
    banHero({ user: { bannedIds } }, heroId: number) {
      const index = bannedIds.findIndex((id: number) => id === heroId)
      index >= 0 ? bannedIds.splice(index, 1) : bannedIds.push(heroId)
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
      localStorage.setItem('username', username)
      if (user) user.name = username
    },
  },
  actions: {
    // Select team color
    updateTeam(context: any, team: Team) {
      // context.commit('resetUserSelected')
      context.commit('team', team)
      client.post(`/player/team/${Team[team]}`)
    },

    // Select / Deselect heros
    updateSelected({ getters: { bannedHeroIds }, commit, state: { heros, user, players } }, heroId: number) {
      // Check if User is trying to select a hero that has been selected by another player
      if (players.map((player: Player) => player.selectedId).includes(heroId)) return
      // Check if User is trying to ban a hero that has been selected by another player
      if (players.flatMap((player: Player) => player.bannedIds).includes(heroId)) return
      user.bannedIds.includes(heroId) ? commit('banHero', heroId) : commit('selectHero', heroId)

      const url = `/hero/select/${heros[heroId].urlName}/`
      user.selectedId ? client.post(url) : client.delete(url)
    },
    // Ban / UnBan heros
    updateBanned({ commit, state: { heros, players }, getters: { bannedHeroIds } }, heroId: number) {
      if (players.flatMap((player: Player) => player.bannedIds).includes(heroId)) return
      commit('banHero', heroId)
      const hero = heros[heroId]
      const url = `/hero/ban/${hero.urlName}/`
      heroId ? client.post(url) : client.delete(url)
    },
    // Delete current draft session
    resetSession(context: any) {
      context.commit('resetHeros')
      // TODO: handle refresh and update session when deleted
      client.delete('/')
    },
    // TODO: handle if username already exists
    updateUsername(context, username: string) {
      context.commit('username', username)
      client.post(`/user/${username}`)
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
    bannedHeroIds(state, getters) {
      return getters.players.flatMap((player: Player) => {
        return player.bannedIds
      })
    },
    redPlayers(state, getters) {
      return getters.players.filter((player: Player) => {
        return player.team === Team.red
      })
    },
    bluePlayers(state, getters) {
      return getters.players.filter((player: Player) => {
        return player.team === Team.blue
      })
    },
  },
})
