var audioInput = require('./audioInput')
var eq = require('./eq')
var visualization = require('./visualization')

function setup() {
  console.log('Setup')
  audioInput.openUserInput()
}

function update() {
  window.requestAnimationFrame(update);

  var bands = audioInput.getBands(20)

  eq.update(bands)
  visualization.update(bands)
}

setup()
update()