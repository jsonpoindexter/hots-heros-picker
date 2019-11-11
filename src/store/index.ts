import { Hero, Player, PlayerNamePayload, SelectPayload, Team } from '@/store/types'
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
    sessionId(store, sessionId: string) {
      store.sessionId = sessionId
      // Send event to join specific session
      // @ts-ignore
      this._vm.$socket.client.emit('session', sessionId)
    },
    userId(store, userId: string) {
      store.userId = userId
      localStorage.setItem('userId', userId)
    },
    addPlayer({ players, userId, sessionId }, player) {
      players.push(player)
    },
    playerName({ userId, players, sessionId }, payload: { id: string; name: string }) {
      const user = players.find((player: Player) => player.id === payload.id)
      if (!user) return
      user.name = payload.name
    },
    team({ players, sessionId }, payload: { id: string; team: Team }) {
      const user = players.find((player: Player) => player.id === payload.id)
      if (!user) return
      user.team = payload.team
    },
    selectHero({ userId, players }, payload: { id: string, heroId: number}) {
      const user = players.find((player: Player) => player.id === payload.id)
      if (!user) return
      // Toggle selected
      user.selectedId = user.selectedId === payload.heroId ? null : payload.heroId
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
  },
  actions: {
    // Add current players (and self) when connecting to a new session
    initPlayers({ commit, state: { players, userId, sessionId } }, playersPayload: Player[]) {
      // A. no current players in session: add ourselves to players and emit socket event
      // B. current players in session
      //  1. We are in players: add all players, emit no events
      //  2. We are not in players: add all players, add ourselves to players, emit event
      // If we aren't included in current session Players, add ourselves
      // If we aren't included in current session Players, add ourselves
      if (!playersPayload.flatMap((player: Player) => player.id).includes(userId)) {
        playersPayload.forEach((player: Player) => {
          players.push(player)
        })
        // Add ourselves to players and emit
        const user: Player = {
          bannedIds: [],
          id: userId,
          name: localStorage.getItem('username') || '',
          selectedId: null,
          team: null,
        }
        players.push(user)
        // @ts-ignore
        this._vm.$socket.client.emit('addPlayer', {
          sessionId,
          bannedIds: user.bannedIds,
          id: user.id,
          name: user.name,
          selectedId: user.selectedId,
          team: user.team,
        })
      } else {
        playersPayload.forEach((player: Player) => {
          commit('addPlayer', player)
        })
      }
    },
    updatePlayerName({ commit, state: { sessionId }, getters: { user } }, payload: PlayerNamePayload) {
      // Update username
      commit('playerName', payload)
      if (payload.id === user.id) {
        // @ts-ignore
        this._vm.$socket.client.emit('updatePlayerName', { sessionId, id: payload.id, name: payload.name })
        localStorage.setItem('username', payload.name)
      }
    },
    // Select team color
    updateTeam({ commit, state: {sessionId},  getters: { user } }, payload: { id: string; team: Team }) {
      commit('team', payload)
      if (payload.id === user.id) {
        // @ts-ignore
        this._vm.$socket.client.emit('updatePlayerTeam', { sessionId, id: payload.id, team: payload.team })
      }
    },
    // Select / Deselect heros
    updateSelected({ commit, state: { sessionId, heros, players, userId }, getters: { user } }, payload: SelectPayload) {
      commit('selectHero', payload)
      if (payload.id === user.id) {
        // @ts-ignore
        this._vm.$socket.client.emit('updateSelectedHero', { sessionId, id: payload.id, heroId: payload.heroId })
      }

    },
    // Ban / UnBan heros
    updateBanned({ commit, state: { heros, players }, getters: { bannedHeroIds } }, heroId: number) {
      if (players.flatMap((player: Player) => player.bannedIds).includes(heroId)) return
      commit('banHero', heroId)
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
