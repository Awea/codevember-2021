const canvasSketch = require('canvas-sketch')
const { range } = require('canvas-sketch-util/random')

const settings = {
  // Enable an animation loop
  animate: true
}

let theta
let treeSize = 0
let treeMax = 600

// Copy from: https://p5js.org/examples/simulate-recursive-tree.html
function draw(context, width, height) {
  // background(0)
  // frameRate(30)
  // stroke(255)
  // Let's pick an angle 0 to 90 degrees based on the mouse position
  // let a = (mouseX / width) * 90
  let a = 50
  // Convert it to radians
  theta = (a * Math.PI) / 180
  // Start the tree from the bottom of the screen
  context.translate(width / 2, height)
  // Draw a line 120 pixels
  // context.beginPath()
  context.lineTo(0, 0, 0, -120)
  context.stroke()
  // Move to the end of that line
  context.translate(0, -120)
  // Start the recursive branching!
  branch(context, treeSize)
}

function branch(context, h) {
  // Each branch will be 2/3rds the size of the previous one
  h *= 0.66

  // All recursive functions must have an exit condition!!!!
  // Here, ours is when the length of the branch is 2 pixels or less
  if (h > 5) {
    // context.beginPath()
    context.save() // Save the current state of transformation (i.e. where are we now)
    context.rotate(theta) // Rotate by theta
    context.lineTo(0, 0, 0, -h) // Draw the branch
    context.stroke()
    context.translate(0, -h) // Move to the end of the branch
    branch(context, h) // Ok, now call myself to draw two new branches!!
    context.restore() // Whenever we get back here, we "pop" in order to restore the previous matrix state

    // Repeat the same thing, only branch off to the "left" this time!
    context.save()
    context.rotate(-theta)
    context.lineTo(0, 0, 0, -h)
    context.beginPath()
    context.stroke()
    context.translate(0, -h)
    branch(context, h)
    context.restore()
  }
}

let way = 1

// Start the sketch
canvasSketch(() => {
  return {
    begin({ context, width, height }) {
      // draw(context, width, height)
    },
    render({ context, width, height, time }) {
      // context.clearRect(0, 0, width, height)

      if (treeSize >= treeMax) {
        way = -1
        // context.strokeStyle = 'white'
      }

      if (treeSize <= 0) {
        way = 1
      }

      let r = range(100, 255)
      let g = range(100, 255)
      let b = range(100, 255)
      let a = range(50, 100)

      context.strokeStyle = `rgba(${r}, ${g}, ${b}, ${a})`

      treeSize = treeSize + way * 1
      draw(context, width, height)
      // branch(context, 10)
    }
  }
}, settings)
