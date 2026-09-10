import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProjectDetail from "./pages/ProjectDetail";

const PrivateRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
    const { user } = useAuth();
    return !user ? children : <Navigate to="/dashboard" />;
};

const AppRoutes = () => (
    <Routes>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/projects/:id" element={<PrivateRoute><ProjectDetail /></PrivateRoute>} />
    </Routes>
);

const App = () => (
    <AuthProvider>
        <BrowserRouter>
            <AppRoutes />
        </BrowserRouter>
    </AuthProvider>
);

export default App;
