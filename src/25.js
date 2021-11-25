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
let step = 10 // how much the turtle moves with each 'F'
let angle = Math.PI / 2 // how much the turtle turns with a '-' or '+'

let boxPosX
let boxPosY
let boxSize

// LINDENMAYER STUFF (L-SYSTEMS)
let thestring = 'F-F-F-F' // "axiom" or start of the string
let numloops = 5 // how many iterations to pre-compute
let therules = [] // array for rules
therules[0] = ['F', 'F[F]-F+F[--F]+F-F']
// therules[1] = ['G', 'GG']
let savedPosition = null

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

function outside(x1, y1) {
  let radius = 5

  return (
    x1 > boxPosX + boxSize ||
    x1 < boxPosX + step ||
    y1 > boxPosY + boxSize ||
    y1 < boxPosY
  )
}

function lSystem(k, context) {
  if (k == 'F') {
    // draw forward
    // polar to cartesian based on step and currentangle:
    let x1 = x + step * Math.cos(currentangle)
    let y1 = y + step * Math.sin(currentangle)

    // update the turtle's position:
    x = x1
    y = y1
  } else if (k == '+') {
    currentangle += angle // turn left
  } else if (k == '-') {
    currentangle -= angle // turn right
  } else if (k == '[') {
    savedPosition = [x, y]
  } else if (k == ']') {
    x = savedPosition[0]
    y = savedPosition[1]
  }
}

// setInterval(() => console.log(thestring), 500)

// Start the sketch
canvasSketch(() => {
  return {
    begin({ context, width, height }) {
      // context.moveTo(x, y)
      boxSize = height
      boxPosX = width / 2 - boxSize / 2
      boxPosY = height / 2 - boxSize / 2
      context.fillRect(boxPosX, boxPosY, boxSize, boxSize)

      // Start with a random position inside the box
      // x = range(boxPosX, boxPosX + boxSize)
      x = width / 2
      // y = range(boxPosY, boxPosY + boxSize)
      y = height / 2

      // COMPUTE THE L-SYSTEM
      // 🙏 https://p5js.org/examples/simulate-l-systems.html
      for (let i = 0; i < numloops; i++) {
        thestring = lindenmayer(thestring)
      }

      context.beginPath()
    },
    render({ context, width, height, time }) {
      // Background
      let prevX = x
      let prevY = y

      // Update x,y according lSystem
      lSystem(thestring[whereinstring], context)

      if (!outside(x, y)) {
        let r = range(200, 255)
        let g = range(0, 255)
        let b = range(200, 255)

        context.strokeStyle = `rgba(${r}, ${g}, ${b}, 255)`

        context.lineTo(prevX, prevY, x, y)
        context.stroke()
      } else {
        whereinstring = 0
        context.closePath()

        // Reset position
        currentangle = 0
        x = width / 2
        y = height / 2

        context.fillRect(boxPosX, boxPosY, boxSize, boxSize)

        context.beginPath()
        context.moveTo(x, y)
      }

      // increment the point for where we're reading the string.
      // wrap around at the end.
      whereinstring++
      if (whereinstring > thestring.length - 1) whereinstring = 0
    }
  }
}, settings)
