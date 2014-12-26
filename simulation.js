var lodash = require('lodash')

var agent = require('./agent')

var agents

module.exports.update = function(input) {
  if(!agents) {
    agents = lodash.times(input.length, agent.create)
  }

  agents.forEach(function(agent, i) {
    agent.momentum += input[i] * 0.01
    agent.momentum *= 0.5
    agent.momentum = Math.min(0.01, agent.momentum)

    agent.position.x += Math.cos(agent.angle) * agent.momentum;
    agent.position.y += Math.sin(agent.angle) * agent.momentum;

    agent.position.x = agent.position.x < 0 ? 1 : agent.position.x > 1 ? 0 : agent.position.x
    agent.position.y = agent.position.y < 0 ? 1 : agent.position.y > 1 ? 0 : agent.position.y

    var peers = lodash.difference(agents, [agent])
    agent.prey = agent.findPrey(peers)
  })
}

module.exports.getAgents = function() {
  return agents
}