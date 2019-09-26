var primatives = require('../../../primatives/primatives.js')
const fs = require('fs');
var gm = require('genesis-tubs-engine').GeneralMethods

const loc = window.location.pathname;

const state = {
  points: [],
  lines: [],
  convexSets: [],
  glues: [],
  joints: [],
  links: [],
  scale: 1,
  canvas: null,
  canvasTop: null,
  canvasLeft: null,
  center: null,
  focus: null
}

const getters = {
  points: (state)=>state.points,
  lines: (state)=>state.lines,
  convexSets: (state)=>state.convexSets,
  glues: (state)=>state.glues,
  joints: (state)=>state.joints,
  links: (state)=>state.links,
  canvas: (state)=>state.canvas,
  canvasTop: (state)=>state.canvasTop,
  canvasLeft: (state)=>state.canvasLeft,
  focus: (state)=>state.focus
}


const mutations = {
  setFocus(state, object){
    state.focus = object
  },
  setCanvas(state, canvas){
    var WIDTH = document.documentElement.clientWidth-160;
    var HEIGHT = document.documentElement.clientHeight-160;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    state.center = [WIDTH/2, HEIGHT/2]
    state.canvas = canvas
    var rect = canvas.getBoundingClientRect();
    state.canvasTop = rect.top
    state.canvasLeft = rect.left
  },
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
    state.joints = []
    state.glues = []
    state.links = []
  },
  zoom (state, amount) {
    var points = []
    state.points.forEach(function(point){
      var xd=gm.mult(gm.minus(point.x, state.center), amount);
      point.x = (gm.add(xd, point.x));
      points.push(point)
    })
    state.points = points
  },
  move (state, vector) {
    var points = []
    state.points.forEach(function(point){
      point.x = (gm.add(vector,point.x));
      points.push(point)
    })
    state.points = points
  },
  deleteConvexSet (state, convexSet) {
    state.convexSets = state.convexSets
      .filter((set)=>set != convexSet)
    state.lines = state.lines
      .filter((line)=>!convexSet.lines.includes(line))
    state.points = state.points
      .filter((point)=>!convexSet.toAllPoints().includes(point))
  },
  addGlue(state, convexSets){
    if(convexSets[0].isGluedTo(convexSets[1])) return
    var lines = convexSets[0].getAlignedSides(convexSets[1])
    var newGlue = new primatives.Glue(lines)
    state.glues = [...state.glues, newGlue]
    convexSets[0].glues.push(newGlue)
    convexSets[1].glues.push(newGlue)
  },
  removeGlues(state, convexSet){
    var gluesToRemove = convexSet.glues
    state.glues = state.glues
      .filter((glue)=>!gluesToRemove.includes(glue))
    state.convexSets.forEach(function(set){
      set.glues = set.glues
        .filter((glue)=>!gluesToRemove.includes(glue))
    })
  },
  addJoint(state, convexSets){
    if(convexSets[0].isJointTo(convexSets[1])) return
    var linePairs = convexSets[0].getIncidentSides(convexSets[1])
    var newJoint = new primatives.Joint(linePairs)
    state.joints = [...state.joints, newJoint]
    convexSets[0].joints.push(newJoint)
    convexSets[1].joints.push(newJoint)
  },
  removeJoints(state, convexSet){
    var jointsToRemove = convexSet.joints
    state.joints = state.joints
      .filter((joint)=>!jointsToRemove.includes(joint))
    state.convexSets.forEach(function(set){
      set.joints = set.joints
        .filter((joint)=>!jointsToRemove.includes(joint))
    })
  },
  addLink(state, points) {
    var newLink = new primatives.Line(...points)
    state.links = [...state.links, newLink]
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
    // add glues and joints
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
  },
  setCanvas: function({ commit }, canvas) {
    commit('setCanvas', canvas)
  },
  zoom: function({ commit }, amount){
    commit('zoom', amount)
  },
  move: function({ commit }, vector){
    commit('move', vector)
  },
  deleteConvexSet: function({ commit }, convexSet){
    commit('removeGlues', convexSet)
    commit('removeJoints', convexSet)
    commit('deleteConvexSet', convexSet)
  },
  addGlue: function({ commit }, convexSets){
    commit('addGlue', convexSets)
  },
  removeGlues: function({ commit }, convexSet){
    commit('removeGlues', convexSet)
  },
  addJoint: function({ commit }, convexSets){
    commit('addJoint', convexSets)
  },
  removeJoints: function({ commit }, convexSets){
    commit('removeJoints', convexSets)
  },
  addLink: function({ commit }, points) {
    commit('addLink', points)
  },
  setFocus: function({ commit }, object) {
    commit('setFocus', object)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
