import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav style={styles.nav}>
            <Link to="/dashboard" style={styles.brand}>ProjectFlow</Link>
            <div style={styles.right}>
                {user && (
                    <>
                        <span style={styles.username}>👤 {user.name}</span>
                        <button onClick={handleLogout} style={styles.btn}>Logout</button>
                    </>
                )}
            </div>
        </nav>
    );
};

const styles = {
    nav: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 24px",
        background: "#1e1e2e",
        color: "#fff",
        position: "sticky",
        top: 0,
        zIndex: 100
    },
    brand: {
        color: "#7c6af7",
        fontWeight: "bold",
        fontSize: "20px",
        textDecoration: "none"
    },
    right: { display: "flex", alignItems: "center", gap: "16px" },
    username: { color: "#ccc", fontSize: "14px" },
    btn: {
        padding: "6px 14px",
        background: "#7c6af7",
        color: "#fff",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: "bold"
    }
};

export default Navbar;
