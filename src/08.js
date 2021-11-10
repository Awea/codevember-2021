const canvasSketch = require('canvas-sketch')
const Two = require('two.js')

const settings = {
  animate: true
}

const sketch = ({ canvas, width, height }) => {
  // Create a new Two.js instance with our existing canvas
  const two = new Two({ domElement: canvas })

  var points = []
  for (var i = 0; i < 100; i++) {
    var x = Math.random() * two.width
    var y = Math.random() * two.height
    var p = new Two.Anchor(x, y)

    points.push(p)
  }

  var path = new Two.Path(points)
  path.curved = true
  path.automatic = true
  two.add(path)

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
      two.scene.translation.set(two.width / 2, two.height / 2)
      path.center()
    },
    render({ time }) {
      path.vertices.forEach((vertice, i) => {
        vertice.x -= Math.cos(0.1 * i * time)
        vertice.y -= Math.cos(0.1 * i * time)
      })

      // Update two.js via the `render` method - *not* the `update` method.
      two.render()
    }
  }
}

canvasSketch(sketch, settings)
