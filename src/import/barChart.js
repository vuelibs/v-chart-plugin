var d3 = Object.assign({},
    require('d3-selection'),
    require('d3-scale'),
    require('d3-axis'),
    require('d3-ease')
);
/**
 * Builds an Bar Chart.
 * @constructor
 * @param {String} mode (init / refresh)
 * @exports barChart
 */

var barChart = function (mode) {
    let ds = this.ds,
        svgContainer = d3.select('#' + this.chartData.selector),
        cs = {
            pallette: {
                fill: '#005792',
                stroke: '#d1f4fa'
            },
            bar: {
                hPadding: 8,
                vPadding: 5
            }, x: {
                axisHeight: 10,
                ticks: 5
            }, y: {
                domain: [],
                range: [],
                axisWidth: 30
            }
        };

    var _enter = rects => {
        rects.enter()
            .append('rect')
            .attr('fill', cs.pallette.fill)
            .attr('stroke', cs.pallette.stroke)
            .attr('class', this.selector)
            .attr('width', d => {
                return cs.x.scale(d.metric);
            }).attr('height', (d, i) => {
                return (this.height - cs.x.axisHeight - this.header - cs.bar.vPadding) / ds.length - 1
            }).attr('y', (d, i) => {
                return i * (this.height - cs.x.axisHeight - this.header) / ds.length + 1 + this.header;
            }).attr('x', cs.y.axisWidth + cs.bar.hPadding)
            .on('mouseover', d => {
                this.addTooltip(d, event);
            })
            .on('mouseout', d => {
                this.removeTooltip(d);
            });
        return rects;
    }

    var _transition = rects => {
        rects.transition()
            .attr('width', d => {
                return cs.x.scale(d.metric);
            }).attr('height', (d, i) => {
                return (this.height - cs.x.axisHeight - this.header - cs.bar.vPadding) / ds.length - 1
            }).attr('y', (d, i) => {
                return i * (this.height - cs.x.axisHeight - this.header) / ds.length + 1 + this.header;
            }).attr('x', cs.y.axisWidth + cs.bar.hPadding)
        return rects;
    }

    var _exit = rects => {
        rects.exit().remove();
        return rects;
    }

    var _buildScales = cs => {
        cs.x.scale = d3.scaleLinear()
            .domain([0, this.max])
            .range([0, this.width - cs.bar.hPadding - cs.y.axisWidth]);

        ds.forEach((t) => cs.y.domain.push(t['dim']));
        ds.forEach((t, i) => cs.y.range.push(((this.chartData.height - cs.x.axisHeight - this.header + cs.bar.vPadding) * i) / ds.length));
        cs.y.scale = d3.scaleOrdinal().domain(cs.y.domain).range(cs.y.range);
        return cs;
    }

    var _drawAxis = (cs) => {
        cs.x.axis = d3.axisBottom().ticks(cs.x.ticks, 's').scale(cs.x.scale);
        cs.y.axis = d3.axisLeft().scale(cs.y.scale);

        cs.x.yOffset = this.height - cs.x.axisHeight;
        cs.x.xOffset = cs.bar.hPadding + cs.y.axisWidth;

        cs.y.yOffset = cs.bar.vPadding + this.header - 1;
        cs.y.xOffset = cs.y.axisWidth;

        svgContainer.append('g').attr('class', 'axis').attr('transform', 'translate(' + cs.y.xOffset + ', ' + cs.y.yOffset + ')').call(cs.y.axis);
        svgContainer.append('g').attr('class', 'axis').attr('transform', 'translate(' + cs.x.xOffset + ', ' + cs.x.yOffset + ')').call(cs.x.axis);
        return cs;
    }
    let rects = svgContainer.selectAll('rect').data(ds);

    _buildScales(cs);
    _drawAxis(cs);
    _enter(rects);
    _transition(rects);
    _exit(rects);

};

export default barChart;