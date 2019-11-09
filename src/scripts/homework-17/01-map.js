import * as d3 from 'd3'
import * as topojson from 'topojson'

const margin = { top: 0, left: 0, right: 0, bottom: 0 }

const height = 500 - margin.top - margin.bottom

const width = 900 - margin.left - margin.right

d3.selection.prototype.moveToFront = function() {
  return this.each(function() {
    this.parentNode.appendChild(this)
  })
}

const svg = d3
  .select('#chart-1')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const projection = d3.geoMercator()
const path = d3.geoPath().projection(projection)

svg
  .append('rect')
  .attr('width', '100%')
  .attr('height', '100%')
  .attr('fill', 'black')
  .attr('opacity', 0.95)

const graticule = d3.geoGraticule()

const colorScale = d3
  .scaleOrdinal()
  .range([
    '#762a83',
    '#af8dc3',
    '#e7d4e8',
    '#f7f7f7',
    '#d9f0d3',
    '#7fbf7b',
    '#1b7837'
  ])

Promise.all([
  d3.json(require('/data/world.topojson')),
  d3.csv(require('/data/world-cities.csv'))
])
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready([json, datapoints]) {
  console.log('What is our data?')
  console.log(json)
  const countries = topojson.feature(json, json.objects.countries)

  svg
    .append('path')
    .datum(graticule())
    .attr('d', path)
    .attr('stroke', 'white')
    .attr('fill', 'none')
    .attr('stroke-wideth', 0.1)
    .attr('opacity', 0.5)

  svg
    .selectAll('path')
    .data(countries.features)
    .enter()
    .append('path')
    .attr('class', 'country')
    .attr('d', path)
    .attr('fill', 'black')
    .attr('opacity', 0.5)

  svg
    .selectAll('circle')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('r', 0.6)
    .attr('opacity', 2)
    .attr('transform', function(d) {
      const coords = [d.lng, d.lat]
      return `translate(${projection(coords)})`
    })
    .attr('fill', function(d) {
      return colorScale(d.city)
    })
    .on('mouseover', function() {
      const sel = d3.select(this)
      sel.moveToFront()
    })
}
