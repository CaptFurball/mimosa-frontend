import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './router';

Vue.config.productionTip = false
console.log(process.env.VUE_APP_MIMOSA_BACKEND);
import axios from 'axios';
Vue.prototype.$server = axios.create({
  baseURL: process.env.VUE_APP_MIMOSA_BACKEND,
  timeout: 3000,
  withCredentials: true,
  headers: {
    'Accept': 'application/json'
  }
});

import store from './store';

import VueLodash from 'vue-lodash';
import lodash from 'lodash';

Vue.use(VueLodash, { 
  lodash: lodash 
});

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app');
