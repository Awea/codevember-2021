const canvasSketch = require('canvas-sketch')
const { rangeFloor, chance, shuffle } = require('canvas-sketch-util/random')
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
    // Background
    context.fillStyle = 'red'
    context.fillRect(0, 0, width, height)

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
    const data = pixels.data
    let len = height

    while (len) {
      const newX = rangeFloor(len-- * Math.sin(time))
      const oldX = len

      // Sometimes leave row intact
      if (chance(0.2)) continue

      for (let y = 0; y < width; y++) {
        // Sometimes leave column intact
        if (chance(0.7)) continue

        // Copy new random column into old column
        const newIndex = newX + y * height
        const oldIndex = oldX + y * height

        data[oldIndex * 4] = data[newIndex * 4]
      }
    }

    // Put new pixels back into canvas
    context.putImageData(pixels, 0, 0)
  }
}, settings)
