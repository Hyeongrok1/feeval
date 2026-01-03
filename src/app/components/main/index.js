import React from 'react';
import Header from '../header/Header.js';
import ViewA from '../raincloud/view_a';
import ViewB from '../triaxis/view_b.js';

export default function Main() {
    return (
        <div className="container-fluid p-0 bg-light min-vh-100">
            
            <div className="row g-0">
                {/* 왼쪽: View B (Raincloud Plots) - 사이드바 형태 */}
                <div className="col-md-3 col-lg-2 border-end vh-100 overflow-auto bg-white">
                    <div className="p-3">
                        <ViewA /> 
                    </div>
                </div>

                {/* 오른쪽: 메인 콘텐츠 영역 (상단 View A + 하단 View C, D) */}
                <div className="col-md-9 col-lg-10 d-flex flex-column vh-100">
                    
                    {/* [이동] 상단 중앙: View A (Multi-Axis Range Filter) */}
                    <div className="p-3 flex-grow-0 border-bottom bg-white">
                        <ViewB />
                    </div>

                    {/* 하단 영역: View C (Scatter) + View D (Detail) */}
                    <div className="row g-0 flex-grow-1 overflow-hidden">
                        {/* 하단 왼쪽: View C */}
                        <div className="col-md-7 border-end p-3 overflow-auto">
                            <div className="bg-white rounded shadow-sm h-100 p-3">
                                <h5>View C: Scatter Plot (준비 중)</h5>
                            </div>
                        </div>

                        {/* 하단 오른쪽: View D */}
                        <div className="col-md-5 p-3 overflow-auto">
                            <div className="bg-white rounded shadow-sm h-100 p-3">
                                <h5>View D: Feature Detail (준비 중)</h5>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}