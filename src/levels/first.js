import {SIZE} from 'app/constants'
import range from 'app/range'
import Box from 'app/box'
import Breakable from 'app/breakable'

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
  console.log(genArea.x/SIZE, genArea.y/SIZE)

  var grounds = flatten(
    range(SIZE, genArea.x, SIZE).map(x => {
      return range(SIZE, genArea.y, SIZE).map(y => {
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
        if(((x+y) % 64) == 0)
          tile.tint = 0x86bfda

        return tile
      })
    })
  )

  var walls = flatten([
    range(0, genArea.x, SIZE).map( x => new Box(x, 0)),
    range(0, genArea.y, SIZE).map( y => new Box(0, y)),

    range(0, genArea.x, SIZE).map( x => new Box(x, genArea.y)),
    range(0, genArea.y, SIZE).map( y => new Box(genArea.x, y)),

    range(5*SIZE, genArea.y-5*SIZE, SIZE).map( y => new Box(SIZE*10, y)),

    flatten(range(25*SIZE, 28*SIZE, SIZE).map( x => {
      return range(10*SIZE, 13*SIZE, SIZE).map( y => new Box(x, y))
    })),

    flatten(range(27*SIZE, 34*SIZE, SIZE).map( x => {
      return range(genArea.y-14*SIZE, genArea.y-10*SIZE, SIZE).map( y => new Box(x, y))
    }))
  ])

  var rndSprite = () => {
    var rnd = Math.random()
    if(rnd  < 0.4 )
      return 'flower'
    else if(rnd  < 0.7 )
      return 'bottle'
    else
      return 'box'
  }

  var breakables = range(0, genArea.x, SIZE).map ( x =>
    range(0, genArea.y, SIZE).map ( y => {
      if(Math.random() < 0.01)
        return new Breakable(x, y, rndSprite())
      else
        return null
    })
  )
  breakables = flatten(breakables).filter(e => e != null)
  console.log(breakables)

  /*
    new Breakable(SIZE*20, SIZE*7),

    new Breakable(SIZE*17, SIZE*10, 'flower', 150),
    new Breakable(SIZE*22, SIZE*21, 'flower', 150),
    new Breakable(SIZE*14, SIZE*30, 'flower', 150),
    new Breakable(SIZE*19, SIZE*35, 'flower', 150),
    new Breakable(SIZE*20, SIZE*14, 'flower', 150),

    new Breakable(SIZE*14, SIZE*18, 'bottle', 200)
  ]

  */

  return {
    walls : walls,
    breakables: breakables
  }
}

export default lvl1

