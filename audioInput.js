var lodash = require('lodash')

var input
var context = new window.AudioContext();

var analyser = context.createAnalyser();
analyser.fftSize = 2048;

module.exports.openUserInput = function() {
  navigator.webkitGetUserMedia({ audio: true }, function(stream) {
    input = context.createMediaStreamSource(stream)
    input.connect(analyser)
    console.log('Mic ready one, two, check')
  }, function() {
    console.log('Mic not ready, douchebags…')
  })
}

module.exports.getBands = function(count) {
  var data = new Uint8Array(1024);
  var binSize = Math.floor(data.length / count);

  analyser.getByteFrequencyData(data);

  return lodash.map(lodash.times(count), function(i) {
    var sum = lodash.reduce(lodash.times(binSize), function(sum, j) {
      return sum += data[(i * binSize) + j];
    })

    var average = sum / binSize
    var scaled = average / (analyser.fftSize / 6)

    return scaled
  })
}