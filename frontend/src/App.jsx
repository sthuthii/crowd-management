// frontend/src/App.jsx

import 'bootstrap/dist/css/bootstrap.min.css';
import Emergency from './pages/Emergency';
import LostAndFound from './pages/LostAndFound'; // Import the new component
import './App.css';

function App() {
  return (
    <div className="container">
      <header>
        <h1 className="my-4 text-center">Crowd Management System</h1>
      </header>
      <main>
        <Emergency />
        <hr className="my-5" /> {/* This adds a nice separator */}
        <LostAndFound />
      </main>
    </div>
  );
}

export default App;