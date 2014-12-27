#ifdef GL_ES
  precision highp float;
#endif

#define COUNT 20
#define RADIUS 10.0
#define SMOOTHNESS 1.0

uniform vec2 points[COUNT];
uniform float sizes[COUNT];
uniform vec2 resolution;
uniform float time;

void main() {
  vec2 position = gl_FragCoord.xy;
  float b = 0.0;

  for (int i = 0; i < COUNT; i += 1) {
    vec2 p = points[i] * resolution;
    float d = 1.0 - clamp(distance(p, position) / (RADIUS + sizes[i]), 0.0, 1.0);

    b += pow(d, SMOOTHNESS);
  }

  vec3 c = b * vec3(0.0, 1.0, 1.0);

  gl_FragColor = vec4(c, 1.0);
}