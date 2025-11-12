import './App.css';
import SaeInfo from './components/saeinfo';

function App() {

  return (
    <div className="App">
      
      <header className="App-header">
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css" 
        rel="stylesheet" integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB" crossOrigin="anonymous"/>

        <SaeInfo></SaeInfo>
      </header>
    </div>
  );
}

export default App;
