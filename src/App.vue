<template>
  <div id="app">
    <h1 style="user-select: none;">HoTS Draft Picker</h1>
    <ControlPanel></ControlPanel>
    <TeamPanel />
    <div class="heros-wrapper">
      <div class="heros">
        <Hero
          v-for="(hero, index) in heros"
          :name="hero.name"
          :url-name="hero.urlName"
          :selected="selectedHerosId.includes(index)"
          :disabled="!hasMinData"
          :heroId="index"
          :key="hero.name"
        />
      </div>
      <div v-show="!hasMinData" class="disable-overlay"><p>Username & Team must be filled out</p></div>
    </div>
  </div>
</template>

<script lang="ts">
import ControlPanel from '@/components/ControlPanel.vue'
import Hero from '@/components/Hero.vue'
import TeamPanel from '@/components/Team/index.vue'
import { Player, Team } from '@/store/types'
import { Component, Vue } from 'vue-property-decorator'
import VueSocketIOExt, { Socket } from 'vue-socket.io-extended'
@Component({
  components: {
    ControlPanel,
    Hero,
    TeamPanel,
  },
})
export default class App extends Vue {
  public created() {
    this.$socket.$subscribe('addPlayer', (payload: { id: string; name: string; team: string }) => {
      console.log('addPlayer ', payload)
      this.$store.commit('addPlayer', payload)
    })
    this.$socket.$subscribe('updatePlayerName', (payload: { id: string; name: string }) => {
      console.log('updatePlayerName ', payload)
      this.$store.dispatch('updatePlayerName', payload)
    })
    this.$socket.$subscribe('updatePlayerTeam', (payload: { id: string; team: Team }) => {
      console.log('updatePlayerTeam ', payload)
      this.$store.dispatch('updateTeam', payload)
    })
    this.$socket.$subscribe('updateSelectedHero', (payload: { id: string; heroId: number }) => {
      console.log('updateSelectedHero ', payload)
      this.$store.dispatch('updateSelected', payload)
    })
    this.$socket.$subscribe('updateBannedHero', (payload: { id: string; heroId: number }) => {
      console.log('updateBannedHero ', payload)
      this.$store.dispatch('updateBanned', payload)
    })
  }
  get heros() {
    return this.$store.state.heros
  }

  get selectedHerosId() {
    return this.$store.getters.players.map((player: Player) => player.selectedId)
  }

  get hasUsername() {
    return !!(this.$store.getters.user ? this.$store.getters.user.name : '')
  }
  // Has filled out username and picked a team
  get hasMinData() {
    return this.hasUsername && this.team
  }

  get team() {
    return this.$store.getters.user.team !== null
  }
}
</script>

<style lang="scss">
body {
  margin: 0;
  padding: 0;
  background: darkgrey;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.heros-wrapper {
  position: relative;
  padding: 50px;
}
.heros {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}
.disable-overlay {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: absolute;
  padding: 0;
  background-color: rgba(0, 0, 0, 0.9);
  color: lightgray;
}
.disable-overlay p {
  user-select: none;
  margin-top: 250px;
  font-size: 36px;
  font-weight: bolder;
}
</style>
