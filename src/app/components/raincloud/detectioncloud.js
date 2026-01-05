import React, { useEffect, useRef } from 'react';
import { get_scores } from './data';
import * as d3 from 'd3';

export default function DetectionCloud() {
    const chartRef = useRef(null);

    const kernelDensityEstimator = (kernel, X) => {
        return (V) => X.map(x => [x, d3.mean(V, v => kernel(x - v))]);
    };
    const kernelEpanechnikov = (k) => {
        return (v) => Math.abs(v /= k) <= 1 ? 0.75 * (1 - v * v) / k : 0;
    };

    useEffect(() => {
        if (!chartRef.current) return;
        
        d3.select(chartRef.current).selectAll("*").remove();

        const margin = {top: 50, right: 30, bottom: 50, left: 60},
            width = 500 - margin.left - margin.right,
            height = 200 - margin.top - margin.bottom;

        const svg = d3.select(chartRef.current)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        svg.append("text")
            .attr("x", 0)             
            .attr("y", -margin.top / 2) 
            .attr("text-anchor", "start")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .style("fill", "#4a4a4a")
            .text("Detection");

        get_scores().then(function(rawData) {
            if (!rawData || rawData.length === 0) return;

            // three groups
            const categories = [
                { key: 'first_detection', label: 'hugging-quants', color: '#69b3a2' },
                { key: 'second_detection', label: 'Qwen', color: '#404080' },
                { key: 'third_detection', label: 'openai', color: '#f8b195' }
            ];

            // axis
            const x = d3.scaleLinear().domain([0, 1]).range([0, width]);
            svg.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(x));

            // KDE (bandwidth 0.05)
            const kde = kernelDensityEstimator(kernelEpanechnikov(0.05), x.ticks(50));
            
            const allDensities = categories.map(cat => ({
                ...cat,
                density: kde(rawData.map(d => d[cat.key]))
            }));

            const maxY = d3.max(allDensities, c => d3.max(c.density, d => d[1]));
            const y = d3.scaleLinear().range([height, 0]).domain([0, maxY * 1.1]);

            allDensities.forEach((cat, i) => {
                // cloud
                svg.append("path")
                    .datum(cat.density)
                    .attr("fill", cat.color)
                    .attr("opacity", "0.3") 
                    .attr("stroke", cat.color)
                    .attr("stroke-width", 1.5)
                    .attr("class", cat.label) 
                    .attr("d", d3.area()
                        .curve(d3.curveBasis)
                        .x(d => x(d[0]))
                        .y0(height) 
                        .y1(d => y(d[1])) 
                    )
                    .on("mouseover", function(event, d) {
                        const className = d3.select(this).attr("class");
                        
                        d3.selectAll("path").style("opacity", 0.05); 
                        
                        d3.selectAll("." + className)
                            .style("opacity", 0.7)
                            .style("stroke-width", 2);
                    })
                    .on("mouseleave", function() {
                        d3.selectAll("path")
                            .style("opacity", "0.3")
                            .style("stroke-width", 1.5);
                    });

                // rain
                svg.selectAll(`.dot-${cat.key}`)
                    .data(rawData.filter((_, idx) => idx % 10 === 0)) 
                    .enter()
                    .append("circle")
                    .attr("cx", d => x(d[cat.key]))
                    .attr("cy", height + 10 + (i * 15)) 
                    .attr("r", 2)
                    .style("fill", cat.color)
                    .attr("opacity", 0.4)
                    .attr("transform", () => `translate(0, ${Math.random() * 10})`);
            });

            // legend
            const legend = svg.selectAll(".legend")
                .data(categories)
                .enter().append("g")
                .attr("transform", (d, i) => `translate(${width - 100}, ${i * 20 - 30})`);

            legend.append("rect").attr("width", 15).attr("height", 15).style("fill", d => d.color);
            legend.append("text")
                .attr("x", 20)
                .attr("y", 12)
                .text(d => d.label)
                .attr("class", d => d.label)
                .style("font-size", "12px")
                .on("mouseover", function() {
                    const className = d3.select(this).attr("class");
                        
                    d3.selectAll("path").style("opacity", 0.05); 
                    
                    d3.selectAll("." + className)
                        .style("opacity", 0.7)
                        .style("stroke-width", 2);
                })
                .on("mouseleave", function() {
                    d3.selectAll("path")
                        .style("opacity", "0.3")
                    .style("stroke-width", 1.5);
                });
        });
        
    }, []);

    return (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '20px' }}>
            <div ref={chartRef} style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}></div>
        </div>
    );
}