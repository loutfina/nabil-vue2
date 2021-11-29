import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'


// Import Bootstrap an BootstrapVue CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false

//Load app-config key-value into this.$config global variable
fetch("app-config.json")
  .then((response) => response.json())
  .then((config) => {
      Vue.prototype.$config = config;
      const vm = new Vue({
        router,
        store,
        render: h => h(App)
      });

      // Make BootstrapVue available throughout your project
      Vue.use(BootstrapVue);
      // Optionally install the BootstrapVue icon components plugin
      Vue.use(IconsPlugin);

      vm.$mount('#app');
  })

  




