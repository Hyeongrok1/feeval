export default function Header() {
    return (
        <header style={{ 
            width: '30%',     
            position: 'fixed', 
            top: 0,            
            left: 0,       
            zIndex: 1000       
        }}> 
            <nav className="navbar navbar-dark" style={{ borderRadius: 0, margin: 0 }}>
                <div className="container-fluid">
                    <div style={{ 
                        marginTop: '1px',      
                        padding: '5px 86px',   
                        display: 'inline-block',
                        background: '#fff', 
                        borderRadius: '12px', 
                        boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                        fontWeight: 'bold',   
                        fontSize: '28px'       
                    }}>
                        Feature Explanation Evaluation
                    </div>
                </div>
            </nav>
        </header>
    );
}