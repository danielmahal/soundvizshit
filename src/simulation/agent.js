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
  this.size = 1

  this.momentum = 0
}

Agent.prototype.getDistanceToPeer = function(peer) {
  return this.position.distance(peer.position);
}

Agent.prototype.mapClosest = function(peers) {
  var distanceMap = lodash.map(peers, function(peer) {
    return {
      distance: this.getDistanceToPeer(peer),
      peer: peer
    }
  }, this)

  var closestMap = lodash.sortBy(distanceMap, 'distance')

  return lodash.pluck(closestMap, 'peer')
}

Agent.prototype.compareParameter = function(peer, parameter) {
  return Math.max(this[parameter], 0.001) / Math.max(peer[parameter], 0.001)
}

Agent.prototype.getFearOfPeer = function(peer) {
  var distanceFactor = Math.pow(this.getDistanceToPeer(peer), 2)
  var momentumFactor = Math.pow(this.compareParameter(peer, 'momentum'), 2)
  var sizeFactor = Math.pow(this.compareParameter(peer, 'size'), 2)
  var fear = 1 - distanceFactor * ((momentumFactor + sizeFactor) / 2)

  return fear;
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

Agent.prototype.rotateAway = function(target, multiplier) {
  var diff = ((Math.atan2(this.position.y - target.y, this.position.x - target.x)) - this.angle);

  while(diff < -Math.PI) {
    diff += Math.PI * 2;
  }

  while(diff > Math.PI) {
    diff -= Math.PI * 2;
  }

  this.angle += diff * multiplier;
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

module.exports.create = function(params) {
  return new Agent(params)
}