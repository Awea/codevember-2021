const canvasSketch = require('canvas-sketch')
const { rangeFloor } = require('canvas-sketch-util/random')

const settings = {
  // Enable an animation loop
  animate: true,
}

function addGrid(context, width, height, display = true) {
  const cellSize = 50
  let xCells = 0
  let yCells = 0
  let borderX = width % cellSize
  borderX = borderX > 0 ? borderX / 2 : borderX

  for (var i = borderX; i < width - borderX + cellSize; i += cellSize) {
    if (display) {
      context.beginPath()
      context.strokeStyle = '#ECEFF1'
      context.moveTo(i, 0)
      context.lineTo(i, height)
      context.stroke()
    }
    xCells++
  }

  let borderY = height % cellSize
  borderY = borderY > 0 ? borderY / 2 : borderY

  for (var i = borderY; i < height - borderY + cellSize; i += cellSize) {
    if (display) {
      context.beginPath()
      context.strokeStyle = '#ECEFF1'
      context.moveTo(0, i)
      context.lineTo(width, i)
      context.stroke()
    }
    yCells++
  }

  return {
    cellSize: cellSize,
    borderY: borderY,
    borderX: borderX,
    xCells: xCells,
    yCells: yCells,
  }
}

const light_blue = '#CFD8DC'
const medium_blue = '#607D8B'
const heavy_blue = '#2E3561'

let cells = []

// Start the sketch
canvasSketch(() => {
  return ({ context, width, height, time }) => {
    // Background
    context.fillStyle = light_blue
    context.fillRect(0, 0, width, height)

    // Create a grid
    const grid = addGrid(context, width, height, false)

    // Offset display using grid border
    context.transform(1, 0, 0, 1, grid.borderX, grid.borderY)

    let xCell = rangeFloor(grid.xCells - 1)
    let yCell = rangeFloor(grid.yCells - 1)
    let existingCellIndex = cells.findIndex(
      (cell) => cell.x == xCell && cell.y == yCell
    )

    if (existingCellIndex != -1) {
      cell = cells[existingCellIndex]
      color = cell.color

      if (color == medium_blue) {
        color = heavy_blue
      } else if (color == heavy_blue) {
        color = light_blue
      } else {
        color = medium_blue
      }

      cells.splice(existingCellIndex, 1, { ...cell, color: color })
    } else {
      cells.push({ x: xCell, y: yCell, color: medium_blue })
    }

    cells.forEach((cell, cellIndex) => {
      context.fillStyle = cell.color
      context.fillRect(
        cell.x * grid.cellSize,
        cell.y * grid.cellSize,
        grid.cellSize,
        grid.cellSize
      )
    })
  }
}, settings)
