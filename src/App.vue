<template>
  <div id="app">
    <h1 style="user-select: none;">HoTS Draft Picker</h1>
    <ControlPanel></ControlPanel>
    <TeamPanel />
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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Hero from '@/components/Hero.vue'
import TeamPanel from '@/components/Team/index.vue'
import ControlPanel from '@/components/ControlPanel.vue'
import { Player, Team } from '@/store/types'
import { Socket } from 'vue-socket.io-extended'
@Component({
  components: {
    ControlPanel,
    Hero,
    TeamPanel,
  },
})
export default class App extends Vue {
  @Socket()
  get heros() {
    return this.$store.state.heros
  }

  get selectedHerosId() {
    // let selectedHeroIds: number[] = []
    // this.$store.getters.players.forEach((player: Player) => {
    //  if( player.selectedId) selectedHeroIds.push(player.selectedId)
    // })
    // console.log(selectedHeroIds)
    // return selectedHeroIds
    return this.$store.getters.players.map((player: Player) => player.selectedId)
  }

  get hasUsername() {
    return !!(this.$store.state.user ? this.$store.state.user.name : '')
  }
  // Has filled out username and picked a team
  get hasMinData() {
    return this.hasUsername && this.team
  }

  get team() {
    return this.$store.state.user.team !== null
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.heros {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 100px;
}
</style>
