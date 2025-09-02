import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import NotesPage from "./pages/NotesPage";
import SignupPage from "./pages/SignupPage";
import EditPage from "./pages/EditPage"
import ProtectedRoute from "./components/Protectedroute";
import Navbar from "./components/Navbar";
import { ThemeProvider, createTheme } from "@mui/material/styles";//for uniform font all over
// import './App.css'

const theme = createTheme({
  typography: {
    fontFamily: "'Montserrat', sans-serif",
  }
});
function App() {
  

  return (
    
    <><ThemeProvider theme={theme}>
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
          <Route path="/edit/:id" element={
            <ProtectedRoute>
              <EditPage/>
            </ProtectedRoute>
          } />
      </Routes> 
    </Router>
     </ThemeProvider>
    </>
  )
}

export default App
