import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './router';

Vue.config.productionTip = false

import axios from 'axios';
Vue.prototype.$server = axios.create({
  baseURL: 'http://localhost:9000',
  timeout: 3000,
  withCredentials: true,
  headers: {
    'Accept': 'application/json'
  }
});

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app');
