import {SIZE} from 'constants'
import range from 'range'
import Box from 'box'
import Breakable from 'breakable'

const flatten = (input) => {
  var flattened=[];
  for (var i=0; i<input.length; ++i) {
      var current = input[i];
      for (var j=0; j<current.length; ++j)
          flattened.push(current[j]);
  }
  return flattened
}

var lvl1 = () => {
  var genArea = {x: game.world.width/2, y: game.world.height/2 }
  var grounds = flatten(
    range(1, genArea.x, SIZE).map(x => {
      return range(1, genArea.y, SIZE).map(y => {
        var tile = game.add.isoSprite(
            x,
            y,
            0,
            'ground',
            0,
            game.groundGroup
        )
        tile.anchor.set(0.5, 0)
        tile.smoothed = false
        if(((x+y) % 2) == 0)
          tile.tint = 0x86bfda

        return tile
      })
    })
  )

  var walls = flatten([
    range(1, genArea.x, SIZE).map( x => new Box(x, 0)),
    range(1, genArea.y, SIZE).map( y => new Box(0, y)),

    range(1, genArea.x, SIZE).map( x => new Box(x, genArea.y)),
    range(1, genArea.y, SIZE).map( y => new Box(genArea.x, y))
  ])

  var breakables = [
    new Breakable(130, 250),
    new Breakable(170, 250),
    new Breakable(210, 250),
    new Breakable(250, 250),
    new Breakable(240, 250),
    new Breakable(180, 260),
    new Breakable(280, 350),
    new Breakable(580, 150),
    new Breakable(80, 50)
  ]

  return {
    walls : walls,
    breakables: breakables
  }
}

export default lvl1

