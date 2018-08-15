import _get from 'lodash/get'

function setHtmlClass(htmlClass) {
  document.getElementsByTagName('html')[0].setAttribute('class', htmlClass)
}
export default {
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      const visible = _get(to, 'meta.pageStyle.visible', true)
      const minimized = _get(to, 'meta.pageStyle.minimized', false)
      const type = _get(to, 'meta.pageStyle.type', undefined)

      vm.$store.commit('SET_NAV_STATE', { visible, minimized })
      vm.$store.commit('SET_PAGE_STYLE', type)
      
      setHtmlClass(type)
    })
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit('SET_PAGE_STYLE', undefined)
    setHtmlClass('')
    next()
  }
}
