import Vue from 'vue'
import Vuex from 'vuex'
import { alertSlice } from './alertSlice';
import { useSlice } from './userSlice';
import { rcaSlice } from './rcaSlice';
import { idem2Slice } from './item2Slice';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    useSlice,
    alertSlice,
    rcaSlice,
    idem2Slice
  }
})
