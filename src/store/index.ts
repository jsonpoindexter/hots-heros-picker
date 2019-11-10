import { Hero, Player, SelectPayload, Team } from '@/store/types'
import { defaultHeros } from '@/variables'
import uuid from 'uuid/v4'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

interface RootState {
  sessionId: string
  heros: Hero[]
  user: Player
  players: Player[]
}

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
      // Send event to join specific session
      // @ts-ignore
      this._vm.$socket.client.emit('session', sessionId)
    },
    username({ user, sessionId }, username: string) {
      user.name = username
      if (user.name && user.team !== null) {
        // @ts-ignore
        this._vm.$socket.client.emit('addPlayer', { sessionId, name: user.name, team: user.team })
      }
      localStorage.setItem('username', username)
    },
    team({ user, sessionId }, team: Team) {
      if (user) user.team = team
      if (user.name && user.team !== null) {
        // @ts-ignore
        this._vm.$socket.client.emit('addPlayer', { sessionId, name: user.name, team: user.team })
      }
    },
    selectHero({ user }, heroId: number) {
      user.selectedId = user.selectedId === heroId ? null : heroId
    },
    banHero({ user: { bannedIds } }, heroId: number) {
      const index = bannedIds.findIndex((id: number) => id === heroId)
      index >= 0 ? bannedIds.splice(index, 1) : bannedIds.push(heroId)
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
    addPlayer({players}, player) {
      players.push(player)
    }
  },
  actions: {
    // Select team color
    updateTeam(context: any, team: Team) {
      // context.commit('resetUserSelected')
      context.commit('team', team)
      // client.post(`/player/team/${Team[team]}`)
    },

    // Select / Deselect heros
    updateSelected({ getters: { bannedHeroIds }, commit, state: { heros, user, players } }, heroId: number) {
      // Check if User is trying to select a hero that has been selected by another player
      if (players.map((player: Player) => player.selectedId).includes(heroId)) return
      // Check if User is trying to ban a hero that has been selected by another player
      if (players.flatMap((player: Player) => player.bannedIds).includes(heroId)) return
      user.bannedIds.includes(heroId) ? commit('banHero', heroId) : commit('selectHero', heroId)

      // const url = `/hero/select/${heros[heroId].urlName}/`
      // user.selectedId ? client.post(url) : client.delete(url)
    },
    // Ban / UnBan heros
    updateBanned({ commit, state: { heros, players }, getters: { bannedHeroIds } }, heroId: number) {
      if (players.flatMap((player: Player) => player.bannedIds).includes(heroId)) return
      commit('banHero', heroId)
      const hero = heros[heroId]
      const url = `/hero/ban/${hero.urlName}/`
      // heroId ? client.post(url) : client.delete(url)
    },
    // Delete current draft session
    resetSession(context: any) {
      context.commit('resetHeros')
      // TODO: handle refresh and update session when deleted
      // client.delete('/')
    },
    // TODO: handle if username already exists
    updateUsername(context, username: string) {
      context.commit('username', username)
      // client.post(`/user/${username}`)
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
    sessionId({sessionId}) {
      return sessionId
    }
  },
})
