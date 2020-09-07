import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
    authenticated: false,
    user: {
        name: 'Guest'
    }
};

const mutations = {
    SET_AUTHENTICATION (state) {
        state.authenticated = true;
    },
    CLEAR_AUTHENTICATION (state) {
        state.authenticated = false;
    },
    SET_USER (state, payload) {
        state.user = payload;
    },
    CLEAR_USER (state) {
        state.user = {
            name: 'Guest'
        }
    }
};

const actions = {
    onSuccessLogin (context, user) {
        context.commit('SET_AUTHENTICATION');
        context.commit('SET_USER', user);
    },
    onLogout (context) {
        context.commit('CLEAR_AUTHENTICATION');
        context.commit('CLEAR_USER');
    }
};

export default new Vuex.Store({
    state: state,
    mutations: mutations,
    actions: actions
});