export default function Header() {
    return (
        <header style={{ 
            width: '100vw', 
            position: 'fixed', 
            top: 0,            
            left: 0,       
            zIndex: 1000       
        }}> 
            <nav className="navbar navbar-dark bg-dark" style={{ borderRadius: 0, margin: 0 }}>
                <div className="container-fluid justify-content-center">
                    <span className="navbar-brand mb-0" style={{ fontSize: '32px', fontWeight: 'bold' }}>
                        Feature Explainer
                    </span>
                </div>
            </nav>
        </header>
    );
}