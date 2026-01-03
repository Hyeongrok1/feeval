import React, { useEffect, useRef } from 'react';
import { get_scores } from './data';
import * as d3 from 'd3';

export default function EmbeddingCloud() {
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
            height = 300 - margin.top - margin.bottom;

        const svg = d3.select(chartRef.current)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        get_scores().then(function(rawData) {
            if (!rawData || rawData.length === 0) return;

            // 1. 데이터 카테고리 설정 (비교할 3가지 그룹)
            const categories = [
                { key: 'first_embedding', label: 'First', color: '#69b3a2' },
                { key: 'second_embedding', label: 'Second', color: '#404080' },
                { key: 'third_embedding', label: 'Third', color: '#f8b195' }
            ];

            // 2. 축 설정
            const x = d3.scaleLinear().domain([0, 1]).range([0, width]);
            svg.append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(x));

            // KDE 도구 (대역폭 0.05)
            const kde = kernelDensityEstimator(kernelEpanechnikov(0.05), x.ticks(50));
            
            // 모든 카테고리의 밀도 데이터를 미리 계산하여 최대 Y값 찾기
            const allDensities = categories.map(cat => ({
                ...cat,
                density: kde(rawData.map(d => d[cat.key]))
            }));

            const maxY = d3.max(allDensities, c => d3.max(c.density, d => d[1]));
            const y = d3.scaleLinear().range([height, 0]).domain([0, maxY * 1.1]);

            // 3. 각 카테고리별로 그리기 (반복문)
            allDensities.forEach((cat, i) => {
                
                // (1) Cloud 영역 (Area)
                svg.append("path")
                    .datum(cat.density)
                    .attr("fill", cat.color)
                    .attr("opacity", "0.3") // 겹치므로 투명도를 낮춤
                    .attr("stroke", cat.color)
                    .attr("stroke-width", 1.5)
                    .attr("d", d3.area()
                        .curve(d3.curveBasis)
                        .x(d => x(d[0]))
                        .y0(height) 
                        .y1(d => y(d[1])) 
                    ).on("mouseover", function() {
                        d3.selectAll("path").style("opacity", 0.1); 
                        d3.select(this).style("opacity", 0.7);     
                    })
                    .on("mouseleave", function() {
                        d3.selectAll("path").style("opacity", 0.3); 
                    });

                // (2) Rain (개별 점 - 하단 Jitter)
                // 점들이 너무 겹치지 않게 카테고리별로 Y축 위치를 살짝 다르게 배치 가능
                svg.selectAll(`.dot-${cat.key}`)
                    .data(rawData.filter((_, idx) => idx % 10 === 0)) // 샘플링
                    .enter()
                    .append("circle")
                    .attr("cx", d => x(d[cat.key]))
                    .attr("cy", height + 10 + (i * 15)) // 카테고리별로 층을 나눔
                    .attr("r", 2)
                    .style("fill", cat.color)
                    .attr("opacity", 0.4)
                    .attr("transform", () => `translate(0, ${Math.random() * 10})`);
            });

            // 4. 범례 (Legend) 추가
            const legend = svg.selectAll(".legend")
                .data(categories)
                .enter().append("g")
                .attr("transform", (d, i) => `translate(${width - 100}, ${i * 20 - 30})`);

            legend.append("rect").attr("width", 15).attr("height", 15).style("fill", d => d.color);
            legend.append("text").attr("x", 20).attr("y", 12).text(d => d.label).style("font-size", "12px");
        });
        
    }, []);

    return (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: '20px' }}>
            <div ref={chartRef} style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}></div>
        </div>
    );
}