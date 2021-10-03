let healthdata;

//loads in the data
d3.csv('wealth-health-2014.csv').then(data => {
    healthdata = data;
    console.log('healthdata', data);
})

d3.csv('wealth-health-2014.csv', d => {
    //manually sets the numerical variables
    return {
        ...d, 
        income: +d.Income, 
        lifeexp: +d.LifeExpectancy, 
        pop: +d.Population, 
    }

}).then(data => {
    healthdata = data;
    console.log('healthdata', data);

    //svg
    const margin = ({top: 20, right: 20, bottom: 20, left: 40});
    const width = 650 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select('.chart').append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', "translate(" + margin.left + "," + margin.top + ")");


    //scales
    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.income))
        .range([0, width]);

    const yScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.lifeexp))
        .range([height, 0]);

    const sizeScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.pop))
        .range([5,25]);

    const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

    //creating circles
    svg.selectAll('.country')
        .data(data)
        .enter()
        .append('circle')
        .attr('fill', d => colorScale(d.Region))
        .attr('cx', d=> xScale(d.income))
        .attr('cy', d=> yScale(d.lifeexp))
        .attr('r', d=> sizeScale(d.pop))
        .attr('opacity', 0.7)
        .attr('stroke', 'black')
        //tooltip
        .on('mouseenter', (event, d) => {
            const pos = d3.pointer(event, window); //pos = [x,y]

            d3.select('.tooltip')
                .style('display', 'block')
                .style('top', (pos[1] + 5) + 'px')
                .style('left', (pos[0] + 5) + "px").html(`
                    <div> Country: ${d.Country} </div>
                    <div> Region: ${d.Region} </div>
                    <div> Population: ${d3.format(",")(d.pop)} </div>
                    <div> Life Expectancy: ${d.lifeexp} </div>
                    `
                );
        })
        .on('mouseleave', (event, d) => {
            d3.select('.tooltip').style('display', 'none');
        });

    //draws the axes
    const xAxis = d3.axisBottom()
        .scale(xScale)
        .ticks(5, 's');

    const yAxis = d3.axisLeft()
        .scale(yScale);

    svg.append('g')
        .attr('class', 'axis x-axis')
        .attr('transform', "translate(0," + height + ")")
        .call(xAxis)
    svg.append('g')
        .attr('class', 'axis y-axis')
        .call(yAxis)

    //axes labels
    svg.append('text')
        .attr('class', 'xlabel')
        .attr('x', width-55)
        .attr('y', height-10)
        .attr('alightment-baseline', 'baseline')
        .text("Income");
    svg.append('text')
        .attr('class', 'ylabel')
        .attr('x', 15)
        .attr('y', 0)
        .attr('alightment-baseline', 'baseline')
        .text("Life Expectancy"); 

    //creates the legend
    const legend = svg.append('g');

    legend.selectAll('.legend-color')
        .data(colorScale.domain())
        .enter()
        .append('rect')
        .attr('x', width-155)
        .attr('y', function(d, i) {
            return 350 + i*10;
        })
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', d=> colorScale(d));

    legend.selectAll('.legent-text')
        .data(colorScale.domain())
        .enter()
        .append('text')
        .attr('x', width-145)
        .attr('y', function(d, i) {
            return 360 + i*10;
        })
        .attr('font-size', 12)
        .attr('alightment-baseline', 'hanging')
        .text(d=>d);
    
})