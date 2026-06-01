import "./App.css";
import { Routes, Route } from "react-router-dom";
// import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/auth/pages/RegisterPage";
import LoginPage from "./pages/auth/pages/LoginPage";
import ProtectedRoute from "./components/protectedRoute";
import PublicRoute from "./components/publicRoute";
import AttendancePage from "./pages/employee/pages/AttendancePage";
import DailySummaryPage from "./pages/employee/pages/DailySummaryPage";
import AttendanceAdminPage from "./pages/admin/pages/AttendancePage";
import DailySummaryAdminPage from "./pages/admin/pages/DailySummaryPage";
import UserAdminPage from "./pages/admin/pages/UsePage";
function App() {
  return (
    <Routes>
      {/* PUBLIC ROUTES  */}
      <Route element={<PublicRoute />}>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      {/* PROTECTED ROUTES */}
      <Route element={<ProtectedRoute />}>
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/dailySummary" element={<DailySummaryPage />} />
        <Route path="/attendance/admin" element={<AttendanceAdminPage />} />
        <Route path="/dailySummary/admin" element={<DailySummaryAdminPage />} />
        <Route path="/users/admin" element={<UserAdminPage />} />
      </Route>
    </Routes>
  );
}

export default App;
