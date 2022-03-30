class Sprite {
    constructor({
      position,
      velocity = 2,
      image,
      frames = {max: 1, hold: 20},
      sprites,
      animate = false,
      rotation = 0
    }) {
      this.position = position
      this.image = new Image()
      this.velocity = velocity
      this.frames = {...frames, val: 0, elapse: 0}
      this.image.onload = () => {
        this.width = this.image.width / this.frames.max
        this.height = this.image.height
      }
      this.image.src = image.src
  
      this.animate = animate
      this.sprites = sprites
      this.opacity = 1
      this.rotation = rotation
    }
  
    draw() {
      c.save()
      c.translate(
        this.position.x + this.width / 2,
        this.position.y + this.height / 2
      )
      c.rotate(this.rotation)
      c.translate(
        -this.position.x - this.width / 2,
        -this.position.y - this.height / 2
      )
      c.globalAlpha = this.opacity
      c.drawImage(
        this.image,
        this.frames.val * this.width,
        0,
        this.image.width / this.frames.max,
        this.image.height,
        this.position.x,
        this.position.y,
        this.image.width / this.frames.max,
        this.image.height
      )
      c.restore()
  
      if (!this.animate) return
  
      if (this.frames.max > 1) {
        this.frames.elapse++
      }
  
      if (this.frames.elapse % this.frames.hold == 0) {
        if (this.frames.val < this.frames.max - 1) this.frames.val++
        else this.frames.val = 0
      }
    }
  }