class Laser {
  constructor() {
    this.tile = game.add.isoSprite(
        0,
        0,
        0,
        'laser',
        0,
        game.isoGroup
    )
    this.tile.body.mass = 0
    this.tile.anchor.set(0.5, 0)
    this.tile.smoothed = false
    this.tile.body.moves = true
    this.tile.body.allowGravity = false

    this.tile.body.collideWorldBounds = true

    this.speed = 10

  }
  update() {
      if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
        this.tile.body.x -= this.speed
        this.tile.body.y += this.speed
      }
      if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
        this.tile.body.x += this.speed
        this.tile.body.y -= this.speed
      }
      if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
        this.tile.body.x += this.speed
        this.tile.body.y += this.speed
      }
      if(game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
        this.tile.body.x -= this.speed
        this.tile.body.y -= this.speed
      }
  }
}

export default Laser
