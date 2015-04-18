const flatten = ([first, ...rest]) => {
  if (first === undefined) {
    return [];
  }
  else if (!Array.isArray(first)) {
    return [first, ...flatten(rest)];
  }
  else {
    return [...flatten(first), ...flatten(rest)];
  }
}
function range(lo, hi) {
  var r = []
  while (lo <= hi) {
    r.push(lo++)
  }
  return r
}

var seq = range(1, 20)

var lvl1 = flatten(
  seq.map(x => {
    return seq.map(y => {
      return { x: x, y: y, sprite: "ground"}
    })
  })
)

export default lvl1

