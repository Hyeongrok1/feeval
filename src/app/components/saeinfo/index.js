import React, { useState, useCallback, useMemo } from 'react';
import Visual from '../visual'
import './saeinfo.css'

export default function SaeInfo() {
    const [useColor, setUseColor] = useState(true);
    const [xVar, setXVar] = useState('Feature_ID');
    const [yVar, setYVar] = useState('Cosine_average');
    const [clickCount, setClickCount] = useState(0);

    const handleReset = useCallback(() => {
            setClickCount(prevCount => prevCount + 1);
    }, []);


    return (
        <>
            <header>
                <br></br>
                <nav id="round-nav" className="container navbar navbar-dark bg-dark">
                    <div className="container-fluid justify-content-center">
                        <span className="navbar-brand mb-0 ms-3 h1">SAE Infomation</span>
                    </div>
                </nav>
            </header>

            <main className="container">

                <div className="row pt-2">
                    <div className="pe-2 justify-content-center"><strong id="sae_id" className="fs-6">sae_id</strong></div>
                </div>              
                <div className="row pt-2">
                </div>              
                <div className="row pt-2">
                </div>
                <div className="row">
                    <div className="col-3 fs-6">
                    </div>
                    <div id="buttons-wrapper" className="text-end">
                    <button id="reset" className="btn btn-secondary me-2" onClick={handleReset}>
                        Reset
                    </button>
                    </div>
                </div>
                <Visual count={clickCount} chosenXVar={xVar} chosenYVar={yVar} colorUse={useColor}/>

            </main>
        </>
    );
}