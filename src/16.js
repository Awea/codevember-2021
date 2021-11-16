const canvasSketch = require('canvas-sketch')
const { rangeFloor } = require('canvas-sketch-util/random')
const { lerp } = require('canvas-sketch-util/math')

const settings = {
  // Enable an animation loop
  animate: true
}

// Configuration
let gravity = 10
let mass = 100
let positionY = 0
let positionX = 600
let velocityY = 0
let velocityX = 0
let timeStep = 0.28
let anchorX = 0
let anchorY = 0
let k = 20
let damping = 8

// Internals
let springing = true
let lastX = 0
let lastY = 0
let lastTime = 0
let newX = 0
let newY = 0

// Start the sketch
canvasSketch(() => {
  return ({ context, width, height, time }) => {
    // Background
    context.fillStyle = 'blue'
    context.fillRect(0, 0, width, height)

    // Center spring anchor
    anchorX = width / 2
    anchorY = height / 2

    if (!springing) {
      let duration = 2
      let t = (time - lastTime) / duration

      if (t >= 1) {
        springing = true
      } else {
        positionX = lerp(lastX, newX, t)
        positionY = lerp(lastY, newY, t)
      }
    }

    if (springing) {
      // Spring force calculations
      let springForceY = -k * (positionY - anchorY)
      let springForceX = -k * (positionX - anchorX)

      let dampingForceY = damping * velocityY
      let dampingForceX = damping * velocityX

      let forceY = springForceY + mass * gravity - dampingForceY
      let forceX = springForceX - dampingForceX

      let accelerationY = forceY / mass
      let accelerationX = forceX / mass

      velocityY = velocityY + accelerationY * timeStep
      velocityX = velocityX + accelerationX * timeStep

      positionY = positionY + velocityY * timeStep
      positionX = positionX + velocityX * timeStep
    }

    // Reset spring when not moving
    if (Math.abs(velocityX) <= 0.1 && Math.abs(velocityY) <= 0.1 && springing) {
      lastTime = time
      lastX = positionX
      lastY = positionY
      newX = rangeFloor(width)
      newY = rangeFloor(height)

      springing = false
    }

    // Draw
    context.fillStyle = 'red'

    context.beginPath()
    context.moveTo(positionX, positionY)
    context.lineTo(anchorX, anchorY)
    context.stroke()

    context.beginPath()
    context.arc(positionX, positionY, 50, 0, 2 * Math.PI, false)
    context.fill()
  }
}, settings)
