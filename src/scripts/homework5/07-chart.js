;(function() {
  // Delete this line, redo it.
  var height = 200
  var width = 400

  var margin = { top: 50, right: 50, bottom: 50, left: 50 }

  var svg = d3
    .select('#chart7')
    .append('svg')
    .attr('width', width)
    .attr('height', height)

  // DO NOT CHANGE THIS SECTION
  svg
    .append('rect')
    .attr('height', 100)
    .attr('width', 300)
    .attr('x', 0)
    .attr('y', 0)
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
  // DO NOT CHANGE THIS SECTION
})()
