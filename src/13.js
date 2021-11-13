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

  let path = new Two.Path(anchors)
  path.curved = true
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
  let building = new Two.Group()

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

        for (var t = 0; t <= 600; t += 10) {
          let path = makePath(two, i % 2, [
            [t, height / 2],
            [t + 150, height / 2],
            [t, -height / 4],
            [t, height / 2.25]
          ])

          paths.push(path)
          building.add(path)
          i++
        }
      }

      two.add(building)

      // two.makeLine(-width, 0, width, 0)
      // two.makeLine(0, 0, 10, 0)

      // Orient the scene to make 0, 0 the center of the canvas
      two.scene.translation.set(two.width / 2, two.height / 2)
      building.center()

      // two.scene.rotation = (45 * Math.PI) / 180

      // building.rotation = (90 * Math.PI) / 180
    },
    render({ time }) {
      // Update two.js via the `render` method - *not* the `update` method.
      for (var i = 0; i < paths.length; i++) {
        let path = paths[i]

        // 🤷 Funny "boudins qui remuent"
        // vertices.y += Math.sin(time) * 0.08 * Math.cos(i)

        // sin(time * )
        let vertices = path.vertices[0]
        vertices.y += Math.sin(time * 4) * 0.5

        vertices = path.vertices[2]
        vertices.y += Math.sin(time + i * 16) * 0.75
      }

      two.render()
    }
  }
}

canvasSketch(sketch, settings)
