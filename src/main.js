import lvl1 from 'levels/first'

class Game {
  constructor() {
    this.cursorPos = null
    window.game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser', { preload: this.preload, create: this.create, update: this.update, render: this.render })
  }
  preload() {

    game.time.advancedTiming = true
    game.debug.renderShadow = false
    game.stage.disableVisibilityChange = true

    game.plugins.add(new Phaser.Plugin.Isometric(game))

    //game.load.atlasJSONHash('tileset', 'assets/sprites/tileset.png', 'assets/sprites/tileset.json')
    game.load.image('ground', 'assets/sprites/ground.png')
    game.load.image('laser', 'assets/sprites/laser.png')

    game.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE)
    game.iso.anchor.setTo(0.5, 0.2)

    this.cursorPos = new Phaser.Plugin.Isometric.Point3()

  }

  create(){
    game.isoGroup = game.add.group()
    game.water = []

    //game.physics.isoArcade.gravity.setTo(0, 0, -500)

    game.isoGroup.enableBody = true
    game.isoGroup.physicsBodyType = Phaser.Plugin.Isometric.ISOARCADE

    var size = 32

    lvl1.map( t => {
      var tile = game.add.isoSprite(
          t.x*size,
          t.y*size,
          0, //Math.random() > 0.2 ? 0 : 30,
          'ground',
          0,
          game.isoGroup
      )
      tile.anchor.set(0.5, 0)
      tile.smoothed = false
      tile.body.moves = false
    })

    this.laser = game.add.isoSprite(
        0,
        0,
        1,
        'laser',
        0,
        game.isoGroup
    )
    this.laser.anchor.set(0.5, 0)
    this.laser.smoothed = false
    this.laser.body.moves = true

  }
  update() {

    game.iso.unproject(game.input.activePointer.position, this.cursorPos)
    this.laser.body.x = this.cursorPos.x
    this.laser.body.y = this.cursorPos.y
/*
    game.isoGroup.forEach((tile) => {
      var inBounds = tile.isoBounds.containsXY(this.cursorPos.x, this.cursorPos.y)
      // If it does, do a little animation and tint change.
      if (!tile.selected && inBounds) {
        tile.selected = true
        tile.tint = 0x86bfda
        game.add.tween(tile).to({ isoZ: 4 }, 200, Phaser.Easing.Quadratic.InOut, true)
      }
      // If not, revert back to how it was.
      else if (tile.selected && !inBounds) {
        tile.selected = false
        tile.tint = 0xffffff
        game.add.tween(tile).to({ isoZ: 0 }, 200, Phaser.Easing.Quadratic.InOut, true)
      }
    })
*/
  }
  render() {
//      game.isoGroup.forEach(function (tile) {
//          game.debug.body(tile, 'rgba(189, 221, 235, 0.6)', false)
//      })

      //game.debug.body(game.player.sprite.body, 'rgba(255, 255, 0, 1)', false)
//this.cursorPos.x, this.cursorPos.y)
      game.debug.text(game.time.fps || '--', 2, 14, "#a7aebe")
      game.debug.text(this.cursorPos.x+", "+this.cursorPos.y, 2, 34, "#a7aebe")
  }
}

window.g = new Game()
