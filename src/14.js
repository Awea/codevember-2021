const canvasSketch = require('canvas-sketch')
const p5 = require('p5')

// p5 required is != from p5 within canvas-sketch preload/render 🤷
const p5Vector = p5.Vector

let flock

// Example from https://p5js.org/examples/simulate-flocking.html
const preload = (p5) => {
  // The Nature of Code
  // Daniel Shiffman
  // http://natureofcode.com

  // Flock object
  // Does very little, simply manages the array of all the boids

  class Flock {
    constructor() {
      // An array for all the boids
      this.boids = [] // Initialize the array
    }

    run() {
      for (let i = 0; i < this.boids.length; i++) {
        this.boids[i].run(this.boids) // Passing the entire list of boids to each boid individually
      }
    }

    addBoid(b) {
      this.boids.push(b)
    }
  }

  // The Nature of Code
  // Daniel Shiffman
  // http://natureofcode.com

  // Boid class
  // Methods for Separation, Cohesion, Alignment added

  class Boid {
    constructor(x, y) {
      this.acceleration = p5.createVector(0, 0)
      this.velocity = p5.createVector(p5.random(-1, 1), p5.random(-1, 1))
      this.position = p5.createVector(x, y)
      this.r = p5.random(5, 10)
      this.maxspeed = 3 // Maximum speed
      this.maxforce = 0.05 // Maximum steering force
    }

    run(boids) {
      this.flock(boids)
      this.update()
      this.borders()
      this.render()
    }

    applyForce(force) {
      // We could add mass here if we want A = F / M
      this.acceleration.add(force)
    }

    flock(boids) {
      // We accumulate a new acceleration each time based on three rules
      let sep = this.separate(boids) // Separation
      let ali = this.align(boids) // Alignment
      let coh = this.cohesion(boids) // Cohesion
      // Arbitrarily weight these forces
      sep.mult(2)
      ali.mult(1.0)
      coh.mult(1.0)
      // Add the force vectors to acceleration
      this.applyForce(sep)
      this.applyForce(ali)
      this.applyForce(coh)
    }

    // Method to update location
    update() {
      // Update velocity
      this.velocity.add(this.acceleration)
      // Limit speed
      this.velocity.limit(this.maxspeed)
      this.position.add(this.velocity)
      // Reset accelertion to 0 each cycle
      this.acceleration.mult(0)
    }

    // A method that calculates and applies a steering force towards a target
    // STEER = DESIRED MINUS VELOCITY
    seek(target) {
      let desired = p5Vector.sub(target, this.position) // A vector pointing from the location to the target
      // Normalize desired and scale to maximum speed
      desired.normalize()
      desired.mult(this.maxspeed)
      // Steering = Desired minus Velocity
      let steer = p5Vector.sub(desired, this.velocity)
      steer.limit(this.maxforce) // Limit to maximum steering force
      return steer
    }

    // Draw a triangle rotated in the direction of velocity
    render() {
      let theta = this.velocity.heading() + p5.radians(90)
      p5.fill(127)
      p5.stroke(200)
      p5.push()
      p5.translate(this.position.x, this.position.y)
      p5.rotate(theta)
      // p5.line(0, 0, 20, 20)
      p5.beginShape()
      p5.vertex(0, -this.r * 2)
      p5.vertex(-this.r, this.r * 2)
      p5.vertex(this.r, this.r * 2)
      p5.endShape(p5.CLOSE)
      p5.pop()
    }

    // Wraparound
    borders() {
      if (this.position.x < -this.r) this.position.x = p5.width + this.r
      if (this.position.y < -this.r) this.position.y = p5.height + this.r
      if (this.position.x > p5.width + this.r) this.position.x = -this.r
      if (this.position.y > p5.height + this.r) this.position.y = -this.r
    }

    // Separation
    // Method checks for nearby boids and steers away
    separate(boids) {
      let desiredseparation = 50
      let steer = p5.createVector(0, 0)
      let count = 0
      // For every boid in the system, check if it's too close
      // console.log(p5)

      for (let i = 0; i < boids.length; i++) {
        let d = p5Vector.dist(this.position, boids[i].position)
        // If the distance is greater than 0 and less than an arbitrary amount (0 when you are yourself)
        if (d > 0 && d < desiredseparation) {
          // Calculate vector pointing away from neighbor
          let diff = p5Vector.sub(this.position, boids[i].position)
          diff.normalize()
          diff.div(d) // Weight by distance
          steer.add(diff)
          count++ // Keep track of how many
        }
      }
      // Average -- divide by how many
      if (count > 0) {
        steer.div(count)
      }

      // As long as the vector is greater than 0
      if (steer.mag() > 0) {
        // Implement Reynolds: Steering = Desired - Velocity
        steer.normalize()
        steer.mult(this.maxspeed)
        steer.sub(this.velocity)
        steer.limit(this.maxforce)
      }
      return steer
    }

    // Alignment
    // For every nearby boid in the system, calculate the average velocity
    align(boids) {
      let neighbordist = 50
      let sum = p5.createVector(0, 0)
      let count = 0
      for (let i = 0; i < boids.length; i++) {
        let d = p5Vector.dist(this.position, boids[i].position)
        if (d > 0 && d < neighbordist) {
          sum.add(boids[i].velocity)
          count++
        }
      }
      if (count > 0) {
        sum.div(count)
        sum.normalize()
        sum.mult(this.maxspeed)
        let steer = p5Vector.sub(sum, this.velocity)
        steer.limit(this.maxforce)
        return steer
      } else {
        return p5.createVector(0, 0)
      }
    }

    // Cohesion
    // For the average location (i.e. center) of all nearby boids, calculate steering vector towards that location
    cohesion(boids) {
      let neighbordist = 50
      let sum = p5.createVector(0, 0) // Start with empty vector to accumulate all locations
      let count = 0
      for (let i = 0; i < boids.length; i++) {
        let d = p5Vector.dist(this.position, boids[i].position)
        if (d > 0 && d < neighbordist) {
          sum.add(boids[i].position) // Add location
          count++
        }
      }
      if (count > 0) {
        sum.div(count)
        return this.seek(sum) // Steer towards the location
      } else {
        return p5.createVector(0, 0)
      }
    }
  }

  flock = new Flock()
  // Add an initial set of boids into the system
  for (let i = 0; i < 100; i++) {
    // let b = new Boid(width / 2, height / 2)
    let b = new Boid(700, 500)
    flock.addBoid(b)
  }
}

const settings = {
  // Pass the p5 instance, and preload function if necessary
  p5: { p5, preload },
  // Turn on a render loop
  animate: true
}

canvasSketch(() => {
  // Return a renderer, which is like p5.js 'draw' function
  return ({ p5, time, width, height }) => {
    p5.background(40, 80)
    flock.run()
  }
}, settings)
