;(function() {
  // Here is your data
  var countries = [
    {
      name: 'Blahstia',
      continent: 'North America',
      gdp: 40
    },
    {
      name: 'Bleers',
      continent: 'Europe',
      gdp: 12
    },
    {
      name: 'Blolo',
      continent: 'Antarctica',
      gdp: 35
    },
    {
      name: 'Blurben',
      continent: 'North America',
      gdp: 90
    }
  ]

  var widthScale = d3
    .scaleLinear()
    .domain([0, 90])
    .range([0, 400])

  var colorScale = d3
    .scaleOrdinal()
    .domain(['North America', 'Europe', 'Antarctica'])
    .range(['#edf8fb', '#b3cde3', '#8c96c6'])
  // Get the svg with the id of 'chart2'

  svg = d3
    .select('#chart2')
    .attr('height', 200)
    .attr('width', 400)
  svg
    .selectAll('rect')
    .data(countries)
    .attr('height', 50)
    .attr('width', d => widthScale(d.gdp))
    .attr('fill', d => colorScale(d.continent))
  // Get the rectangles inside of it
})()
