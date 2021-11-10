const canvasSketch = require('canvas-sketch')
const { range } = require('canvas-sketch-util/random')
const Two = require('two.js')

const settings = {
  animate: true
}

// Configuration
const blobSize = 260
const blobRadius = blobSize / 2

function randomBlob(two, blob) {
  for (let i = 0; i < blob.vertices.length; i++) {
    let v = blob.vertices[i]
    let pct = (i + 1) / blob.vertices.length
    // PI should be multiplied by 2 but i like this effect
    let theta = pct * Math.PI * 2048
    let radius = range(1.1, 1.5) * blobRadius
    let x = radius * Math.cos(theta)
    let y = radius * Math.sin(theta)
    v.origin = new Two.Vector(v.x, v.y)
    v.destination = new Two.Vector(x, y)
  }
}

function blobPoints(tStart = 0, tMax = 150) {
  let points = []

  for (var t = tStart; t <= tMax; t++) {
    // PI should be divided by 180 but i like this effect
    let x = blobRadius * Math.cos((t * Math.PI) / 180)
    // let x = blobRadius * Math.cos(t * Math.PI)
    let y = blobRadius * Math.sin((t * Math.PI) / 180)

    let p = new Two.Anchor(x, y)

    points.push(p)
  }

  return points
}

function updateBlobVertices(two, blob) {
  if (blob.blobed) {
    for (let i = 0; i < blob.vertices.length; i++) {
      let v = blob.vertices[i]
      let d = v.origin

      if (v.equals(d)) {
        randomBlob(two, blob)
        blob.blobed = false
        break
      }

      v.x += (d.x - v.x) * blob.blobSpeed
      v.y += (d.y - v.y) * blob.blobSpeed
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

      v.x += (d.x - v.x) * blob.blobSpeed
      v.y += (d.y - v.y) * blob.blobSpeed
    }
  }
}

const sketch = ({ canvas, width, height }) => {
  // Create a new Two.js instance with our existing canvas
  const two = new Two({ domElement: canvas })

  let pointsB = blobPoints(0, 360)
  let blobB = new Two.Path(pointsB)
  // blobB.curved = true
  // blobB.closed = false
  // blob.automatic = true
  blobB.fill = 'blue'
  blobB.blobed = false
  blobB.blobSpeed = 0.03
  // blobB.noStroke()
  two.add(blobB)

  // let points = blobPoints(0, 360)
  // let blob = new Two.Path(points)
  // // blob.curved = true
  // // blob.closed = true
  // // blob.automatic = true
  // blob.fill = 'red'
  // blob.blobed = false
  // blob.blobSpeed = 0.06
  // blob.noStroke()
  // two.add(blob)

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
      // randomBlob(two, blob)
      randomBlob(two, blobB)

      // Orient the scene to make 0, 0 the center of the canvas
      two.scene.translation.set(two.width / 2, two.height / 2)
      // blob.center()
    },
    render({ time }) {
      // updateBlobVertices(two, blob)
      updateBlobVertices(two, blobB)

      // Update two.js via the `render` method - *not* the `update` method.
      two.render()
    }
  }
}

canvasSketch(sketch, settings)
