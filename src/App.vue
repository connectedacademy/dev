<template lang="pug">

  #app

    authentication-flow

    .main-page

      navigation(v-bind:nav-title="navTitle")

      left-drawer

      router-view(transition transition-mode="out-in")

</template>

<script>

  import AuthenticationFlow from './components/authentication/AuthenticationFlow';
  import Navigation from './components/navigation/Navigation';
  import LeftDrawer from './components/navigation/drawers/LeftDrawer';

  import store from './store/index';

  export default {
    name: 'app',
    data() {
      return {
        navTitle: 'Connected Academy',
      };
    },
    store,
    components: { AuthenticationFlow, Navigation, LeftDrawer },
    methods: { },
  };

</script>

<style lang="styl">

@import "./assets/stylus/layout/page";

</style>
