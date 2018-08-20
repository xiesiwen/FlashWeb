<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="true"/>
    </keep-alive>
     <!-- <section id='foot_guide'>
        <section @click = "gotoAddress({path: '/products'})" class="guide_item">
            <span>商品</span>
        </section>
        <section @click = "gotoAddress({path: `/orders`})" class="guide_item">
            <span>我的</span>
        </section>
    </section> -->
    <foot-guide></foot-guide>
    <svgIcon></svgIcon>
  </div>
</template>

<script>
import svgIcon from './components/common/svg';
import footGuide from './components/common/footer/footGuide.vue';

export default {
  name: "App",
  created() {
  },
  methods: {
    gotoAddress(path) {
      this.$router.push(path);
    }
  },
  components:{
    svgIcon,
     'foot-guide':footGuide
  }
};
</script>

<style lang="scss" scoped>
@import "./style/mixin";
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#foot_guide {
  background-color: #fff;
  position: fixed;
  z-index: 100;
  left: 0;
  right: 0;
  bottom: 0;
  @include wh(100%, 1.95rem);
  display: flex;
  box-shadow: 0 -0.026667rem 0.053333rem rgba(0, 0, 0, 0.1);
}
.guide_item {
  flex: 1;
  display: flex;
  text-align: center;
  flex-direction: column;
  align-items: center;
  .icon_style {
    @include wh(0.8rem, 0.8rem);
    margin-top: 0.3rem;
    fill: #ccc;
  }
  span {
    @include sc(0.45rem, #666);
  }
}
</style>
