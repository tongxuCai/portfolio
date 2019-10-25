;(function() {
  const margin = { top: 50, right: 50, bottom: 50, left: 50 }
  const width = 500 - margin.left - margin.right
  const height = 400 - margin.top - margin.bottom

  const svg = d3
    .select('#chart14')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  const yPositionScale = d3
    .scaleLinear()
    .domain([0, 10])
    .range([0, height])
  const colorScale = d3
    .scaleOrdinal()
    .domain(['dog', 'cat', 'cow'])
    .range(['green', 'purple', 'orange'])
  const xPositionScale = d3
    .scaleBand()
    .domain([
      'Hio',
      'Parlay',
      'Jumpup',
      'Particle',
      'Bubbletree',
      'Nicholas',
      'Stevie'
    ])
    .range([0, width])

  d3.csv(require('../../data/eating-data.csv'))
    .then(ready)
    .catch(function(err) {
      console.log('Failed with', err)
    })

  function ready(datapoints) {
    svg
      .selectAll('rect')
      .data(datapoints)
      .enter()
      .append('rect')
      .attr('width', xPositionScale.bandwidth())
      .attr('x', function(d) {
        return xPositionScale(d.name)
      })
      .attr('height', function(d) {
        return yPositionScale(d.hamburgers)
      })
      .attr('y', function(d) {
        return height - yPositionScale(d.hamburgers)
      })
      .attr('opacity', 0.55)
      .attr('fill', function(d) {
        return colorScale(d.animal)
      })

    const yAxis = d3.axisLeft(yPositionScale)
    svg
      .append('g')
      .attr('class', 'axis y-axis')
      .call(yAxis)
    const xAxis = d3.axisBottom(xPositionScale)
    svg
      .append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
  }
})()
