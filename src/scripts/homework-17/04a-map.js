import * as d3 from 'd3'
import * as topojson from 'topojson'

const margin = { top: 0, left: 0, right: 0, bottom: 0 }

const height = 500 - margin.top - margin.bottom

const width = 900 - margin.left - margin.right

const svg = d3
  .select('#chart-4a')
  .append('svg')
  .attr('height', height + margin.top + margin.bottom)
  .attr('width', width + margin.left + margin.right)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

const opacityScale = d3
  .scaleLinear()
  .domain([0, 110000])
  .range([0, 1])

const projection = d3.geoAlbersUsa()
const path = d3.geoPath().projection(projection)

d3.json(require('/data/counties_with_election_data.topojson'))
  .then(ready)
  .catch(err => console.log('Failed on', err))

function ready(json) {
  const counties = topojson.feature(json, json.objects.us_counties)
  // counties.features = counties.features.filter(d => d.id !== 72 && d.id !== 78)

  const colorScaleClinton = d3
    .scaleLinear()
    .domain([0, 9000])
    .range(['lightpink', 'pink'])

  const colorScaleTrump = d3
    .scaleLinear()
    .domain([0, 9000])
    .range(['lightgreen', 'green'])

  svg
    .selectAll('path')
    // countries we got you but you are not a list. so we use countries.features, which is a list.
    .data(counties.features)
    .enter()
    .append('path')
    .attr('class', 'country')
    .attr('d', path)
    .attr('opacity', d =>
      opacityScale(+d.properties.clinton + +d.properties.trump)
    )
    .attr('fill', function(d) {
      console.log(d)
      if (d.properties.clinton < d.properties.trump) {
        return colorScaleTrump(d.properties.trump)
      } else {
        return colorScaleClinton(d.properties.clinton)
      }
    })
}
