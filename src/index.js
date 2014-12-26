var audio = require('./audio/input')
var eq = require('./audio/eq')
var simulation = require('./simulation')
var simulationDebug = require('./simulation/debug')
var visualization = require('./visualization')

function setup() {
  audio.openUserInput()
}

function update() {
  window.requestAnimationFrame(update);

  var bands = audio.getBands(20)

  eq.update(bands)
  simulation.update(bands)

  var agents = simulation.getAgents()

  simulationDebug.draw(agents)
  visualization.draw(agents)
}

setup()
update()