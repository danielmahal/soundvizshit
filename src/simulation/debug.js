var lodash = require('lodash')

var canvas = document.querySelector('canvas')
var context = canvas.getContext('2d')

function updateSize() {
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
}

window.addEventListener('resize', updateSize)
updateSize()

module.exports.draw = function(agents) {
  context.clearRect(0, 0, canvas.width, canvas.height)

  context.fillStyle = 'white'
  context.strokeStyle = 'red'

  agents.forEach(function(agent, i) {
    var scale = { x: canvas.width, y: canvas.height }

    var x = agent.position.x * canvas.width
    var y = agent.position.y * canvas.height

    context.save()
    context.translate(agent.position.x * scale.x, agent.position.y * scale.y)

    // Dot
    context.beginPath()
    context.arc(0, 0, 3, 0, Math.PI * 2)
    context.fill()
    context.closePath()

    // Angle
    context.strokeStyle = 'red'
    context.beginPath()
    context.moveTo(0, 0)
    context.lineTo(Math.cos(agent.angle) * 10, Math.sin(agent.angle) * 10)
    context.stroke()

    context.restore()

    context.strokeStyle = 'rgba(255, 0, 0, 0.2)'

    // Prey link
    context.beginPath()
    context.moveTo(agent.position.x * scale.x, agent.position.y * scale.y)
    context.lineTo(agent.prey.position.x * scale.x, agent.prey.position.y * scale.y)
    context.stroke()
  })
}