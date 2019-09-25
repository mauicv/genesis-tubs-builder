var primatives = require('../../../primatives/primatives.js')
const fs = require('fs');

const loc = window.location.pathname;

const state = {
  points: [],
  lines: [],
  convexSets: []
}

const getters = {
  points: (state)=>state.points,
  lines: (state)=>state.lines,
  convexSets: (state)=>state.convexSets
}


const mutations = {
  addConvexSet (state, convexSet) {
    state.convexSets.push(convexSet)
    convexSet.lines.forEach((line)=>{
      state.lines.push(line)
      state.points.push(line.from)
      state.points.push(line.to)
    })
    console.log(state)
  },
  save (state) {
    console.log()
  },
  clean (state) {
    state.points = []
    state.lines = []
    state.convexSets = []
  },
  load (state) {
    var dir = loc.substring(0, loc.lastIndexOf('/'));
    if (dir != '') {dir=`${dir}/`}
    var Data_string = fs.readFileSync(`${dir}env.txt`,  'utf8');
    var data = JSON.parse(Data_string);
    console.log(data)
    var newPoint
    var newConvexSet

    data.points.forEach(function(point){
      newPoint = new primatives.Point(point.x[0], point.x[1])
      state.points.push(newPoint)
    })

    data.convexSets.forEach(function(set){
      var points = set.pointIndices
        .map((pointIndex)=>state.points[pointIndex])
      newConvexSet = new primatives.ConvexSet(points)
      state.convexSets.push(newConvexSet)
    })

    state.lines = state.convexSets.reduce((acc, cur)=>[...acc, ...cur.lines], [])
    // glues, joints, beams, structures, laws, relpoints and graphics

  }
}

const actions = {
  save: function ({ commit }) {
    commit('save')
  },
  load: function ({ commit }) {
    commit('clean')
    commit('load')
  },
  addConvexSet: function ({ commit }, ConvexSet) {
    commit('addConvexSet', ConvexSet)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
