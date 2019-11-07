<template>
  <div @click="onSelect">
    <div
      class="HeroItem-container"
      :class="{ disabled: disabled || selected || banned }"
      :style="{ background: selected ? Team[player.team] : null, color: selected ? 'white' : null }"
    >
      <div class="CircleIcon">
        <a>
          <img
            alt="hero image"
            :class="{ disabled: disabled }"
            :src="
              'https://static.heroesofthestorm.com/gd/3a87a62680f43b26f7dd3d203b77e8cd/heroes/' +
                urlName +
                '/circleIcon.png'
            "
          />
        </a>
      </div>
      <h5 class="HeroName-text"> {{ name }} </h5>
      <div v-show="disabled" class="disable-overlay"></div>
      <div v-show="selected && player" class="selected-overlay">{{ player ? player.name  : null}}</div>
      <div v-show="$store.getters.bannedHeroIds.includes(heroId)" class="disable-overlay">
        <span style="color: lightgray">{{ player ? player.name  : null}}</span>
        <span class="banned-text">BANNED</span>
      </div>
      <div v-if="!selected && !banned" class="banIcon" @click="onBan">BAN</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Player, Team } from '@/store/types'

@Component
export default class Hero extends Vue {
  @Prop() private name!: string
  @Prop() private urlName!: string
  @Prop() private selected!: boolean
  @Prop() private disabled!: boolean
  @Prop() private heroId!: number
  private onSelect() {
    if (!this.disabled) {
      this.$store.dispatch('updateSelected', this.heroId)
    }
  }

  get banned() {
    return this.$store.getters.bannedHeroIds.includes(this.heroId)
  }

  private onBan(event: Event) {
    event.stopPropagation()
    this.$store.dispatch('updateBanned', this.heroId)
  }

  get player() {
    return this.$store.getters.players.find((player: Player) => {
      return player.selectedId === this.heroId || player.bannedIds.includes(this.heroId)
    })
  }

  get Team() {
    return Team
  }
}
</script>

<style scoped lang="css">
.banIcon {
  padding: 2px 4px;
  right: 0;
  top: 0;
  position: absolute;
  border: 1px solid gray;
  z-index: 99;
}
.banIcon:hover {
  color: white;
  background: #2c3e50;
}

.HeroItem-container .banIcon {
   visibility: hidden;
 }
.HeroItem-container:hover .banIcon {
  visibility: visible;
}
.banned-text {
  position: absolute;
  left: 0;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
  color: white;
}
.disabled {
  pointer-events: none;
}
.disable-overlay {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: absolute;
  padding: 0;
  background-color: rgba(0, 0, 0, 0.5);
    color: lightgray;
}
.selected-overlay {
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: absolute;
  padding: 0;
  background-color: rgba(0, 0, 0, 0.1);
  color: lightgray;
}
.selected {
  background-color: rgba(0,0,0,.5);
}
.HeroItem-container {
  margin: 10px;
  user-select: none;
  text-align: center;
  position: relative;
  width: 105px;
  -webkit-transition-duration: 0.2s;
   transition-duration: 0.2s;
}
.HeroItem-container.inactive {
  opacity: 0.4;
}

.HeroItem-container {
  width: 150px;
}
.HeroItem-container:hover .CircleIcon a img{
  opacity: 1;
}
.HeroItem-container:hover .CircleIcon a::after {
  background-color: rgba(0, 128, 255, 0.1);
  background-image: -webkit-gradient(
    linear,
    left bottom,
    left top,
    from(rgba(71, 153, 235, 0.6)),
    color-stop(40%, rgba(71, 153, 235, 0))
  );
  background-image: linear-gradient(
    to top,
    rgba(71, 153, 235, 0.6) 0%,
    rgba(71, 153, 235, 0) 40%
  );
  -webkit-box-shadow: inset 0px 0px 10px 2px rgba(0, 128, 255, 0.5);
  box-shadow: inset 0px 0px 10px 2px rgba(0, 128, 255, 0.5);
  border: 2px solid rgba(51, 128, 204, 0.8);
}
/*.HeroItem-container:hover .CircleIcon.selected a::after {*/
/*  background: none;*/
/*  background-image: -webkit-gradient(*/
/*    linear,*/
/*    left bottom,*/
/*    left top,*/
/*    from(rgba(71, 153, 235, 0.5)),*/
/*    color-stop(30%, rgba(71, 153, 235, 0))*/
/*  );*/
/*  background-image: linear-gradient(*/
/*    to top,*/
/*    rgba(71, 153, 235, 0.5) 0%,*/
/*    rgba(71, 153, 235, 0) 30%*/
/*  );*/
/*}*/

.CircleIcon {
  display: inline-block;
  position: relative;
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    from(#000933),
    to(#141f52)
  );
  background: linear-gradient(to bottom, #000933 0%, #141f52 100%);
  border-radius: 50%;
  -webkit-box-shadow: 0px 0px 6px 1px rgba(0, 0, 0, 0.6);
  box-shadow: 0px 0px 6px 1px rgba(0, 0, 0, 0.6);
  -webkit-box-sizing: content-box;
  box-sizing: content-box;
  margin-top: 15px;
  margin-bottom: 15px;
  pointer-events: none;
}

.CircleIcon img {
  width: 100%;
  height: 100%;
  opacity: 0.9;
  width: 80px;
  height: 80px;
}
@media (min-width: 960px) {
  .CircleIcon img {
    width: 125px;
    height: 125px;
  }
}
.CircleIcon img a:hover {
  opacity: 1;
}

.CircleIcon a {
  display: block;
}
.CircleIcon a::after {
   content: ' ';
   position: absolute;
   top: 0px;
   left: 0px;
   border-radius: 50%;
  border: 2px solid rgba(112, 153, 194, 0.3);
   display: block;
   width: calc(100% - 4px);
   height: calc(100% - 4px);
   background-image: none;
   -webkit-box-shadow: inset 0px 0px 10px 2px rgba(0, 0, 0, 0.8);
   box-shadow: inset 0px 0px 10px 2px rgba(0, 0, 0, 0.8);
   -webkit-transition-duration: 0.2s;
   transition-duration: 0.2s;
}
.CircleIcon a:hover::after {
  background-color: rgba(0, 128, 255, 0.1);
  background-image: -webkit-gradient(
    linear,
    left bottom,
    left top,
    from(rgba(71, 153, 235, 0.6)),
    color-stop(40%, rgba(71, 153, 235, 0))
  );
  background-image: linear-gradient(
    to top,
    rgba(71, 153, 235, 0.6) 0%,
    rgba(71, 153, 235, 0) 40%
  );
  -webkit-box-shadow: inset 0px 0px 10px 2px rgba(0, 128, 255, 0.5);
  box-shadow: inset 0px 0px 10px 2px rgba(0, 128, 255, 0.5);
  border: 2px solid rgba(51, 128, 204, 0.8);
}
h5 {
  margin-top: 0;
}
</style>
