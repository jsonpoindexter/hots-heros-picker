<template>
  <div
    class="HeroItem-container"
    @click="onSelect"
    :class="{ disabled: disabled }"
    :style="{ background: selected ? team : null }"
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
    <h5 class="HeroName-text ">{{ name }}</h5>
    <div v-show="disabled" class="image-overlay"></div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class Hero extends Vue {
  @Prop() private name!: string
  @Prop() private urlName!: string
  @Prop() private selected!: boolean
  @Prop() private disabled!: boolean
  @Prop() private team!: boolean

  private onSelect() {
    if (!this.disabled ) {
      this.$store.dispatch('updateSelected', { name: this.name, urlName: this.urlName, selected: !this.selected })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="css">
.disabled {
  pointer-events: none;
}
.image-overlay {
    width: 100%;
    height: 100%;
  top: 0;
  left: 0;
  position: absolute;
  padding: 0;
    background-color: rgba(0, 0, 0, 0.5);
  }
.selected {
  background-color: rgba(0,0,0,.5);
}
.HeroItem-container {
  user-select: none;
  text-align: center;
  position: relative;
  width: 105px;
  -webkit-transition-duration: 0.2s;
  /* transition-duration: 0.2s; */
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
.HeroItem-container:hover .CircleIcon.selected a::after {
  background: none;
  background-image: -webkit-gradient(
    linear,
    left bottom,
    left top,
    from(rgba(71, 153, 235, 0.5)),
    color-stop(30%, rgba(71, 153, 235, 0))
  );
  background-image: linear-gradient(
    to top,
    rgba(71, 153, 235, 0.5) 0%,
    rgba(71, 153, 235, 0) 30%
  );
}

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
