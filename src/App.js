import './App.css';
import {
  Routes,
  Route
} from "react-router-dom";
import Home from './routes/Home';
import Session from './routes/Session';
import SessionId from './routes/SessionId';

function App() {
  return (
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/session" element={<Session />}/>
        <Route path="/session/:sessionId" element={<SessionId />} />
        <Route
          path="*"
          element={
            <main style={{ padding: "1rem" }}>
              <p>There's nothing here!</p>
            </main>
          }
        />
      </Routes>
  );
}

export default App;
