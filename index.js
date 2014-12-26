var audioInput = require('./audioInput')
var eq = require('./eq')
var simulation = require('./simulation')
var debug = require('./debug')
var visualization = require('./visualization')

function setup() {
  audioInput.openUserInput()
}

function update() {
  window.requestAnimationFrame(update);

  var bands = audioInput.getBands(20)

  eq.update(bands)
  simulation.update(bands)

  var agents = simulation.getAgents()

  debug.draw(agents)
  visualization.draw(agents)
}

setup()
update()