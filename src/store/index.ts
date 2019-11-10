import { Hero, Player, SelectPayload, Team } from '@/store/types'
import { defaultHeros } from '@/variables'
import uuid from 'uuid/v4'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

interface RootState {
  sessionId: string
  userId: string
  heros: Hero[]
  players: Player[]
}

export default new Vuex.Store<RootState>({
  state: {
    // Draft session
    sessionId: '',
    userId: localStorage.getItem('userId') || '',
    heros: JSON.parse(JSON.stringify(defaultHeros)),
    players: [],
  },
  mutations: {
    userId(store, userId: string) {
      store.userId = userId
      localStorage.setItem('userId', userId)
    },
    sessionId(store, sessionId: string) {
      store.sessionId = sessionId
      // Send event to join specific session
      // @ts-ignore
      this._vm.$socket.client.emit('session', sessionId)
    },
    username({ userId, players, sessionId }, payload: { id: string; username: string }) {
      const user = players.find((player: Player) => player.id === payload.id)
      if (!user) return
      user.name = payload.username
      if (user.name && user.team !== null) {
        // TODO: add User to players
        // @ts-ignore
        this._vm.$socket.client.emit('addPlayer', { sessionId, id: user.id, name: user.name, team: user.team })
      }
      localStorage.setItem('username', payload.username)
    },
    team({ userId, players, sessionId }, team: Team) {
      const user = players.find((player: Player) => player.id === userId)
      if (!user) return
      if (user) user.team = team
      if (user.name && user.team !== null) {
        // @ts-ignore
        this._vm.$socket.client.emit('addPlayer', { sessionId, id: user.id, name: user.name, team: user.team })
      }
    },
    selectHero({ userId, players }, heroId: number) {
      const user = players.find((player: Player) => player.id === userId)
      if (!user) return
      user.selectedId = user.selectedId === heroId ? null : heroId
    },
    banHero({ userId, players }, heroId: number) {
      const user = players.find((player: Player) => player.id === userId)
      if (!user) return
      const index = user.bannedIds.findIndex((id: number) => id === heroId)
      index >= 0 ? user.bannedIds.splice(index, 1) : user.bannedIds.push(heroId)
    },

    resetHeros({ userId, players, heros }) {
      const user = players.find((player: Player) => player.id === userId)
      if (!user) return
      if (user) user.selectedId = null
      heros = JSON.parse(JSON.stringify(defaultHeros))
    },
    resetUserSelected({ userId, players, heros }) {
      const user = players.find((player: Player) => player.id === userId)
      if (!user) return
      if (user && user.selectedId) {
        user.selectedId = null
      }
    },
    addPlayer({ players }, player) {
      players.push(player)
    },
  },
  actions: {
    updateUsername(context, payload: { id: string; username: string }) {
      context.commit('username', payload)
    },
    // Select team color
    updateTeam(context, payload: { id: string; team: Team }) {
      context.commit('team', payload)
    },
    // Select / Deselect heros
    updateSelected({ commit, state: { heros, players }, getters: { user } }, payload: SelectPayload) {
      // Check if User is trying to select a hero that has been selected by another player
      if (players.map((player: Player) => player.selectedId).includes(payload.heroId)) return
      // Check if User is trying to ban a hero that has been selected by another player
      if (players.flatMap((player: Player) => player.bannedIds).includes(payload.heroId)) return
      user.bannedIds.includes(payload.heroId) ? commit('banHero', payload.heroId) : commit('selectHero', payload.heroId)

      // const url = `/hero/select/${heros[heroId].urlName}/`
      // user.selectedId ? client.post(url) : client.delete(url)
    },
    // Ban / UnBan heros
    updateBanned({ commit, state: { heros, players }, getters: { bannedHeroIds } }, heroId: number) {
      if (players.flatMap((player: Player) => player.bannedIds).includes(heroId)) return
      commit('banHero', heroId)
      const hero = heros[heroId]
      // const url = `/hero/ban/${hero.urlName}/`
      // heroId ? client.post(url) : client.delete(url)
    },
    // Delete current draft session
    resetSession(context: any) {
      context.commit('resetHeros')
      // TODO: handle refresh and update session when deleted
      // client.delete('/')
    },
  },
  modules: {},
  getters: {
    user({ userId, players }) {
      return players.find((player: Player) => player.id === userId)
    },
    // hero that the User has selcted
    selectedHero({ heros }, { user }) {
      return (user && user.selectedId && heros[user.selectedId]) || null
    },
    players({ players }) {
      return players.filter((player: Player) => player.name)
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
    sessionId({ sessionId }) {
      return sessionId
    },
  },
})
