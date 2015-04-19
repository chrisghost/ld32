class Box {
  constructor(x, y, sprite = 'furniture1') {
     this.tile = game.add.isoSprite(
        x,
        y,
        0,
        sprite,
        0,
        game.isoGroup
    )
    //game.decorGroup.add(this.tile)

   this.points = 0
    game.physics.isoArcade.enable(this.tile.body)
    this.tile.item = this
    this.tile.anchor.set(0.5, 0.5)
    this.tile.smoothed = false

    this.tile.body.immovable = true
    this.tile.body.moves = false
    this.tile.body.mass = 5

    this.tile.body.collideWorldBounds = true

  }
  break() { }
  isCat() { return false }
  getx() { return this.tile.body.position.x }
  gety() { return this.tile.body.position.y }
}

export default Box
