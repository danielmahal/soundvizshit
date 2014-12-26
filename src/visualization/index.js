var lodash = require('lodash')
var THREE = require('../../vendor/three')

var vertexShader = require('./shaders/vertex.vert')
var fragmentShader = require('./shaders/fragment.frag')

var container = document.querySelector('.visualization')

var uniforms = {
  time: { type: "f", value: 1.0 },
  resolution: { type: "v2", value: new THREE.Vector2() },
  points: { type: "v2v", value: [] }
}

function updateSize() {
  uniforms.resolution.value.x = window.innerWidth;
  uniforms.resolution.value.y = window.innerHeight;
  renderer.setSize(window.innerWidth, window.innerHeight)
}

var camera = new THREE.Camera()
var scene = new THREE.Scene()
var renderer = new THREE.WebGLRenderer()
var geometry = new THREE.PlaneBufferGeometry( 2, 2 )

var material = new THREE.ShaderMaterial( {
  uniforms: uniforms,
  vertexShader: vertexShader,
  fragmentShader: fragmentShader
})

var mesh = new THREE.Mesh(geometry, material)

camera.position.z = 1
scene.add(mesh)

container.appendChild(renderer.domElement)

window.addEventListener('resize', updateSize)
updateSize()

module.exports.draw = function(agents) {
  uniforms.time.value += 0.05;

  uniforms.points.value = agents.map(function(agent) {
    return new THREE.Vector2(agent.position.x, 1 - agent.position.y)
  })

  renderer.render(scene, camera);
}