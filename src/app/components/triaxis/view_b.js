import React from 'react';
import ParallelChart from './parallelChart';

export default function ViewB({ selectedFeatureId, setSelectedFeatureId }) {

    return (
        <>
            <ParallelChart selectedFeatureId={selectedFeatureId} setSelectedFeatureId={setSelectedFeatureId}/>
        </>
    );
}