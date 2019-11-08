;(function() {
  var svgHeight = 400
  var svgWidth = 400

  // This is weird compared to what we did in class, but just know that 'svg'
  // is the svg element and you can do all the normal stuff with it
  var svg = d3
    .select('#chart4')
    .select('svg')
    .attr('height', svgHeight + 50)
    .attr('width', svgWidth + 50)
    .append('g')
    .attr('transform', 'translate(25, 25)')

  var datapoints = [
    { hotdogs: 10, hamburgers: 10, animal: 'dog', name: 'Stevie' },
    { hotdogs: 3, hamburgers: 3, animal: 'cat', name: 'Nicholas' },
    { hotdogs: 2, hamburgers: 2, animal: 'cat', name: 'Bubbletree' },
    { hotdogs: 10, hamburgers: 3, animal: 'cow', name: 'Particle' },
    { hotdogs: 7, hamburgers: 5, animal: 'dog', name: 'Jumpup' },
    { hotdogs: 4, hamburgers: 9, animal: 'dog', name: 'Parlay' },
    { hotdogs: 3, hamburgers: 1, animal: 'cat', name: 'Hio' }
  ]

  // Build your scales here
  var xPositionScale = d3
    .scaleLinear()
    .domain([0, 11])
    .range([0, 400])
  var yPositionScale = d3
    .scaleLinear()
    .domain([0, 11])
    .range([0, 400])

  svg
    .selectAll('circle')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('fill', 'pink')
    .attr('r', 10)
    .attr('cx', function(d) {
      console.log(d.hamburgers)
      return xPositionScale(d.hamburgers)
    })
    .attr('cy', function(d) {
      console.log(d.hotdogs)
      return 400 - yPositionScale(d.hotdogs)
    })

  // Add your circles and style them here
})()
