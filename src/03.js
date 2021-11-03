const canvasSketch = require('canvas-sketch')
const { rangeFloor } = require('canvas-sketch-util/random')
const load = require('load-asset')

const settings = {
  // Enable an animation loop
  animate: true
}

// Start the sketch
canvasSketch(async () => {
  let cat = await load({
    url: 'assets/03/cat.png',
    type: 'image'
  })

  return ({ context, width, height, time }) => {
    // Draw the loaded image to the canvas
    if (width > height) {
      let ratio = cat.height / cat.width

      context.drawImage(
        cat,
        (width - height * ratio) / 2.5,
        0,
        height * ratio,
        height
      )
    } else {
      let ratio = cat.width / cat.height

      context.drawImage(cat, 0, 0, width, width * ratio)
    }

    // Extract bitmap pixel data
    let pixels = context.getImageData(0, 0, width, height)

    // Manipulate pixel data
    let data = pixels.data

    for (let i = 0; i < data.length; i += 32) {
      // Don't mess with white pixels
      if (data[i + 3] == 0) continue

      let randIndex = rangeFloor(i, data.length - 1)

      data[i] = data[randIndex]
      // data[i] = rangeFloor(0, 255)
      // data[i + 1] = rangeFloor(40, 50)
      // data[i + 2] = rangeFloor(80, 150)
      data[i + 3] = rangeFloor(0, 255)
    }

    // Put new pixels back into canvas
    context.putImageData(pixels, 0, 0)
  }
}, settings)
