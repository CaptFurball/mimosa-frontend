import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './router';

Vue.config.productionTip = false

import axios from 'axios';
Vue.prototype.$server = axios.create({
  baseURL: process.env.MIMOSA_BACKEND,
  timeout: 3000,
  withCredentials: true,
  headers: {
    'Accept': 'application/json'
  }
});

import store from './store';

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App)
}).$mount('#app');
