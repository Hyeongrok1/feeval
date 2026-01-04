import React from 'react';
import ExplainView from './explain.js';

export default function ViewC({ selectedFeatureId, setSelectedFeatureId }) {

    return (
        <>
            <div className="flex-grow-1 d-flex col-md-8 flex-column overflow-hidden">        
                <div className="p-2" style={{ height: '100px' }}>
                    <div className="flex-grow-1 p-3 overflow-auto">
                        <div className="h-100 rounded d-flex align-items-center justify-content-center text-muted">
                            <ExplainView selectedFeatureId={selectedFeatureId} setSelectedFeatureId={setSelectedFeatureId} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}