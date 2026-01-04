import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { get_scores } from '../raincloud/data';

export default function ParallelChart({ selectedFeatureId, setSelectedFeatureId }) {
    const chartRef = useRef(null);
    const [selectedModel, setSelectedModel] = useState('first');
    const [scoreData, setScoreData] = useState([]);
    const filtersRef = useRef(new Map());

    useEffect(() => {
        get_scores().then(data => { if (data && data.length > 0) setScoreData(data); });
    }, []);

    useEffect(() => {
        if (!chartRef.current || scoreData.length === 0) return;

        const margin = { top: 60, right: 80, bottom: 50, left: 80 },
            width = 1500 - margin.left - margin.right,
            height = 715 - margin.top - margin.bottom;

        let svgElement = d3.select(chartRef.current).select("svg");
        if (svgElement.empty()) {
            svgElement = d3.select(chartRef.current)
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);
            svgElement.append("g").attr("class", "main-g")
                .attr("transform", `translate(${margin.left},${margin.top})`);
        }
        const svg = svgElement.select(".main-g");

        // scale
        const dimensions = [`${selectedModel}_embedding`, `${selectedModel}_fuzz`, `${selectedModel}_detection` ];
        const xScale = d3.scalePoint().range([0, width]).domain(dimensions).padding(0.3);
        const yScale = d3.scaleLinear().domain([0, 1]).range([height, 0]);
        const colorMap = { first: "#69b3a2", second: "#404080", third: "#f8b195" };

        // brush/click
        const updateStyles = () => {
            const activeFilters = filtersRef.current;
            svg.selectAll(".feature-line").each(function(d) {
                const isMatch = Array.from(activeFilters).every(([dim, [max, min]]) => d[dim] >= min && d[dim] <= max);
                const isSelected = d.feature_id === selectedFeatureId;
                const element = d3.select(this);

                if (isMatch) {
                    if (isSelected) {
                        element.style("stroke", "red").style("stroke-width", "4px").style("opacity", 1).raise();
                    } else {
                        element.style("stroke", colorMap[selectedModel]).style("stroke-width", "1.5px").style("opacity", selectedFeatureId === null ? 0.4 : 0.1);
                    }
                } else {
                    element.style("stroke", "#eee").style("stroke-width", "1px").style("opacity", 0.02);
                }
            });
        };

        const onBrush = (event, dim) => {
            const selection = event.selection;
            if (selection) filtersRef.current.set(dim, selection.map(yScale.invert));
            else filtersRef.current.delete(dim);
            updateStyles();
        };

        // 3. 데이터 선(Path) 그리기 - 핵심 Transition 영역
        const lineGenerator = d3.line();
        const drawPath = (d) => lineGenerator(dimensions.map(dim => [xScale(dim), yScale(d[dim])]));

        const paths = svg.selectAll(".feature-line")
            .data(scoreData, d => d.feature_id);

        paths.enter()
            .append("path")
            .attr("class", "feature-line")
            .style("fill", "none")
            .style("cursor", "pointer")
            .on("mouseover", function(event, d) {
                const activeFilters = filtersRef.current;
                const isMatch = Array.from(activeFilters).every(([dim, [max, min]]) => d[dim] >= min && d[dim] <= max);
                if (isMatch) {
                    d3.select(this).raise().transition().duration(100).style("stroke-width", "6px").style("stroke", "orange").style("opacity", 1);
                }
            })
            .on("mouseout", function(event, d) {
                updateStyles(); // 원래 스타일로 복구
            })
            .on("click", (event, d) => setSelectedFeatureId(prev => prev === d.feature_id ? null : d.feature_id))
            .merge(paths) // [핵심] 기존 선들과 새로 고칠 선들을 합침
            .transition().duration(750) // [핵심] 모델 변경 시 부드럽게 이동
            .attr("d", drawPath);

        const axes = svg.selectAll(".axis-group").data(dimensions, d => d.split('_')[1]);
        const axesEnter = axes.enter().append("g").attr("class", "axis-group");
        
        axesEnter.append("text").attr("class", "axis-label").attr("y", -25).style("text-anchor", "middle").style("font-weight", "bold").style("font-size", "14px");

        const axesMerged = axes.merge(axesEnter);
        
        // 축 위치는 transition 없이 즉시 고정
        axesMerged.attr("transform", d => `translate(${xScale(d)})`)
            .each(function(d) { d3.select(this).call(d3.axisLeft(yScale).ticks(5)); });

        axesMerged.select(".axis-label").text(d => d.split('_')[1].toUpperCase());

        // 5. 브러시 UI 업데이트
        axesMerged.each(function(dim) {
            const brush = d3.brushY()
                .extent([[-20, 0], [20, height]])
                .on("brush end", (event) => onBrush(event, dim));

            let brushG = d3.select(this).select(".brush-g");
            if (brushG.empty()) brushG = d3.select(this).append("g").attr("class", "brush-g");
            brushG.call(brush);
        });

        updateStyles();

    }, [selectedModel, scoreData, selectedFeatureId]);

    return (
        <div className="d-flex flex-column align-items-center w-100 p-4">
            <div className="d-flex justify-content-between align-items-center mb-3" style={{ width: '1000px' }}>
                <h5 className="m-0 fw-bold text-secondary">Multi-Axis Range Filter</h5>
                <div className="btn-group btn-group-sm">
                    {['first', 'second', 'third'].map((m, idx) => (
                        <button key={m}
                            className={`btn ${selectedModel === m ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => { 
                                setSelectedModel(m); 
                                setSelectedFeatureId(null); 
                                filtersRef.current.clear(); 
                                d3.selectAll(".brush-g").call(d3.brushY().move, null);
                            }}>
                            LLM {idx + 1}
                        </button>
                    ))}
                </div>
            </div>
            <div className="d-flex flex-column align-items-center w-100 p-4"
            ref={chartRef} style={{ minHeight: '715px', background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}></div>
        </div>
    );
}