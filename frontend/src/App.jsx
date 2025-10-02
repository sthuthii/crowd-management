// frontend/src/App.jsx

import 'bootstrap/dist/css/bootstrap.min.css';
import { Routes, Route } from 'react-router-dom';

// Import Components and Pages
import Navbar from './components/Navbar';
import Emergency from './pages/Emergency';
import LostAndFound from './pages/LostAndFound';
import './App.css';

function App() {
  return (
    <> {/* Use a fragment to wrap elements */}
      <Navbar />
      <div className="container">
        <main>
          <Routes>
            <Route path="/" element={<Emergency />} />
            <Route path="/lost-and-found" element={<LostAndFound />} />
          </Routes>
        </main>
      </div>
    </>
  );
}

export default App;