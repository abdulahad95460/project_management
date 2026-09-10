import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";

const Register = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await API.post("/auth/register", form);
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h2 style={styles.title}>ProjectFlow</h2>
                <p style={styles.tagline}>Plan. Collaborate. Deliver.</p>
                <p style={styles.sub}>Create your account</p>
                {error && <div style={styles.error}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <input
                        style={styles.input}
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        style={styles.input}
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        style={styles.input}
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                    <button style={styles.btn} type="submit" disabled={loading}>
                        {loading ? "Creating..." : "Register"}
                    </button>
                </form>
                <p style={styles.footer}>
                    Already have an account? <Link to="/login" style={styles.link}>Login</Link>
                </p>
            </div>
        </div>
    );
};

const styles = {
    page: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f0f1a"
    },
    card: {
        background: "#1e1e2e",
        padding: "40px",
        borderRadius: "12px",
        width: "100%",
        maxWidth: "400px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)"
    },
    title: { color: "#fff", marginBottom: "4px", textAlign: "center" },
    tagline: { color: "#7c6af7", textAlign: "center", fontWeight: "bold", fontSize: "13px", letterSpacing: "1px", marginBottom: "4px" },
    sub: { color: "#888", textAlign: "center", marginBottom: "24px" },
    input: {
        width: "100%",
        padding: "12px",
        marginBottom: "14px",
        borderRadius: "8px",
        border: "1px solid #333",
        background: "#2a2a3e",
        color: "#fff",
        fontSize: "14px",
        boxSizing: "border-box"
    },
    btn: {
        width: "100%",
        padding: "12px",
        background: "#7c6af7",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        fontSize: "16px",
        cursor: "pointer",
        fontWeight: "bold"
    },
    error: {
        background: "#ff4d4d22",
        color: "#ff6b6b",
        padding: "10px",
        borderRadius: "6px",
        marginBottom: "14px",
        fontSize: "14px"
    },
    footer: { color: "#888", textAlign: "center", marginTop: "16px", fontSize: "14px" },
    link: { color: "#7c6af7", textDecoration: "none" }
};

export default Register;
