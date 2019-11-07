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
    user: { name: 'muffinsticks', team: Team.red, selectedId: 0, bannedIds: [] },
    players: [
      { name: 'flippy', team: Team.blue, selectedId: 1, bannedIds: [] },
      { name: 'NoG0D', team: Team.blue, selectedId: 24, bannedIds: [] },
      { name: 'terminator', team: Team.red, selectedId: 15, bannedIds: [] },
      { name: 'spudly42', team: Team.blue, selectedId: 4, bannedIds: [] },
      { name: 'rgam42', team: Team.blue, selectedId: 8, bannedIds: [] },
      { name: 'pattykakes42', team: Team.blue, selectedId: 45, bannedIds: [] },
      { name: 'loser', team: Team.blue, selectedId: 29, bannedIds: [] },
    ],
  },
  mutations: {
    selectHero({ user }, heroId: number) {
      user.selectedId = user.selectedId === heroId ? null : heroId
    },
    banHero({user: { bannedIds }}, heroId: number) {
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
    updateSelected({ getters: { bannedHeroIds}, commit, state: { heros, user, players } }, heroId: number) {
      // Check if User is trying to select a hero thas has been selected by another player
      const otherPlayerHeros = players.map((player: Player) => player.selectedId)
      if (otherPlayerHeros.includes(heroId)) return
      bannedHeroIds.includes(heroId) ? commit('banHero', heroId) : commit('selectHero', heroId)

      const url = `/hero/select/${heros[heroId].urlName}/`
      user.selectedId ? instance.post(url) : instance.delete(url)
    },
    // Ban / UnBan heros
    updateBanned({ commit, state: { heros } }, heroId: number) {
      commit('banHero', heroId)
      const hero = heros[heroId]
      const url = `/hero/ban/${hero.urlName}/`
      heroId ? instance.post(url) : instance.delete(url)
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
