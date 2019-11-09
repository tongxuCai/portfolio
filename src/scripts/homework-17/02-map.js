import * as d3 from 'd3'
import * as topojson from 'topojson'

const margin = { top: 0, left: 0, right: 0, bottom: 0 }

const height = 500 - margin.top - margin.bottom

const width = 900 - margin.left - margin.right

const svg = d3
  .select('#chart-2')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const projection = d3.geoEqualEarth()
const path = d3.geoPath().projection(projection)

svg
  .append('rect')
  .attr('width', '100%')
  .attr('height', '100%')
  .attr('fill', 'lightblue')
  .attr('opacity', 0.5)

Promise.all([
  d3.json(require('/data/world.topojson')),
  d3.csv(require('/data/airport-codes-subset.csv')),
  d3.csv(require('/data/flights.csv'))
])
  .then(ready)
  .catch(err => console.log('Failed on', err))

const coordinateStore = d3.map()

function ready([json, datapoints, tdata]) {
  console.log('What is our data?')
  console.log(json)

  datapoints.forEach(d => {
    const name = d.ident
    const coords = [+d.longitude, d.latitude]
    coordinateStore.set(name, coords)
  })

  const countries = topojson.feature(json, json.objects.countries)

  // svg
  //   .selectAll('path')
  //   .data(countries.features)
  //   .enter()
  //   .append('path')
  //   .attr('class', 'country')
  //   .attr('d', path)
  //   .attr('fill', 'lightgrey')
  //   .attr('opacity', 1)
  //   .attr('stroke', 'black')
  //   .attr('stroke-width', 0.6)

  svg
    .append('g')
    .selectAll('.country')
    .data(countries.features)
    .enter()
    .append('path')
    .attr('class', 'country')
    .attr('d', path)
    .attr('fill', 'lightgrey')
    .attr('opacity', 1)
    .attr('stroke', 'black')
    .attr('stroke-width', 0.6)

  svg
    .selectAll('circle')
    .data(datapoints)
    .enter()
    .append('circle')
    .attr('r', 3)
    .attr('transform', function(d) {
      const coords = [d.longitude, d.latitude]
      return `translate(${projection(coords)})`
    })
    .attr('fill', 'white')

  // Let's draw a line between airports
  svg
    .selectAll('.transit')
    .data(tdata)
    .enter()
    .append('path')
    .attr('d', d => {
      const fromCoords = coordinateStore.get(d.from)
      const toCoords = coordinateStore.get(d.to)

      // Build a GeoJSON LineString
      const geoLine = {
        type: 'LineString',
        coordinates: [fromCoords, toCoords]
      }
      return path(geoLine)
    })
    .attr('fill', 'none')
    .attr('stroke', 'white')
    .attr('stroke-linecap', 'round')
}
