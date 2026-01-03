import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { get_scores } from '../raincloud/data';

export default function ParallelChart() {
    const chartRef = useRef(null);
    const [selectedModel, setSelectedModel] = useState('first');
    const [scoreData, setScoreData] = useState([]);
    const [selectedId, setSelectedId] = useState(null);

    // 각 축의 브러시 범위를 기억할 객체 (Ref를 사용하여 리렌더링 없이 관리)
    const filtersRef = useRef(new Map());

    useEffect(() => {
        get_scores().then(data => {
            if (data && data.length > 0) setScoreData(data);
        });
    }, []);

    useEffect(() => {
        if (!chartRef.current || scoreData.length === 0) return;

        const margin = { top: 50, right: 60, bottom: 50, left: 60 },
            width = 1000 - margin.left - margin.right,
            height = 700 - margin.top - margin.bottom;

        let svg = d3.select(chartRef.current).select("svg");
        if (svg.empty()) {
            svg = d3.select(chartRef.current)
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);
        } else {
            svg = svg.select("g");
        }

        const dimensions = [`${selectedModel}_embedding`, `${selectedModel}_fuzz`, `${selectedModel}_detection` ];
        const xScale = d3.scalePoint().range([0, width]).domain(dimensions).padding(0.1);
        const yScale = d3.scaleLinear().domain([0, 1]).range([height, 0]);
        const colorMap = { first: "#69b3a2", second: "#404080", third: "#f8b195" };

        // 스타일 업데이트 로직 (드래그 된 것만 필터링)
        const updateStyles = () => {
            const activeFilters = filtersRef.current;
            
            svg.selectAll(".feature-line").each(function(d) {
                // 모든 활성화된 브러시 범위 안에 데이터가 있는지 검사
                const isMatch = Array.from(activeFilters).every(([dim, [max, min]]) => {
                    return d[dim] >= min && d[dim] <= max;
                });

                const isSelected = d.feature_id === selectedId;
                const element = d3.select(this);

                if (isMatch) {
                    if (isSelected) {
                        element.style("stroke", "red")
                               .style("stroke-width", "4px")
                               .style("opacity", 1)
                               .raise(); // 선택된 건 가장 위로
                    } else {
                        element.style("stroke", colorMap[selectedModel])
                               .style("stroke-width", "1.5px")
                               .style("opacity", selectedId === null ? 0.4 : 0.1);
                    }
                } else {
                    // 드래그 범위 밖이면 아주 흐리게 처리
                    element.style("stroke", "#eee")
                           .style("stroke-width", "1px")
                           .style("opacity", 0.02);
                }
            });
        };

        const onBrush = (event, dim) => {
            const selection = event.selection;
            if (selection) {
                // 픽셀 좌표를 데이터 값(0~1)으로 변환하여 저장
                filtersRef.current.set(dim, selection.map(yScale.invert));
            } else {
                filtersRef.current.delete(dim);
            }
            updateStyles();
        };

        // 데이터 선 그리기
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
                // [수정] 현재 이 데이터가 드래그된 범위(Filter) 내에 있는지 확인
                const activeFilters = filtersRef.current;
                const isMatch = Array.from(activeFilters).every(([dim, [max, min]]) => {
                    return d[dim] >= min && d[dim] <= max;
                });

                // 드래그된 범위 안에 있을 때만 확대 효과 적용
                if (isMatch) {
                    const element = d3.select(this);
                    element.raise() // 다른 선들보다 앞으로 가져오기
                        .transition().duration(100)
                        .style("stroke-width", "6px") // 평소보다 훨씬 크게
                        .style("stroke", "orange")    // 강조 색상
                        .style("opacity", 1);
                }
            })
            .on("mouseout", function(event, d) {
                // [수정] 마우스가 나갔을 때 원래 스타일로 복구
                // 이 로직은 기존에 작성한 updateStyles의 조건과 동일해야 합니다.
                const activeFilters = filtersRef.current;
                const isMatch = Array.from(activeFilters).every(([dim, [max, min]]) => {
                    return d[dim] >= min && d[dim] <= max;
                });
                const isSelected = d.feature_id === selectedId;

                d3.select(this)
                    .transition().duration(150)
                    .style("stroke-width", isSelected ? "4px" : (isMatch ? "2px" : "1px"))
                    .style("stroke", isSelected ? "red" : (isMatch ? colorMap[selectedModel] : "#eee"))
                    .style("opacity", isSelected ? 1 : (isMatch ? 0.4 : 0.02));
            })
            .on("click", (event, d) => {
                // 드래그 범위 내에 있을 때만 클릭 작동하게 하려면 여기서 필터링 가능
                setSelectedId(prev => prev === d.feature_id ? null : d.feature_id);
            })
            .merge(paths)
            .attr("d", drawPath);

        updateStyles();

        // 축 및 브러시 설정
        const axes = svg.selectAll(".axis-group").data(dimensions, d => d.split('_')[1]);
        const axesEnter = axes.enter().append("g").attr("class", "axis-group");
        const axesCombined = axes.merge(axesEnter);

        axesCombined.attr("transform", d => `translate(${xScale(d)})`)
            .each(function(d) { d3.select(this).call(d3.axisLeft(yScale)); });

        // 브러시 UI 생성
        axesCombined.each(function(dim) {
            const brush = d3.brushY()
                .extent([[-15, 0], [15, height]])
                .on("brush end", (event) => onBrush(event, dim));

            const brushG = d3.select(this).selectAll(".brush").data([0]);
            brushG.enter().append("g").attr("class", "brush").merge(brushG).call(brush);
        });

        // 축 라벨
        axesCombined.selectAll(".axis-label").remove();
        axesCombined.append("text")
            .attr("class", "axis-label")
            .attr("y", -15)
            .style("text-anchor", "middle")
            .style("fill", "black")
            .style("font-weight", "bold")
            .text(d => d.split('_')[1].toUpperCase());

    }, [selectedModel, scoreData, selectedId]);

    return (
        <div className="d-flex flex-column align-items-center w-100 p-4">
            <div className="d-flex justify-content-between align-items-center mb-2" style={{ width: '800px' }}>
                <h5 className="m-0 fw-bold">Multi-Axis Range Filter</h5>
                <div className="btn-group btn-group-sm">
                    {['first', 'second', 'third'].map((m, idx) => (
                        <button key={m}
                            className={`btn ${selectedModel === m ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => { setSelectedModel(m); setSelectedId(null); filtersRef.current.clear(); }}>
                            LLM {idx + 1}
                        </button>
                    ))}
                </div>
            </div>
            
            <div className="mb-2 text-muted small">
            </div>

            <div ref={chartRef} style={{ background: '#fff', borderRadius: '12px', padding: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}></div>
        </div>
    );
}