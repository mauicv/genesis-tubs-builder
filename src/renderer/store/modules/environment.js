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
  },
  save (state) {
    var dir = loc.substring(0, loc.lastIndexOf('/'));
    if (dir != '') {dir=`${dir}/`}
    fs.writeFileSync(`${dir}env.txt`, JSON.stringify(state))
  },
  clean (state) {
    state.points = []
    state.lines = []
    state.convexSets = []
  },
  convertJSONGTEtoJSON (state) {
    ```
    Used to convert a genesis-tubs physics environment stored as json into the
    format used by the editor.
    ```

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
  },
  convertJSONtoJSONGTE (state) {
    ```
    Used to convert editor format into the json string format required by the
    genesis-tubs physics engine
    ```
  },
}

const actions = {
  save: function ({ commit }) {
    commit('save')
  },
  load: function ({ commit }) {
    commit('clean')
    var dir = loc.substring(0, loc.lastIndexOf('/'));
    if (dir != '') {dir=`${dir}/`}
    var Data_string = fs.readFileSync(`${dir}env.txt`,  'utf8');
    var data = JSON.parse(Data_string)
    var convexSets = data.convexSets.map(function(set){
      var lines = set.lines.map(function(line){
        var from = new primatives.Point(line.from.x)
        var to = new primatives.Point(line.to.x)
        return new primatives.Line(from, to)
      })
      commit('addConvexSet', new primatives.ConvexSet(null, lines))
    })
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
