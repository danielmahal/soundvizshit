var lodash = require('lodash')
var Vector = require('victor')

var agent = require('./agent')

var agents
var time = 0

module.exports.update = function(input) {
  time += 1

  if(!agents) {
    agents = lodash.times(input.length, agent.create)
  }

  agents.forEach(function(agent, i) {
    agent.energy = input[i]

    agent.momentum += agent.energy * 0.01
    agent.momentum *= 0.5
    agent.momentum = Math.max(0.0002, agent.momentum)

    var peers = lodash.difference(agents, [agent])

    agent.fear += (agent.getFear(peers) - agent.fear) * 0.6
    agent.fear += (0.5 - agent.fear) * 0.1

    agent.mode = 'idle'
    agent.prey = null
    agent.closest = agent.mapClosest(peers)

    if(agent.fear < 0.2) {
      agent.mode = 'hunt'
    }

    if(agent.fear > 0.8) {
      agent.mode = 'run'
    }

    if(agent.mode === 'hunt') {
      agent.prey = lodash.first(agent.closest, 1)
    }

    if(agent.mode === 'idle') {
      agent.prey = lodash.first(agent.closest, 5)
    }

    if(agent.mode === 'run') {
      var peers = lodash.filter(agent.closest, function(peer) {
        return peer.mode === 'hunt'
      })

      lodash.forEach(peers, function(peer) {
        var distance = agent.position.distance(peer.position)
        var boost = Math.max(0, -distance + 0.1) * 0.005
        var rotationSpeed = Math.pow(distance + 1.2, -10)

        agent.momentum += boost
        agent.rotateAway(peer.position, rotationSpeed)
      })
    }

    agent.angle += Math.sin(time * 0.1) * 0.001 * (i + 10)

    if(agent.prey) {
      agent.prey.forEach(function(prey) {
        agent.rotateTowards(prey.position, 0.05)
      })
    }

    if(agent.mode === 'hunt') {
      agent.prey.forEach(function(prey) {
        if(agent.position.distance(prey.position) < 0.01) {
          if(agent.momentum > prey.momentum) {
            prey.position.x = Math.random()
            prey.position.y = Math.random()
            agent.size += 1
            prey.size = 1
          }
        }
      })
    }

    agent.position.x += Math.cos(agent.angle) * agent.momentum;
    agent.position.y += Math.sin(agent.angle) * agent.momentum;

    agent.position.x = agent.position.x <= 0 ? 1 : agent.position.x >= 1 ? 0 : agent.position.x
    agent.position.y = agent.position.y <= 0 ? 1 : agent.position.y >= 1 ? 0 : agent.position.y
  })
}

module.exports.getAgents = function() {
  return agents
}