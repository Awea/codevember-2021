const canvasSketch = require('canvas-sketch')
const { range } = require('canvas-sketch-util/random')

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
      context.fillStyle = 'white'
      context.fillRect(containerX, containerY, containerSize, containerSize)

      let stripe = containerSize / 2 / 3
      let y = 0
      let stripeVariation = (Math.sin(time) * width) / 10

      context.save()
      context.translate(containerX, containerY)

      for (var i = -stripe * 2; i <= containerSize + stripe * 2; i += stripe) {
        if (y % 2) {
          context.save()
          context.translate(stripeVariation, 0)
          context.fillStyle = 'red'
          context.fillRect(i, containerSize / 2, stripe, containerSize / 2)
          context.restore()
        } else {
          context.save()
          context.translate(stripeVariation, 0)
          context.fillStyle = 'red'
          context.fillRect(i, 0, stripe, containerSize / 2)
          context.restore()
        }

        y++
      }

      // Triangles
      context.fillStyle = 'black'

      context.beginPath()
      context.moveTo(0, 0)
      context.lineTo(0, containerSize)
      context.lineTo(containerSize / 2 + stripeVariation, containerSize / 2)
      context.lineTo(0, 0)
      context.fill()

      context.beginPath()
      context.moveTo(containerSize, 0)
      context.lineTo(containerSize, containerSize)
      context.lineTo(containerSize / 2 + stripeVariation, containerSize / 2)
      context.stroke()
      context.fill()

      context.restore()

      // Hide stuff
      context.fillStyle = 'purple'
      context.fillRect(0, 0, (width - containerSize) / 2, height)
      context.fillRect(
        (width - containerSize) / 2 + containerSize,
        0,
        width,
        height
      )
    }
  }
}, settings)
