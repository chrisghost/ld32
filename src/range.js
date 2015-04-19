function range(lo, hi, pace = 1) {
  var r = []
  while (lo <= hi) {
    r.push(lo)
    lo += pace
  }
  return r
}


export default range
