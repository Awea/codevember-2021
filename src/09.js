const canvasSketch = require('canvas-sketch')
const { range } = require('canvas-sketch-util/random')
const Two = require('two.js')

const settings = {
  animate: true
}

// Configuration
const blobPoints = 50
const blobSize = 260
const blobRadius = blobSize / 2
const blobSpeed = 0.06

// const

function randomBlob(two, blob) {
  for (let i = 0; i < blob.vertices.length; i++) {
    let v = blob.vertices[i]
    let pct = (i + 1) / blob.vertices.length
    let theta = pct * Math.PI * 2
    let radius = (Math.random() * two.height) / 3 + two.height / 6
    // let radius = range(1, 1.1) * blobRadius
    // let radius = blobSize
    let x = radius * Math.cos(theta)
    let y = radius * Math.sin(theta)
    v.origin = new Two.Vector(v.x, v.y)
    v.destination = new Two.Vector(x, y)
  }
}

const sketch = ({ canvas, width, height }) => {
  // Create a new Two.js instance with our existing canvas
  const two = new Two({ domElement: canvas })

  let points = []
  const tMax = 150

  for (var t = 0; t <= tMax; t++) {
    // 🐛 An attempt to re-do the example from
    // https://two.js.org/examples/morph.html (using makeCircle doesn't work here for some reason) using Two.Anchor and Two.Path
    // This isn't working correctly but it does look good 🤷
    let x = blobRadius * Math.cos(t)
    let y = blobRadius * Math.sin(t)

    // Use this version with tMax = 360 to have a working blob
    // let x = blobRadius * Math.cos((t * Math.PI) / 180)
    // let y = blobRadius * Math.sin((t * Math.PI) / 180)

    let p = new Two.Anchor(x, y)

    points.push(p)
  }

  let blob = new Two.Path(points)

  // 🤷 Produce strange effect (curve overlaps)
  // blob.curved = true
  // blob.closed = true
  // blob.automatic = true
  blob.fill = 'red'
  blob.blobed = false
  // blob.noStroke()
  two.add(blob)

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

      // Init blob first destination
      randomBlob(two, blob)

      // Orient the scene to make 0, 0 the center of the canvas
      two.scene.translation.set(two.width / 2, two.height / 2)
      blob.center()
    },
    render({ time }) {
      if (blob.blobed) {
        for (let i = 0; i < blob.vertices.length; i++) {
          let v = blob.vertices[i]
          let d = v.origin

          if (v.equals(d)) {
            randomBlob(two, blob)
            blob.blobed = false
            break
          }

          v.x += (d.x - v.x) * blobSpeed
          v.y += (d.y - v.y) * blobSpeed
        }
      } else {
        for (let i = 0; i < blob.vertices.length; i++) {
          let v = blob.vertices[i]
          let d = v.destination

          if (v.equals(d)) {
            console.log('blobed')

            blob.blobed = true
            break
          }

          v.x += (d.x - v.x) * blobSpeed
          v.y += (d.y - v.y) * blobSpeed
        }
      }

      // Update two.js via the `render` method - *not* the `update` method.
      two.render()
    }
  }
}

canvasSketch(sketch, settings)
