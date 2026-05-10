import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Home from "./pages/Home.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import PublicRoute from "./components/PublicRoute.jsx";
import PartnerRoute from "./components/PartnerRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import Admin from "./pages/Admin/";
import Partner from "./pages/Partner/index.jsx";
import MoviePage from "./pages/Movie/index.jsx";
import BookingPage from "./pages/Booking/index.jsx";
import BookingsPage from "./pages/Bookings/index.jsx";
import ProfilePage from "./pages/Profile/index.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            }
          />
          <Route
            path="/partner"
            element={
              <PartnerRoute>
                <Partner />
              </PartnerRoute>
            }
          />
          <Route
            path="/movie/:id"
            element={
              <ProtectedRoute>
                <MoviePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/booking/:movieId"
            element={
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              <ProtectedRoute>
                <BookingsPage />
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
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
