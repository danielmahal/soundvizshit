var lodash = require('lodash')
var Vector = require('victor')

var average = function(values) {
  return lodash.reduce(values, function(sum, value) {
    return sum + value
  }) / values.length
}

var Agent = function(params) {
  params = params || {}

  this.position = params.position || new Vector(Math.random(), Math.random())
  this.angle = params.angle || Math.random() * Math.PI * 2
  this.fear = 0
  this.energy = 0

  this.momentum = 0
}

Agent.prototype.getDistanceToPeer = function(peer) {
  return this.position.distance(peer.position);
}

Agent.prototype.findPrey = function(peers) {
  return this.findNearestPeer(peers)
}

Agent.prototype.compareMomentum = function(peer) {
  return Math.max(this.momentum, 0.001) / Math.max(peer.momentum, 0.001)
}

Agent.prototype.getFearOfPeer = function(peer) {
  return 1 - Math.pow(this.getDistanceToPeer(peer), 2) * this.compareMomentum(peer)
}

Agent.prototype.getFear = function(peers) {
  return average(lodash.map(peers, this.getFearOfPeer, this))
}

Agent.prototype.findNearestPeer = function(peers) {
  var closestDistance = Infinity;

  return lodash.reduce(peers, function(closest, peer) {
    var distance = this.getDistanceToPeer(peer);

    if(distance < closestDistance) {
      closestDistance = distance
      closest = peer
    }

    return closest
  }, null, this)
}

Agent.prototype.rotateTowards = function(target, multiplier) {
  var diff = ((Math.atan2(target.y - this.position.y, target.x - this.position.x)) - this.angle);

  while(diff < -Math.PI) {
    diff += Math.PI * 2;
  }

  while(diff > Math.PI) {
    diff -= Math.PI * 2;
  }

  this.angle += diff * multiplier;
}

Agent.prototype.calculateKillingPotential = function(peer) {

}

module.exports.create = function(params) {
  return new Agent(params)
}