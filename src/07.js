const canvasSketch = require('canvas-sketch')
const { chance, range, rangeFloor } = require('canvas-sketch-util/random')
const Two = require('two.js')

const settings = {
  animate: true
}

// Configuration
const leg_length = 60
const joggers_count = 200

const sketch = ({ canvas, width, height }) => {
  // Create a new Two.js instance with our existing canvas
  const two = new Two({ domElement: canvas })

  let joggers = [...Array(joggers_count).keys()].map((i) => {
    let y = range(0, 300)

    let leg1 = new Two.Line(0, 0, 0, leg_length)
    let leg2 = new Two.Line(0, 0, 0, leg_length)

    let jogger = two.makeGroup(leg1, leg2)
    jogger.speed = range(1, 5)
    jogger.translation.set(-50, y)
    jogger.isMoving = false

    setTimeout(() => {
      jogger.isMoving = true
    }, i * 100)

    return jogger
  })

  for (var i = 0; i <= width; i += 40) {
    let road = new Two.Line(i, 200, i + 20, 200)
    two.add(road)
  }

  return {
    resize({ pixelRatio, width, height }) {
      // Update width and height of Two.js scene based on
      // canvas-sketch auto changing viewport parameters
      two.width = width
      two.height = height
      two.ratio = pixelRatio

      // This needs to be passed down to the renderer's width and height as well
      two.renderer.width = width
      two.renderer.height = height

      // Orient the scene to make 0, 0 the center of the canvas
      two.scene.translation.set(0, two.height / 2 - 200)
      // joggers.center()
    },
    render({ time }) {
      // Animate the joggers
      joggers.forEach((jogger, i) => {
        if (jogger.isMoving) {
          jogger.translation.set(
            jogger.position.x + jogger.speed,
            jogger.position.y
          )
        }

        if (jogger.position.x > width + 50) {
          jogger.translation.set(-50, jogger.position.y)

          // Stop movement
          jogger.isMoving = false

          // Wait until the last jogger start moving until moving again
          setTimeout(() => {
            jogger.isMoving = true
          }, (joggers_count / 2 + i) * 100)
        }

        jogger.children.forEach((leg, i) => {
          leg.rotation =
            i == 0
              ? Math.sin(time * Math.max(jogger.speed, 4))
              : Math.sin(-time * Math.max(jogger.speed, 4))
        })
      })

      // Update two.js via the `render` method - *not* the `update` method.
      two.render()
    }
  }
}

canvasSketch(sketch, settings)
