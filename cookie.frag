// Author: Xueer Zhu

precision mediump float;

varying vec2 vTexCoord;

void main() {
  
  vec2 coord = vTexCoord;
  
  gl_FragColor = vec4(coord.x, coord.y, (coord.x+coord.y), 1.0 );
}