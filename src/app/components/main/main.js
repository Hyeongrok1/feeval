import React, { useState } from 'react';
import Header from '../header/Header';
import ViewA from '../raincloud/view_a';
import ViewB from '../triaxis/view_b.js';
import ViewC from '../explain/view_c.js';

export default function Main() {
    const [selectedFeatureId, setSelectedFeatureId] = useState(null);

    return (
        <div className="container-fluid p-0 bg-light min-vh-100 d-flex flex-column">
            
            <div className="d-flex flex-grow-1 overflow-hidden">
                {/* View A */}
                <div className="p-2" style={{ height: '400px' }}>
                    <Header />
                    <ViewA featureId={selectedFeatureId} onSelect={setSelectedFeatureId} />
                </div>

                {/* View B */}
                <div className="flex-grow-1 d-flex col-md-6 flex-column overflow-hidden">    
                    <ViewB selectedFeatureId={selectedFeatureId} setSelectedFeatureId={setSelectedFeatureId} />
                </div>

                {/* View C */}
                <div className="flex-grow-1 d-flex col-md-6 flex-column overflow-hidden">    
                    <ViewC selectedFeatureId={selectedFeatureId} />
                </div>

                {/* not implemented */}
                <div className="flex-grow-1 d-flex flex-column overflow-hidden">
                    

                    <div className="d-flex flex-grow-1 overflow-hidden">
                        
                        <div className="d-flex flex-grow-1 border-end">
                            <div className="flex-grow-1 border-end p-3 overflow-auto bg-white">
                                <div className="h-100 border rounded d-flex align-items-center justify-content-center text-muted shadow-sm">
                                    <h5>View C: Scatter Plot</h5>
                                </div>
                            </div>
                            
                            <div className="p-3 bg-white" style={{ width: '400px', overflowY: 'auto' }}>
                                <div className="h-100 border rounded p-3 shadow-sm">
                                    <h6 className="fw-bold text-secondary border-bottom pb-2">View D: Detail Info</h6>
                                    <p className="small mt-2">ID: {selectedFeatureId || 'no Selected Features'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-3 bg-light border-start shadow-sm" style={{ width: '280px', overflowY: 'auto' }}>
                            <div className="h-100 border rounded p-3 bg-white shadow-sm">
                                <h6 className="fw-bold text-secondary border-bottom pb-2">View E: Tags</h6>
                                {/* <div className="badge bg-primary m-1">High Detection</div>
                                <div className="badge bg-success m-1">Low Fuzz</div> */}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}