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

    for (let i = 0; i < data.length; i += 4) {
      if (data[i + 3] == 0) {
        data[i + 3] = 255
      } else {
        let randIndex = rangeFloor(0, data.length - 1)

        data[i] = data[randIndex]
        data[i + 3] = rangeFloor(data[i + 3], Math.min(data[i + 3] + 5, 255))
      }
    }

    // Put new pixels back into canvas
    context.putImageData(pixels, 0, 0)
  }
}, settings)
