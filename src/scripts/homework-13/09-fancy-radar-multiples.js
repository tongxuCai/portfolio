import * as d3 from 'd3'

const margin = { top: 0, left: 0, right: 0, bottom: 0 }

const height = 410 - margin.top - margin.bottom
const width = 350 - margin.left - margin.right

const container = d3.select('#chart-9')

const angleScale = d3.scaleBand().range([0, Math.PI * 2])

const radius = 125

const radiusScale = d3
  .scaleLinear()
  .domain([0, 1])
  .range([0, radius])

const line = d3
  .radialLine()
  .angle(d => angleScale(d.name))
  .radius(d => radiusScale(d.value))

const maxMinutes = 40
const maxPoints = 30
const maxFieldGoals = 10
const max3P = 5
const maxFreeThrows = 10
const maxRebounds = 15
const maxAssists = 10
const maxSteals = 5
const maxBlocks = 5

const longTeamNames = {
  CLE: 'Cleveland Cavaliers',
  GSW: 'Golden State Warriors',
  SAS: 'San Antonio Spurs',
  MIN: 'Minnesota Timberwolves',
  MIL: 'Milwaukee Bucks',
  PHI: 'Philadelphia 76ers',
  OKC: 'Oklahoma City Thunder',
  NOP: 'New Orleans Pelicans',
  HOU: 'Houston Rockets'
}

d3.csv(require('/data/nba.csv'))
  .then(ready)
  .catch(err => console.log('Failed with', err))

function ready(datapoints) {
  container
    .selectAll('svg')
    .data(datapoints)
    .enter()
    .append('svg')
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`)
    .each(function(d) {
      const svg = d3.select(this)
      const holder = svg

      const player = d
      const maskId = player.Name.replace(' ', '-')

      const customDatapoints = [
        { name: 'Minutes', value: player.MP / maxMinutes },
        { name: 'Points', value: player.PTS / maxPoints },
        { name: 'Field Goals', value: player.FG / maxFieldGoals },
        { name: '3-Point Field Goals', value: player['3P'] / max3P },
        { name: 'Free Throws', value: player.FT / maxFreeThrows },
        { name: 'Rebounds', value: player.TRB / maxRebounds },
        { name: 'Assists', value: player.AST / maxAssists },
        { name: 'Steals', value: player.STL / maxSteals },
        { name: 'Blocks', value: player.BLK / maxBlocks }
      ]

      const categories = customDatapoints.map(d => d.name)
      angleScale.domain(categories)

      const bands = [0.2, 0.4, 0.6, 0.8, 1]

      holder
        .selectAll('.band-circle')
        .data(bands)
        .enter()
        .append('circle')
        .attr('r', d => radiusScale(d))
        .attr('fill', (d, i) => {
          if (i % 2 === 0) {
            return '#e8e7e5'
          } else {
            return '#f6f6f6'
          }
        })
        .lower()

      holder
        .append('g')
        .attr('mask', `url(#${maskId})`)
        .attr('class', player.Team)
        .selectAll('.band-circle-colored')
        .data(bands)
        .enter()
        .append('circle')
        .attr('r', d => radiusScale(d))
        .lower()

      holder
        .selectAll('.category-title')
        .data(categories)
        .enter()
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('font-size', 12)
        .attr('font-weight', 'bold')
        .text(d => d)
        .attr('x', 0)
        .attr('y', -radius)
        .attr('dy', -15)
        .attr('transform', d => {
          const degrees = (angleScale(d) / Math.PI) * 180
          return `rotate(${degrees})`
        })

      holder
        .append('mask')
        .attr('id', maskId)
        .append('path')
        .datum(customDatapoints)
        .attr('d', line)
        .attr('fill', 'white')

      holder
        .append('text')
        .text(0)
        .attr('font-size', 12)
        .attr('text-anchor', 'middle')
        .attr('alignment-baseline', 'middle')

      holder
        .selectAll('.text-label')
        .data(bands)
        .enter()
        .append('text')
        .attr('y', d => -radiusScale(d))
        .attr('text-anchor', 'middle')
        .attr('font-size', 12)
        .attr('alignment-baseline', 'middle')
        .text(d => d * maxMinutes)

      holder
        .selectAll('.text-label')
        .data(bands)
        .enter()
        .append('text')
        .attr('y', d => -radiusScale(d))
        .attr('text-anchor', 'middle')
        .attr('font-size', 10)
        .attr('font-weight', 'bold')
        .attr('alignment-baseline', 'middle')
        .text(d => d * maxPoints)
        .attr('transform', d => {
          const degrees = (angleScale('Points') / Math.PI) * 180
          return `rotate(${degrees})`
        })

      holder
        .selectAll('.text-label')
        .data(bands)
        .enter()
        .append('text')
        .attr('y', d => -radiusScale(d))
        .attr('text-anchor', 'middle')
        .attr('font-size', 12)
        .attr('alignment-baseline', 'middle')
        .text(d => d * maxFieldGoals)
        .attr('transform', d => {
          const degrees = (angleScale('Field Goals') / Math.PI) * 180
          return `rotate(${degrees})`
        })

      holder
        .selectAll('.text-label')
        .data(bands)
        .enter()
        .append('text')
        .attr('y', d => -radiusScale(d))
        .attr('text-anchor', 'middle')
        .attr('font-size', 12)
        .attr('alignment-baseline', 'middle')
        .text(d => d * max3P)
        .attr('transform', d => {
          const degrees = (angleScale('3-Point Field Goals') / Math.PI) * 180
          return `rotate(${degrees})`
        })

      holder
        .selectAll('.text-label')
        .data(bands)
        .enter()
        .append('text')
        .attr('y', d => -radiusScale(d))
        .attr('text-anchor', 'middle')
        .attr('font-size', 12)
        .attr('alignment-baseline', 'middle')
        .text(d => d * maxFreeThrows)
        .attr('transform', d => {
          const degrees = (angleScale('Free Throws') / Math.PI) * 180
          return `rotate(${degrees})`
        })

      holder
        .selectAll('.text-label')
        .data(bands)
        .enter()
        .append('text')
        .attr('y', d => -radiusScale(d))
        .attr('text-anchor', 'middle')
        .attr('font-size', 12)
        .attr('alignment-baseline', 'middle')
        .text(d => d * maxRebounds)
        .attr('transform', d => {
          const degrees = (angleScale('Rebounds') / Math.PI) * 180
          return `rotate(${degrees})`
        })

      holder
        .selectAll('.text-label')
        .data(bands)
        .enter()
        .append('text')
        .attr('y', d => -radiusScale(d))
        .attr('text-anchor', 'middle')
        .attr('font-size', 12)
        .attr('alignment-baseline', 'middle')
        .text(d => d * maxAssists)
        .attr('transform', d => {
          const degrees = (angleScale('Assists') / Math.PI) * 180
          return `rotate(${degrees})`
        })

      holder
        .selectAll('.text-label')
        .data(bands)
        .enter()
        .append('text')
        .attr('y', d => -radiusScale(d))
        .attr('text-anchor', 'middle')
        .attr('font-size', 12)
        .attr('alignment-baseline', 'middle')
        .text(d => d * maxSteals)
        .attr('transform', d => {
          const degrees = (angleScale('Steals') / Math.PI) * 180
          return `rotate(${degrees})`
        })

      holder
        .selectAll('.text-label')
        .data(bands)
        .enter()
        .append('text')
        .attr('y', d => -radiusScale(d))
        .attr('text-anchor', 'middle')
        .attr('font-size', 12)
        .attr('alignment-baseline', 'middle')
        .text(d => d * maxBlocks)
        .attr('transform', d => {
          const degrees = (angleScale('Blocks') / Math.PI) * 180
          return `rotate(${degrees})`
        })

      holder
        .append('text')
        .attr('font-size', 20)
        .attr('font-weight', 'bold')
        .text(player.Name)
        .attr('y', -radius)
        .attr('dy', -65)
        .attr('text-anchor', 'middle')

      holder
        .append('text')
        .attr('font-size', 14)
        .text(longTeamNames[player.Team])
        .attr('y', -radius)
        .attr('dy', -45)
        .attr('text-anchor', 'middle')
    })
}
