export default {
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      var root = document.getElementsByTagName('html')[0]; // '0' to assign the first (and only `HTML` tag)
      root.setAttribute('class', vm.pageStyle.type);
      vm.$store.commit('SET_NAV_STATE', { visible: vm.pageStyle.visible, minimized: vm.pageStyle.minimized });
      vm.$store.commit('SET_PAGE_STYLE', vm.pageStyle.type);
    });
  },
  beforeRouteLeave(to, from, next) {
    var root = document.getElementsByTagName('html')[0]; // '0' to assign the first (and only `HTML` tag)
    root.setAttribute('class', '');
    // this.$store.commit('SET_NAV_STATE', { minimized: true });
    this.$store.commit('SET_PAGE_STYLE', undefined);
    next();
  },
}
