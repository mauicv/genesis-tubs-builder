var primatives = require('../../primatives/primatives.js')
const fs = require('fs');
var gm = require('genesis-tubs-engine').GeneralMethods
const loc = window.location.pathname;

const fields = [
  'points',
  'lines',
  'convexSets',
  'glues',
  'joints',
  'beams',
  'structures',
  'relPoints',
  'graphics'
]

function _flatten(store){
  var objStore = {}
  fields.forEach(function(field){
    store[field].forEach((item)=>objStore[item.uuid] = item)
  })
  return objStore
}

function _unflatten(data){
  var flatStore = {};
  Object.values(data).forEach((item)=>{
    var ClassType = primatives[item.type]
    var obj = new ClassType(...item.cArgs)
    flatStore[item.uuid] = obj
  })

  Object.entries(flatStore).forEach((vals)=>{
    var [key, item] = [...vals]
    var item_data = data[key]
    Object.entries(item_data.eArgs).forEach((vals)=>{
      var [type, eArg] = [...vals]
      if (eArg instanceof Object) {
        var obj_list = eArg.map(key=>flatStore[key])
        item[type] = obj_list
      } else {
        item[type] = flatStore[eArg]
      }
    })
  })

  var flatStoreValues = Object.values(flatStore)

  return {
    points: flatStoreValues
      .filter(item=>item instanceof primatives.Point && !(item instanceof primatives.RelPoint)),
    lines: flatStoreValues.filter(item=>item instanceof primatives.Line),
    convexSets: flatStoreValues.filter(item=>item instanceof primatives.ConvexSet),
    joints: flatStoreValues.filter(item=>item instanceof primatives.Joint),
    glues: flatStoreValues.filter(item=>item instanceof primatives.Glue),
    beams: flatStoreValues.filter(item=>item instanceof primatives.Beam),
    structures: flatStoreValues.filter(item=>item instanceof primatives.Structure),
    graphics: flatStoreValues.filter(item=>item instanceof primatives.Graphic),
    relPoints: flatStoreValues.filter(item=>item instanceof primatives.RelPoint)
  }
}

function saveAsGTBFormat(object){
  var flattenedStore = _flatten(object)
  var dir = loc.substring(0, loc.lastIndexOf('/'));
  if (dir != '') {dir=`${dir}/`}
  fs.writeFileSync(`${dir}env.txt`, JSON.stringify(flattenedStore))
}

function loadAsGTBFormat(object){
  var dir = loc.substring(0, loc.lastIndexOf('/'));
  if (dir != '') {dir=`${dir}/`}
  var Data_string = fs.readFileSync(`${dir}env.txt`,  'utf8');
  var data = JSON.parse(Data_string)
  return _unflatten(data)
}

export { saveAsGTBFormat, loadAsGTBFormat }
