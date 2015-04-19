import range from 'app/range'
import {SIZE} from 'app/constants'

class Cat {
  constructor() {
    this.tile = game.add.isoSprite(
        100,
        100,
        0,
        'cat',
        0,
        game.isoGroup
    )

    //game.catGroup.add(this.tile)
    this.tile.anchor.set(0.5, 0.5)
    this.tile.smoothed = false

    this.animation = []
    this.animation['right']       = this.tile.animations.add('right', range(0, 7))
    this.animation['left']        = this.tile.animations.add('left', range(8, 15))
    this.animation['down']        = this.tile.animations.add('down', range(16, 23))
    this.animation['top']         = this.tile.animations.add('top', range(24, 31))
    this.animation['topleft']     = this.tile.animations.add('topleft', range(32, 39))
    this.animation['topright']    = this.tile.animations.add('topright', range(40, 47))
    this.animation['downright']   = this.tile.animations.add('downright', range(48, 55))
    this.animation['downleft']    = this.tile.animations.add('downleft', range(56, 63))

    game.physics.isoArcade.enable(this.tile.body)
    this.tile.item = this
    this.tile.body.moves = true

    this.tile.body.velocity = { x:0, y:0 }

    this.vel = 300
    this.minDistance = SIZE*2
    this.tile.body.maxVelocity.x = this.vel
    this.tile.body.maxVelocity.y = this.vel


    this.tile.body.mass = 1
    this.tile.body.collideWorldBounds = true

    this.currentAnimation = 'left'

  }
  isCat() { return true }
  getx() { return this.tile.body.position.x }
  gety() { return this.tile.body.position.y }
  update(pLocX, pLocY) {
    var distance = game.math.distance(this.getx(), this.gety(), pLocX, pLocY)

    if (distance > this.minDistance) {
        var rotation = game.math.angleBetween(this.getx(), this.gety(), pLocX, pLocY)

        var xDir = Math.cos(rotation)
        var yDir = Math.sin(rotation)

        this.tile.body.acceleration.x = xDir * this.vel
        this.tile.body.acceleration.y = yDir * this.vel


        var nAnim = this.currentAnimation

        var xmv = (Math.abs(xDir) < 0.1) ? 0 : ((xDir < 0) ? -1 : 1)
        var ymv = (Math.abs(yDir) < 0.1) ? 0 : ((yDir < 0) ? -1 : 1)

        if(xmv == 0) {
          if(ymv == 0) {
            nAnim = 'NONE'
          }
          else if(ymv == 1) {
            nAnim = 'downleft'
          }
          else if(ymv == -1) {
            nAnim = 'topright'
          }
        } else if(xmv == 1) {
          if(ymv == 0) {
            nAnim = 'downright'
          }
          else if(ymv == 1) {
            nAnim = 'down'
          }
          else if(ymv == -1) {
            nAnim = 'right'
          }
        } else if(xmv == -1) {
          if(ymv == 0) {
            nAnim = 'topleft'
          }
          else if(ymv == 1) {
            nAnim = 'left'
          }
          else if(ymv == -1) {
            nAnim = 'top'
          }
        }

        if(nAnim != this.currentAnimation) {
          this.currentAnimation = nAnim
          if(nAnim != 'NONE')
          this.animation[nAnim].play(30, true)
        }

    } else {
        this.tile.body.acceleration.setTo(0, 0)
        this.tile.body.velocity.x = 0
        this.tile.body.velocity.y = 0
    }
  }
}

export default Cat
