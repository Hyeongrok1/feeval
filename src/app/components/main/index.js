import React, { useState } from 'react';
import ViewA from '../raincloud/view_a';
import ViewB from '../triaxis/view_b.js';
import ViewC from '../explain/view_c.js';

export default function Main() {
    const [selectedFeatureId, setSelectedFeatureId] = useState(null);

    return (
        <div className="container-fluid p-0 bg-light min-vh-100 d-flex flex-column">
            
            <div className="d-flex flex-grow-1 overflow-hidden">
                <div className="p-2" style={{ height: '400px' }}>
                    <ViewA featureId={selectedFeatureId} onSelect={setSelectedFeatureId} />
                </div>

                <div className="flex-grow-1 d-flex col-md-6 flex-column overflow-hidden">    
                    <ViewB selectedFeatureId={selectedFeatureId} setSelectedFeatureId={setSelectedFeatureId} />
                </div>
                <div className="flex-grow-1 d-flex col-md-6 flex-column overflow-hidden">    
                    <ViewC selectedFeatureId={selectedFeatureId} />
                </div>

                {/* C */}
                <div className="flex-grow-1 d-flex flex-column overflow-hidden">
                    

                    {/* [하단 영역] C, D (왼쪽 묶음) + E (오른쪽 묶음) */}
                    <div className="d-flex flex-grow-1 overflow-hidden">
                        
                        {/* 하단 왼쪽: View C & D를 세로로 나열하거나 가로로 나열 */}
                        <div className="d-flex flex-grow-1 border-end">
                            {/* View C: Scatter Plot */}
                            <div className="flex-grow-1 border-end p-3 overflow-auto bg-white">
                                <div className="h-100 border rounded d-flex align-items-center justify-content-center text-muted shadow-sm">
                                    <h5>View C: Scatter Plot</h5>
                                </div>
                            </div>
                            
                            {/* View D: Feature Detail */}
                            <div className="p-3 bg-white" style={{ width: '400px', overflowY: 'auto' }}>
                                <div className="h-100 border rounded p-3 shadow-sm">
                                    <h6 className="fw-bold text-secondary border-bottom pb-2">View D: Detail Info</h6>
                                    <p className="small mt-2">ID: {selectedFeatureId || '선택된 피처 없음'}</p>
                                </div>
                            </div>
                        </div>

                        {/* [추가] 하단 가장 오른쪽: View E (Tag/Annotation) */}
                        <div className="p-3 bg-light border-start shadow-sm" style={{ width: '280px', overflowY: 'auto' }}>
                            <div className="h-100 border rounded p-3 bg-white shadow-sm">
                                <h6 className="fw-bold text-secondary border-bottom pb-2">View E: Tags</h6>
                                {/* 태그 리스트 또는 통계 뷰가 들어갈 자리 */}
                                <div className="badge bg-primary m-1">High Detection</div>
                                <div className="badge bg-success m-1">Low Fuzz</div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}