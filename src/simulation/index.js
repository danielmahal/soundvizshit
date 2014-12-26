var lodash = require('lodash')

var agent = require('./agent')

var agents
var time = 0

module.exports.update = function(input) {
  time += 1

  if(!agents) {
    agents = lodash.times(input.length, agent.create)
  }

  agents.forEach(function(agent, i) {
    agent.energy = input[i] * 0.01

    agent.momentum += agent.energy
    agent.momentum *= 0.5
    agent.momentum = Math.max(0.0002, agent.momentum)

    agent.position.x += Math.cos(agent.angle) * agent.momentum;
    agent.position.y += Math.sin(agent.angle) * agent.momentum;

    agent.position.x = agent.position.x <= 0 ? 1 : agent.position.x >= 1 ? 0 : agent.position.x
    agent.position.y = agent.position.y <= 0 ? 1 : agent.position.y >= 1 ? 0 : agent.position.y

    var peers = lodash.difference(agents, [agent])

    // agent.fear = agent.getFear(peers)
    agent.fear += (agent.getFear(peers) - agent.fear) * 0.6
    agent.mode = 'idle'
    agent.prey = null

    if(agent.fear < 0.2) {
      agent.mode = 'hunt'
    }

    if(agent.fear > 0.6) {
      agent.mode = 'run'
    }

    if(agent.mode === 'hunt') {
      agent.prey = agent.findPrey(peers)
    }

    if(agent.mode === 'idle') {
      // agent.prey = agent.findPrey(3, peers)
    }

    agent.angle += Math.sin(time * 0.1) * 0.001 * (i + 10)

    if(agent.mode === 'hunt') {
      agent.rotateTowards(agent.prey.position, 0.1)

      if(agent.position.distance(agent.prey.position) < 0.01) {
        if(agent.momentum > agent.prey.momentum) {
          agent.prey.position.x = Math.random()
          agent.prey.position.y = Math.random()
        }
      }
    }
  })
}

module.exports.getAgents = function() {
  return agents
}