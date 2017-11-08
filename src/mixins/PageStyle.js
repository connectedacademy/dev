export default {
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.$store.commit('SET_NAV_STATE', { minimized: vm.pageStyle.minimized });
      vm.$store.commit('SET_PAGE_STYLE', vm.pageStyle.type);
      var root = document.getElementsByTagName('html')[0]; // '0' to assign the first (and only `HTML` tag)
      root.setAttribute('class', vm.pageStyle.type);
    });
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('SET_NAV_STATE', { minimized: false });
    this.$store.commit('SET_PAGE_STYLE', undefined);
    var root = document.getElementsByTagName('html')[0]; // '0' to assign the first (and only `HTML` tag)
    root.setAttribute('class', '');
    next();
  },
}
