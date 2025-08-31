import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import NotesPage from "./pages/NotesPage";
import SignupPage from "./pages/SignupPage";
import ProtectedRoute from "./components/Protectedroute";
import Navbar from "./components/Navbar";
// import './App.css'

function App() {
  

  return (
    
    <>
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/notes" element={
            <ProtectedRoute>
              <NotesPage />
            </ProtectedRoute>
          } />
      </Routes> 
    </Router>
     
    </>
  )
}

export default App
