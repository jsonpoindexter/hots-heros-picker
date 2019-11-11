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
    userId(store, userId: string) {
      store.userId = userId
      localStorage.setItem('userId', userId)
    },
    sessionId(store, sessionId: string) {
      store.sessionId = sessionId
      // Send event to join specific session
      // @ts-ignore
      // this._vm.$socket.client.emit('session', sessionId)
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
    addPlayer({ players, userId, sessionId }, player) {
      players.push(player)
    },
  },
  actions: {
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
        this._vm.$socket.client.emit('updatePlayerName', { sessionId, id: user.id, name: user.name })
        localStorage.setItem('username', payload.name)
      }
    },
    // Select team color
    updateTeam({ commit, state: {sessionId},  getters: { user } }, payload: { id: string; team: Team }) {
      commit('team', payload)
      if (payload.id === user.id) {
        // @ts-ignore
        this._vm.$socket.client.emit('updatePlayerTeam', { sessionId, id: user.id, team: user.team })
      }
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
