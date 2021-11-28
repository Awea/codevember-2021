const canvasSketch = require('canvas-sketch')
const { range } = require('canvas-sketch-util/random')
const { lerp } = require('canvas-sketch-util/math')

const settings = {
  // Enable an animation loop
  animate: true
}

// Start the sketch
canvasSketch(() => {
  return {
    begin({ context, width, height }) {},
    render({ context, width, height, time }) {
      context.fillStyle = 'purple'
      context.fillRect(0, 0, width, height)

      let containerSize = Math.min(width, height)
      let containerX = width / 2 - containerSize / 2
      let containerY = height / 2 - containerSize / 2
      context.fillStyle = 'pink'
      context.fillRect(containerX, containerY, containerSize, containerSize)

      let stripeWidth = containerSize / 5

      context.save()
      context.translate(
        containerX + stripeWidth / 2,
        containerY + stripeWidth / 2
      )
      for (var i = 0; i < 3; i++) {
        context.fillStyle = 'red'
        context.fillRect(0, 0, stripeWidth, containerSize - stripeWidth)

        let f = lerp(0, containerSize - stripeWidth, Math.sin(time - i))

        context.fillStyle = 'black'
        context.fillRect(0, 0, stripeWidth, Math.abs(f))
        context.translate(stripeWidth + stripeWidth / 2, 0)
      }
      context.restore()
    }
  }
}, settings)
