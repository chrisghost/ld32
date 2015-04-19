class Breakable {
  constructor(x, y, sprite = 'box', z = 0) {
     this.tile = game.add.isoSprite(
        x,
        y,
        z,
        sprite,
        0,
        game.isoGroup
    )
    //game.breakableGroup.add(this.tile)

    this.tile.frame = 0

    game.physics.isoArcade.enable(this.tile.body)
    this.tile.item = this
    this.tile.anchor.set(0.5, 0.5)
    this.tile.smoothed = false

    this.tile.body.moves = true
    this.tile.body.mass = 0.1

    this.tile.body.collideWorldBounds = true

  }
  break() { this.tile.frame = 1 }
  isCat() { return false }
  getx() { return this.tile.body.position.x }
  gety() { return this.tile.body.position.y }
}

export default Breakable
