;(function() {
  // Build your SVG here
  const margin = { top: 50, right: 50, bottom: 50, left: 50 }
  const padding = { top: '25%', bottom: '25%' }
  const width = 400 - margin.left - margin.right
  const height = 200 - margin.top - margin.bottom

  const svg = d3
    .select('#chart12')
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

  // Build your scales here
  const xPointScale = d3
    .scaleLinear()
    .domain([0, 10])
    .range([0, 280])
  const colorScale = d3
    .scaleOrdinal()
    .domain(['cat', 'dog', 'cow'])
    .range(['orange', 'green', 'purple'])
  const radiusScale = d3
    .scaleSqrt()
    .domain([0, 10])
    .range([0, 50])

  d3.csv(require('../../data/eating-data.csv'))
    .then(ready)
    .catch(function(err) {
      console.log('Failed with', err)
    })

  function ready(datapoints) {
    svg
      .selectAll('circle')
      .data(datapoints)
      .enter()
      .append('circle')
      .attr('cx', d => xPointScale(d.hamburgers))
      .attr('r', 15)
      .attr('cy', 25)
      .attr('fill', d => colorScale(d.animal))
      .attr('r', d => radiusScale(d.hotdogs))
      .attr('opacity', 0.25)

    const xAxis = d3.axisBottom(xPointScale)
    svg
      .append('g')
      .attr('class', 'axis x-axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis)
  }
})()
