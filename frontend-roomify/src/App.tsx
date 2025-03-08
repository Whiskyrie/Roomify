// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getCurrentUser } from "./components/store/slices/authSlice";
import Layout from "./components/layout/Layout";
import HomePage from "./components/pages/HomePage";
import LoginPage from "./components/pages/LoginPage";
import RegisterPage from "./components/pages/RegisterPage";
import PropertiesPage from "./components/pages/PropertiesPage";
import PropertyDetailPage from "./components/pages/PropertyDetailPage";
import BookingPage from "./components/pages/BookingPage";
import ProfilePage from "./components/pages/ProfilePage";
import MyPropertiesPage from "./components/pages/MyPropertiesPage";
import NotFoundPage from "./components/pages/NotFoundPage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { AppDispatch } from "./components/store/store";

function App() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(getCurrentUser());
    }
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="properties" element={<PropertiesPage />} />
          <Route path="properties/:id" element={<PropertyDetailPage />} />

          {/* Protected routes */}
          <Route
            path="booking/:id"
            element={
              <ProtectedRoute>
                <BookingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="my-properties"
            element={
              <ProtectedRoute roles={["host", "admin"]}>
                <MyPropertiesPage />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
