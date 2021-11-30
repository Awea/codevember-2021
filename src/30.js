const canvasSketch = require('canvas-sketch')
const { lerp } = require('canvas-sketch-util/math')

const settings = {
  // Enable an animation loop
  animate: true
}

let animateTriangles = true
const animateTimeout = 1.5

// setTimeout(() => (animateTriangles = true), animateTimeout * 1000)

// Draw a triangle using bottom left coordinates
function redTriangle(xA, xB, width, height, time) {
  this.fillStyle = 'red'
  this.beginPath()
  this.moveTo(xA, xB + height)

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

  this.lineTo(xA + width, xB + height + animateY)
  this.fill()
}

function rightPart(
  width,
  height,
  time,
  borderSize,
  containerContainerWidthUnit
) {
  let containerWidth = containerContainerWidthUnit
  let containerHeight = height - borderSize

  let containerX = width - borderSize / 2 - containerContainerWidthUnit
  let containerY = height / 2 - containerHeight / 2

  let stripeWidth = containerWidth
  let stripeHeight = containerHeight / 2

  this.fillStyle = 'black'
  this.fillRect(containerX, containerY, stripeWidth, stripeHeight * 2)

  this.beginPath()
  this.rect(containerX, containerY, stripeWidth, stripeHeight * 2)
  this.clip()

  redTriangle.bind(this)(
    containerX,
    containerY,
    stripeWidth,
    stripeHeight,
    time
  )

  this.translate(0, stripeHeight)

  redTriangle.bind(this)(
    containerX,
    containerY,
    stripeWidth,
    stripeHeight,
    time
  )
}

function bottomPart(
  width,
  height,
  time,
  borderSize,
  containerContainerWidthUnit,
  containerContainerHeightUnit
) {
  let containerWidth = containerContainerWidthUnit * 2 - borderSize / 2
  let containerHeight = containerContainerHeightUnit * 2
  let containerX = borderSize / 2
  let containerY = height - containerHeight - borderSize / 2
  this.fillStyle = 'pink'
  this.fillRect(containerX, containerY, containerWidth, containerHeight)

  let stripeWidth = containerWidth / 5
  let stripeHeight = containerHeight - stripeWidth / 2

  this.save()
  this.translate(containerX + stripeWidth / 2, containerY + stripeWidth / 4)
  for (var i = 0; i < 3; i++) {
    this.fillStyle = 'red'
    this.fillRect(0, 0, stripeWidth, stripeHeight)

    let f = lerp(0, stripeHeight, Math.sin(time - i))

    this.fillStyle = 'black'
    this.fillRect(0, 0, stripeWidth, Math.abs(f))
    this.translate(stripeWidth + stripeWidth / 2, 0)
  }
  this.restore()
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
        let containerContainerWidthUnit = (width - borderSize) / 3
        let containerContainerHeightUnit = (height - borderSize) / 5

        let containerWidth = containerContainerWidthUnit * 2 - borderSize / 2
        let containerHeight = containerContainerHeightUnit * 2
        let containerX = borderSize / 2
        let containerY = borderSize / 2
        context.fillStyle = 'white'
        context.fillRect(
          containerX,
          containerY,
          containerWidth,
          containerHeight
        )

        let stripe = containerWidth / 2 / 3
        let y = 0
        let stripeVariation = (Math.sin(time) * width) / 10

        context.save()
        context.beginPath()
        context.rect(containerX, containerY, containerWidth, containerHeight)
        context.clip()
        context.translate(containerX, containerY)

        for (
          var i = -stripe * 2;
          i <= containerWidth + stripe * 2;
          i += stripe
        ) {
          if (y % 2) {
            context.save()
            context.translate(stripeVariation, 0)
            context.fillStyle = 'red'
            context.fillRect(
              i,
              containerHeight / 2,
              stripe,
              containerHeight / 2
            )
            context.restore()
          } else {
            context.save()
            context.translate(stripeVariation, 0)
            context.fillStyle = 'red'
            context.fillRect(i, 0, stripe, containerHeight / 2)
            context.restore()
          }

          y++
        }

        // Triangles
        context.fillStyle = 'black'

        context.beginPath()
        context.moveTo(0, 0)
        context.lineTo(0, containerHeight)
        context.lineTo(
          containerWidth / 2 + stripeVariation,
          containerHeight / 2
        )
        context.lineTo(0, 0)
        context.fill()

        context.beginPath()
        context.moveTo(containerWidth, 0)
        context.lineTo(containerWidth, containerHeight)
        context.lineTo(
          containerWidth / 2 + stripeVariation,
          containerHeight / 2
        )
        context.stroke()
        context.fill()

        context.restore()

        bottomPart.bind(context)(
          width,
          height,
          time,
          borderSize,
          containerContainerWidthUnit,
          containerContainerHeightUnit
        )

        rightPart.bind(context)(
          width,
          height,
          time,
          borderSize,
          containerContainerWidthUnit
        )
      }
    }
  }, settings)
