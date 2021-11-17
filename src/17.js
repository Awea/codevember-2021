const canvasSketch = require('canvas-sketch')
const { range } = require('canvas-sketch-util/random')
const { lerp } = require('canvas-sketch-util/math')

const settings = {
  // Enable an animation loop
  animate: true
}

// Copy from: https://p5js.org/examples/simulate-l-systems.html
// Configuration
let x, y // the current position of the turtle
let currentangle = 0 // which way the turtle is pointing
let step = 20 // how much the turtle moves with each 'F'
let angle = 90 // how much the turtle turns with a '-' or '+'

// LINDENMAYER STUFF (L-SYSTEMS)
let thestring = 'A' // "axiom" or start of the string
let numloops = 5 // how many iterations to pre-compute
let therules = [] // array for rules
therules[0] = ['A', '-BF+AFA+FB-'] // first rule
therules[1] = ['B', '+AF-BFB-FA+'] // second rule

let whereinstring = 0 // where in the L-system are we?

// interpret an L-system
function lindenmayer(s) {
  let outputstring = '' // start a blank output string

  // iterate through 'therules' looking for symbol matches:
  for (let i = 0; i < s.length; i++) {
    let ismatch = 0 // by default, no match
    for (let j = 0; j < therules.length; j++) {
      if (s[i] == therules[j][0]) {
        outputstring += therules[j][1] // write substitution
        ismatch = 1 // we have a match, so don't copy over symbol
        break // get outta this for() loop
      }
    }
    // if nothing matches, just copy the symbol over.
    if (ismatch == 0) outputstring += s[i]
  }

  return outputstring // send out the modified string
}

function radians(degrees) {
  return (degrees * Math.PI) / 180
}

// this is a custom function that draws turtle commands
function drawIt(context, k) {
  if (k == 'F') {
    // draw forward
    // polar to cartesian based on step and currentangle:
    let x1 = x + step * Math.cos(radians(currentangle))
    let y1 = y + step * Math.sin(radians(currentangle))

    context.beginPath()
    context.moveTo(x, y)
    context.lineTo(x, y, x1, y1) // connect the old and the new
    context.stroke()

    // update the turtle's position:
    x = x1
    y = y1
  } else if (k == '+') {
    currentangle += angle // turn left
  } else if (k == '-') {
    currentangle -= angle // turn right
  }

  // give me some random color values:
  let r = range(0, 255)
  let g = range(0, 255)
  let b = range(0, 255)
  let a = range(50, 100)

  // pick a gaussian (D&D) distribution for the radius:
  let radius = 5
  // radius += range(0, 15)
  radius += range(0, 15)
  radius += range(0, 15)
  radius = radius / 3

  // draw the stuff:
  context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`
  context.beginPath()
  context.arc(x, y, radius, 0, 2 * Math.PI)
  context.fill()
}

// Start the sketch
canvasSketch(() => {
  return {
    begin({ context, width, height }) {
      // start the x and y position at lower-left corner
      x = 0
      y = height - 1

      // context.moveTo(x, y)

      // COMPUTE THE L-SYSTEM
      for (let i = 0; i < numloops; i++) {
        thestring = lindenmayer(thestring)
      }
    },
    render({ context, width, height, time }) {
      // Background
      // context.fillStyle = 'blue'
      // context.fillRect(0, 0, width, height)

      // draw the current character in the string:
      drawIt(context, thestring[whereinstring])

      // increment the point for where we're reading the string.
      // wrap around at the end.
      whereinstring++
      if (whereinstring > thestring.length - 1) whereinstring = 0
    }
  }
}, settings)
