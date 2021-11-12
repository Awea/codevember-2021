const canvasSketch = require('canvas-sketch')
const { range } = require('canvas-sketch-util/random')
const Two = require('two.js')

const settings = {
  animate: true
}

function makePath(two, even, points) {
  let anchors = points.map((point) => {
    return new Two.Anchor(point[0], point[1])
  })

  let path = two.makePath(anchors)
  // path.curved = true
  // path.closed = false
  // path.automatic = true

  if (even) {
    path.fill = 'red'
  }

  return path
}

const sketch = ({ canvas, width, height }) => {
  // Create a new Two.js instance with our existing canvas
  const two = new Two({ domElement: canvas })
  let paths = []

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

      if (paths.length == 0) {
        let i = 0

        for (var t = width; t >= 10; t -= 10) {
          let path = makePath(two, i % 2, [
            [width, height / 2 - 50],
            [t, -300],
            [t, -150]
          ])

          paths.push(path)
          i++
        }
      }

      // Orient the scene to make 0, 0 the center of the canvas
      two.scene.translation.set(0, two.height / 2)
    },
    render({ time }) {
      // Update two.js via the `render` method - *not* the `update` method.
      for (var i = 0; i < paths.length; i++) {
        let path = paths[i]
        let vertices = path.vertices[1]

        vertices.y += Math.sin(time) * 0.08 * i
      }

      two.render()
    }
  }
}

canvasSketch(sketch, settings)
