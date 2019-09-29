var primatives = require('../../../primatives/primatives.js')
const fs = require('fs');
var gm = require('genesis-tubs-engine').GeneralMethods

import { saveAsGTBFormat, loadAsGTBFormat } from '../../localStoreController/parseGTBJSON.js'

const loc = window.location.pathname;

const state = {
  points: [],
  lines: [],
  convexSets: [],
  glues: [],
  joints: [],
  beams: [],
  structures: [],
  relPoints: [],
  graphics: [],
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
  beams: (state)=>state.beams,
  relPoints: (state)=>state.relPoints,
  graphics: (state)=>state.graphics,
  canvas: (state)=>state.canvas,
  canvasTop: (state)=>state.canvasTop,
  canvasLeft: (state)=>state.canvasLeft,
  focus: (state)=>state.focus,
  structures: (state)=>state.structures
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
  save: (state) => saveAsGTBFormat(state),
  load (state){
    var parsedData = loadAsGTBFormat(state)
    Object.entries(parsedData).forEach(function(vals){
      var [key, val] = [...vals]
      state[key] = val
    })
  },
  clean (state) {
    state.points = []
    state.lines = []
    state.convexSets = []
    state.joints = []
    state.glues = []
    state.beams = []
    state.structures = []
    state.graphics = []
    state.relPoints = []
  },
  zoom (state, amount) {
    var points = []
    state.points.forEach(function(point){
      var xd=gm.mult(gm.minus(point.x, state.center), amount);
      point.x = (gm.add(xd, point.x));
      points.push(point)
    })
    state.points = points

    var relPoints = []
    state.relPoints.forEach(function(point){
      var xd=gm.mult(gm.minus(point.x, state.center), amount);
      point.x = (gm.add(xd, point.x));
      relPoints.push(point)
    })
    state.relPoints = relPoints
  },
  move (state, vector) {
    var points = []
    state.points.forEach(function(point){
      point.x = (gm.add(vector,point.x));
      points.push(point)
    })
    state.points = points

    var relPoints = []
    state.relPoints.forEach(function(point){
      point.x = (gm.add(vector,point.x));
      relPoints.push(point)
    })
    state.relPoints = relPoints
  },
  deleteConvexSet (state, convexSet) {
    state.convexSets = state.convexSets
      .filter((set)=>set != convexSet)
    state.lines = state.lines
      .filter((line)=>!convexSet.lines.includes(line))
    state.points = state.points
      .filter((point)=>!convexSet.toAllPoints().includes(point))
  },
  removeConvexSetFromStructures(state, convexSet){
    state.structures = state.structures.map(function(structure){
      structure.sets = structure.sets
        .filter(set=>set != convexSet)
      return structure
    })
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
    var newLink = new primatives.Beam(...points)
    state.beams = [...state.beams, newLink]
  },
  removeLink(state, linkToRemove) {
    state.beams = state.beams
      .filter((link)=>link != linkToRemove)
  },
  addStructure(state, sets) {
    var newStructure = new primatives.Structure(sets)
    state.structures = [...state.structures, newStructure]
  },
  removeStructure(state, structureToRemove) {
    state.structures = state.structures
      .filter((structure)=>structure != structureToRemove)
  },
  addGraphic(state, points){
    var anchor = state.focus.lines[0]
    var newRelPoints = points
      .map(point=>new primatives.RelPoint(point, anchor))
    state.relPoints = [...state.relPoints, ...newRelPoints]
    var newGraphic = new primatives.Graphic(newRelPoints)
    state.graphics = [...state.graphics, newGraphic]
    state.lines = [...state.lines, ...newGraphic.lines]
    state.focus.graphics.push(newGraphic)
  },
  removeLastGraphicOnConvexSet(state, convexSet){
    var graphicToRemove = convexSet.graphics.pop()
    var linesToRemove = graphicToRemove.lines
    state.lines = state.lines
      .filter((line)=>!linesToRemove.includes(line))
    state.graphics = state.graphics
      .filter((graphic)=>graphicToRemove != graphic)
  },
  removeAllGraphicsOnConvexSet(state, convexSet){
    var graphicsToRemove = convexSet.graphics
    var linesToRemove = convexSet.graphics
      .reduce((acc, cur)=>[...acc,...cur.lines], [])
    state.lines = state.lines
      .filter((line)=>!linesToRemove.includes(line))
    state.graphics = state.graphics
      .filter((graphic)=>!graphicsToRemove.includes(graphic))
    convexSet.graphics = []
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
    commit('removeAllGraphicsOnConvexSet', convexSet)
    commit('removeConvexSetFromStructures', convexSet)
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
  removeLink: function({ commit }, link) {
    commit('removeLink', link)
  },
  setFocus: function({ commit }, object) {
    commit('setFocus', object)
  },
  addStructure: function({ commit }, sets) {
    commit('addStructure', sets)
  },
  removeStructure: function({ commit }, structure) {
    commit('removeStructure', structure)
  },
  addGraphic: function({ commit }, line) {
    commit('addGraphic', line)
  },
  removeAllGraphicsOnConvexSet: function({ commit }, convexSet) {
    commit('removeAllGraphicsOnConvexSet', convexSet)
  },
  removeLastGraphicOnConvexSet: function({ commit }, convexSet) {
    commit('removeLastGraphicOnConvexSet', convexSet)
  },
}

export default {
  state,
  getters,
  mutations,
  actions
}
