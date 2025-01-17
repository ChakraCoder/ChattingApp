import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Auth from "./pages/auth";
import Chat from "./pages/chat";
import Profile from "./pages/profile";
import VerifyOtp from "./components/auth/VerifyOtp";
import ResetPassword from "./components/auth/ResetPassword";
import ProtectedRoutes from "./components/routes/protectedRoutes";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route element={<ProtectedRoutes />}>
            <Route path="/chat" element={<Chat />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<Navigate to="/auth" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
