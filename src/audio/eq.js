
var lodash = require('lodash')
var container = document.querySelector('.eq')
var bars

function createBars(count) {
  return lodash.map(lodash.times(count), function(i) {
    var element = document.createElement('div')

    element.className = 'bar';
    element.style.width = 'calc(' + (100 / count) + '% - 1px)'
    element.style.left = (100 / count) * i + '%'

    container.appendChild(element)

    return element
  })
}

function update(input) {
  if(!bars) {
    bars = createBars(input.length)
  }

  input.forEach(function(value, i) {
    bars[i].style.height = value * 100 + '%'
  })
}

module.exports = {
  update: update
}