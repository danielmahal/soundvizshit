var lodash = require('lodash')

var Agent = function(params) {
  params = params || {}

  this.position = params.position || {
    x: Math.random(),
    y: Math.random()
  }

  this.angle = params.angle || Math.random() * Math.PI * 2
  this.willingness = 0
}

Agent.prototype.findClosest = function(peers) {
  var closestDistance = Infinity;

  return lodash.reduce(peers, function(closest, peer) {
    var distance = Math.sqrt(Math.pow(this.position.x - peer.position.x, 2) + Math.pow(this.position.y - peer.position.y, 2))

    if(distance < this.searchArea && distance < closestDistance) {
      closestDistance = distance
      closest = peer
    }

    return closest
  }, null, this)
}

Agent.prototype.findPrey = function(peers) {
  return this.findClosest(peers)
}

module.exports.create = function(params) {
  return new Agent(params)
}