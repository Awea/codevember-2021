const canvasSketch = require('canvas-sketch')
const settings = {
  // Enable an animation loop
  animate: true
}

let animateTriangles = false
const animateTimeout = 1.5

setTimeout(() => (animateTriangles = true), animateTimeout * 1000)

// Draw a triangle using bottom left coordinates
function redTriangle(xA, xB, width, height, time) {
  this.fillStyle = 'red'
  this.beginPath()
  this.moveTo(xA, xB + height)

  // 🤷 Coordinates on a triangle?
  // for (var i = 1; i <= 3; i++) {
  //   let x1 = (xA * i) / 3
  //   let y1 = ((xB + width) * i) / 3

  //   this.lineTo(x1, y1)
  // }

  let animateX = 0
  let animateY = 0

  if (animateTriangles) {
    animateX = Math.sin(time - animateTimeout) * 250
    animateY = Math.sin(time - animateTimeout) * 300
  }

  this.lineTo(
    (xA + xA + width) / 2 + animateX,
    (xB + xB + height) / 2 - animateY / 10
  )
  this.lineTo(xA + width, xB)

  // let animateY = 0

  this.lineTo(xA + width, xB + height + animateY)
  this.fill()
  // this.closePath()
}

let triangle =
  // Start the sketch
  canvasSketch(() => {
    return {
      begin({ context, width, height }) {},
      render({ context, width, height, time }) {
        context.fillStyle = 'purple'
        context.fillRect(0, 0, width, height)

        let borderSize = Math.min(width, height) / 10
        let containerWidth = Math.min(800, width - borderSize)
        let containerHeight = height - borderSize

        let containerX = width / 2 - containerWidth / 2
        let containerY = height / 2 - containerHeight / 2

        let stripeWidth = containerWidth
        let stripeHeight = containerHeight / 2

        context.fillStyle = 'black'
        context.fillRect(containerX, containerY, stripeWidth, stripeHeight * 2)

        context.beginPath()
        context.rect(containerX, containerY, stripeWidth, stripeHeight * 2)
        context.clip()

        redTriangle.bind(context)(
          containerX,
          containerY,
          stripeWidth,
          stripeHeight,
          time
        )

        // context.restore()

        context.translate(0, stripeHeight)

        redTriangle.bind(context)(
          containerX,
          containerY,
          stripeWidth,
          stripeHeight,
          time
        )
      }
    }
  }, settings)
