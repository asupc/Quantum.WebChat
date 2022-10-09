import Vue from 'vue'
import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'
import App from './App'
import axios from 'axios'
import iView from 'iview'

Vue.prototype.$http= axios
Vue.use(MintUI)
Vue.use(iView, {
})
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App }
})
