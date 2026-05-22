import { HashRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import NotesPage from "./pages/NotesPage";
import SignupPage from "./pages/SignupPage";
import EditPage from "./pages/EditPage";
import AddNote from "./pages/AddNote";
import ProfilePage from "./pages/ProfilePage";
import WelcomePage from "./pages/WelcomePage";
import EnhanceNotes from "./pages/EnhanceNotes";
import ProtectedRoute from "./components/Protectedroute";
import Navbar from "./components/Navbar";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--text-primary)]">
        <Navbar />
        <main className="px-2 pb-10 pt-24 sm:px-3 lg:px-4">
          <Routes>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route
              path="/notes"
              element={
                <ProtectedRoute>
                  <NotesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add"
              element={
                <ProtectedRoute>
                  <AddNote />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit/:id"
              element={
                <ProtectedRoute>
                  <EditPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/enhance/:id"
              element={
                <ProtectedRoute>
                  <EnhanceNotes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
