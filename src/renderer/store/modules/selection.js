var primatives = require('../../../primatives/primatives.js')
const fs = require('fs');

const loc = window.location.pathname;

const state = {
  sideSelect: '',
  // focus: false,
  // clickFocus: false,
}

const getters = {
  selection: (state)=>state.sideSelect
}

const mutations = {
  setSelection (state, choice) {
    state.sideSelect = choice
  },
}

const actions = {
  setSelection: function ({ commit, state, rootState }, choice) {
    commit('setSelection', choice)
    console.log(choice)
    if (choice != 'Glue' && choice != 'Joint' && choice != 'Graphic' ) {
      commit('setFocus', null, { root: true })
    }
  },
}

export default {
  state,
  getters,
  mutations,
  actions
}
