import lvl1 from 'levels/first'
import Cat from 'cat'
import Box from 'box'
import Breakable from 'breakable'
import {SIZE} from 'constants'
import range from 'range'
import Laser from 'laser'

class Game {
  constructor() {
    window.game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser', { preload: this.preload, create: this.create, update: this.update, render: this.render })
  }
  preload() {

    game.time.advancedTiming = true
    game.debug.renderShadow = true
    game.stage.disableVisibilityChange = true

    game.world.setBounds(0, 0, 3000, 3000)

    game.plugins.add(new Phaser.Plugin.Isometric(game))

    //game.load.atlasJSONHash('tileset', 'assets/sprites/tileset.png', 'assets/sprites/tileset.json')
    game.load.image('ground', 'assets/sprites/ground.png')
    game.load.image('laser', 'assets/sprites/laser.png')
    game.load.image('furniture1', 'assets/sprites/furniture1.png')
    game.load.image('arrow', 'assets/sprites/arrow.png')

    game.load.spritesheet('flower', 'assets/sprites/flower.png', 64, 64)
    game.load.spritesheet('bottle', 'assets/sprites/bottle.png', 64, 64)
    game.load.spritesheet('cat', 'assets/sprites/cat.png', 64, 64, 8*8)
    game.load.spritesheet('box', 'assets/sprites/box.png', 64, 64)

    game.load.audio('meow', ['assets/sounds/meow.ogg'])

    game.physics.startSystem(Phaser.Plugin.Isometric.ISOARCADE)
    game.iso.anchor.setTo(0.5, 0.2)

    this.cursorPos = new Phaser.Plugin.Isometric.Point3()

    this.points = 0
  }

  create(){
    game.physics.isoArcade.gravity.setTo(0, 0, -500)

    game.groundGroup = game.add.group()
    //game.breakableGroup = game.add.group()
    game.isoGroup = game.add.group()
    game.catGroup = game.add.group()
    game.decorGroup = game.add.group()

    game.decorGroup.enableBody = true
    game.decorGroup.physicsBodyType = Phaser.Plugin.Isometric.ISOARCADE

    game.catGroup.enableBody = true
    game.catGroup.physicsBodyType = Phaser.Plugin.Isometric.ISOARCADE
    game.isoGroup.enableBody = true
    game.isoGroup.physicsBodyType = Phaser.Plugin.Isometric.ISOARCADE

    this.sounds = []
    this.sounds['meow'] = game.add.audio('meow')

    //game.breakableGroup.enableBody = true
    //game.breakableGroup.physicsBodyType = Phaser.Plugin.Isometric.ISOARCADE

    this.lvl = lvl1()
    this.colliders = {
      walls : this.lvl.walls.map(w => w.tile),
      breakables : this.lvl.breakables.map(b => b.tile)
    }

    this.cat = new Cat()

    this.debug = false

    game.input.keyboard.addKey(Phaser.Keyboard.D).onDown.add( () => this.debug = !this.debug , this)


    game.camera.follow(this.cat.tile)

    this.laser = new Laser()

    this.arrow = game.add.sprite(0, 0, 'arrow')
    this.arrow.visible = false
  }
  update() {
    this.laser.update()

      //ARROW INDICATING LASER OFF-SCREEN DIRECTION. TODO : FINISH THAT
      /*
    if(!this.laser.tile.inCamera && !this.arrow.visible) {
      var isLeft, isUp, isDown, isRight = false
      if(this.laser.tile.body.x < game.camera.view.x - game.camera.view.width / 2)
        isLeft = true
      else if(this.laser.tile.body.x > game.camera.view.x + game.camera.view.width / 2)

      if(this.laser.tile.body.y < game.camera.view.y - game.camera.view.height / 2)
        isUp = true
      else if(this.laser.tile.body.y > game.camera.view.y + game.camera.view.height / 2)
        isDown = true


      this.arrow.visible = true
      if( isUp) { // && !iLeft && !isRight) {
        this.arrow.body.y = 0
        this.arrow.body.x = 0
        this.arrow.rotation = -90
      } else if( isDown ) {
        this.arrow.body.y = game.camera.view.height - this.arrow.height
        this.arrow.rotation = +90
      }
    }
    */


    this.cat.update(this.laser.tile.body.x, this.laser.tile.body.y)


    game.iso.simpleSort(game.isoGroup)

    //game.physics.isoArcade.collide(this.cat.tile, game.decorGroup)
    //game.physics.isoArcade.collide(game.breakableGroup, game.decorGroup)
    //game.physics.isoArcade.collide(game.breakableGroup, game.breakableGroup)

    this.colliders.breakables.map(a => {
      this.colliders.breakables.map(b => game.physics.isoArcade.collideSpriteVsSprite(a, b))
      this.colliders.walls.map(b => game.physics.isoArcade.collideSpriteVsSprite(a, b))
    })

    game.physics.isoArcade.collide(this.cat.tile, game.isoGroup,
      null,//(a, b) => { return false },
      (a, b) => {
        if(a == b) return false


        var vel = Math.abs(a.body.velocity.x) + Math.abs(a.body.velocity.y)

        if(vel > 100 && !this.sounds['meow'].isPlaying)
          this.sounds['meow'].play()

        if(typeof a.item == 'undefined' || typeof b.item == 'undefined') return true

        if(!a.item.isCat() && !b.item.isCat()) return true

        var cat = a.item.isCat() ? a : b
        var other = a.item.isCat() ? b : a

        cat.body.velocity = {
          x: cat.body.velocity.x/2,
          y: cat.body.velocity.y/2
        }

        //console.log(vel, other.key, cat)
        if(vel > 400) {
          other.body.enable = false

          if(other.item.break()) {
            this.points += other.item.points

            var tPos = new Phaser.Plugin.Isometric.Point3()
            game.iso.projectXY({x: other.body.x, y: other.body.y}, tPos);

            var style = { font: "20px Arial", fill: "#0AF", stroke: 'black', strokeThickness: 2, align: "center" };

            var pointsTxt = game.add.text(tPos.x, tPos.y, "+"+other.item.points+" Points!", style)

            game.time.events.add(1000, function() {
              game.add.tween(pointsTxt).to({y: 0}, 1500, Phaser.Easing.Linear.None, true)
              game.add.tween(pointsTxt).to({alpha: 0}, 1500, Phaser.Easing.Linear.None, true)
            }, this)
          }

          return false
        }
        return true
      }
    )

  }
  render() {
      if(this.debug) {
        game.isoGroup.forEach(function (tile) { game.debug.body(tile, 'rgba(255, 0, 0, 1)', false) })
        //game.breakableGroup.forEach(function (tile) { game.debug.body(tile, 'rgba(255, 0, 0, 1)', false) })
      }
      game.debug.text(this.laser.tile.body.x+", "+this.laser.tile.body.x, 2, 50, 'rgba(255, 255, 0, 1)')
//this.cursorPos.x, this.cursorPos.y)
      game.debug.text(game.time.fps || '--', 2, 14, "#a7aebe")
      game.debug.text("Points : "+this.points, 2, 34, "#FFF")
      game.debug.text("Laser is visible : "+this.laser.tile.inCamera, 2, 74, "#FFF")
      //game.debug.text(this.cursorPos.x+", "+this.cursorPos.y, 2, 34, "#a7aebe")
      //game.debug.text(this.cat.tile.body.x+", "+this.cat.tile.body.y, 2, 54, "#a7aebe")
      //game.debug.text(Math.abs(this.cat.tile.body.velocity.x)+Math.abs(this.cat.tile.body.velocity.y), 2, 74, "#a7aebe")
  }
}

window.g = new Game()
