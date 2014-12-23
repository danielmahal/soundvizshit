var lodash = require('lodash')

var agent = require('./agent')

var canvas = document.querySelector('canvas')
var context = canvas.getContext('2d')

var agents

function updateSize() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

window.addEventListener('resize', updateSize)
updateSize()

module.exports.update = function(input) {
  if(!agents) {
    agents = lodash.times(input.length, agent.create)
  }

  context.clearRect(0, 0, canvas.width, canvas.height)

  context.fillStyle = 'white'
  context.strokeStyle = 'red'

  agents.forEach(function(agent, i) {
    // Update

    agent.willingness += input[i] * 0.01
    agent.willingness *= 0.5
    agent.willingness = Math.min(0.01, agent.willingness)

    agent.searchArea = (agent.willingness * 10 + 0.1);

    agent.position.x += Math.cos(agent.angle) * agent.willingness;
    agent.position.y += Math.sin(agent.angle) * agent.willingness;

    agent.position.x = agent.position.x < 0 ? 1 : agent.position.x > 1 ? 0 : agent.position.x
    agent.position.y = agent.position.y < 0 ? 1 : agent.position.y > 1 ? 0 : agent.position.y

    var peers = lodash.difference(agents, [agent])
    agent.prey = agent.findPrey(peers)

    if(agent.prey) {
      var targetAngle = Math.atan2(agent.prey.position.y - agent.position.y, agent.prey.position.x - agent.position.x)
      // TODO: Confused agents: Cannot use differentials for angles (normalize angle?)
      // theta - TWO_PI * Math.floor((theta + Math.PI) / TWO_PI)
      // OR: set it hard
      // agent.angle = targetAngle

      agent.angle += (agent.angle - targetAngle) * Math.min(1, agent.willingness)
    }

    // Draw
    var scale = { x: canvas.width, y: canvas.height }

    var x = agent.position.x * canvas.width
    var y = agent.position.y * canvas.height

    context.save()
    context.translate(agent.position.x * scale.x, agent.position.y * scale.y)

    // Dot
    context.beginPath()
    context.arc(0, 0, 5, 0, Math.PI * 2)
    context.fill()
    context.closePath()

    // Angle
    context.strokeStyle = 'red'
    context.beginPath()
    context.moveTo(0, 0)
    context.lineTo(Math.cos(agent.angle) * 10, Math.sin(agent.angle) * 10)
    context.stroke()

    context.strokeStyle = 'rgba(255, 0, 0, 0.2)'

    // Search area
    context.beginPath()
    context.arc(0, 0, agent.searchArea * scale.y, 0, Math.PI * 2)
    context.stroke()
    context.closePath()

    context.restore()

    context.strokeStyle = 'rgba(255, 0, 0, 0.2)'

    if(agent.prey) {
      // Prey link
      context.beginPath()
      context.moveTo(agent.position.x * scale.x, agent.position.y * scale.y)
      context.lineTo(agent.prey.position.x * scale.x, agent.prey.position.y * scale.y)
      context.stroke()
    }
  })
}