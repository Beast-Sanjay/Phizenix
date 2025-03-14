import './App.css'
import HomePage from './pages/homePage';
import LoginRegistrationForm from './pages/loginRegistrationForm';
import { BrowserRouter as Router, Routes,Route, Navigate } from 'react-router';


function App() {
  const isUserLoggedIn = localStorage.getItem("username");
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to={isUserLoggedIn ? "/dashboard" : "/auth"} replace />} />
          <Route path="/auth" element={isUserLoggedIn ? <Navigate to="/dashboard" replace /> : <LoginRegistrationForm />} />
          <Route path="/dashboard" element={isUserLoggedIn ? <HomePage /> : <Navigate to="/auth" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
