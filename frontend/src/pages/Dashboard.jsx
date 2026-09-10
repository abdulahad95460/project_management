import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";

const Dashboard = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: "", description: "" });
    const [creating, setCreating] = useState(false);

    const fetchProjects = async () => {
        try {
            const { data } = await API.get("/projects");
            setProjects(data.projects);
        } catch (err) {
            setError("Failed to load projects");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setCreating(true);
        try {
            await API.post("/projects", form);
            setForm({ name: "", description: "" });
            setShowForm(false);
            fetchProjects();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create project");
        } finally {
            setCreating(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this project?")) return;
        try {
            await API.delete(`/projects/${id}`);
            fetchProjects();
        } catch {
            setError("Failed to delete project");
        }
    };

    const statusColor = { Active: "#4caf50", Completed: "#7c6af7", "On Hold": "#ff9800" };

    return (
        <div style={styles.page}>
            <Navbar />
            <div style={styles.container}>
                <div style={styles.header}>
                    <h2 style={styles.title}>My Projects</h2>
                    <button style={styles.addBtn} onClick={() => setShowForm(!showForm)}>
                        {showForm ? "Cancel" : "+ New Project"}
                    </button>
                </div>

                {error && <div style={styles.error}>{error}</div>}

                {showForm && (
                    <form onSubmit={handleCreate} style={styles.form}>
                        <input
                            style={styles.input}
                            type="text"
                            placeholder="Project Name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />
                        <input
                            style={styles.input}
                            type="text"
                            placeholder="Description"
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            required
                        />
                        <button style={styles.submitBtn} type="submit" disabled={creating}>
                            {creating ? "Creating..." : "Create Project"}
                        </button>
                    </form>
                )}

                {loading ? (
                    <p style={styles.msg}>Loading projects...</p>
                ) : projects.length === 0 ? (
                    <p style={styles.msg}>No projects yet. Create one!</p>
                ) : (
                    <div style={styles.grid}>
                        {projects.map((p) => (
                            <div key={p._id} style={styles.card}>
                                <div style={styles.cardTop}>
                                    <h3 style={styles.cardTitle}>{p.name}</h3>
                                    <span style={{ ...styles.badge, background: statusColor[p.status] }}>
                                        {p.status}
                                    </span>
                                </div>
                                <p style={styles.cardDesc}>{p.description}</p>
                                <p style={styles.cardMeta}>
                                    👤 Owner: {p.owner?.name || "You"} &nbsp;|&nbsp; 👥 {p.members?.length || 0} members
                                </p>
                                <div style={styles.cardActions}>
                                    <button
                                        style={styles.viewBtn}
                                        onClick={() => navigate(`/projects/${p._id}`)}
                                    >
                                        View
                                    </button>
                                    <button
                                        style={styles.deleteBtn}
                                        onClick={() => handleDelete(p._id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    page: { minHeight: "100vh", background: "#0f0f1a" },
    container: { maxWidth: "1000px", margin: "0 auto", padding: "32px 16px" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" },
    title: { color: "#fff", fontSize: "24px", margin: 0 },
    addBtn: {
        padding: "10px 20px", background: "#7c6af7", color: "#fff",
        border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold"
    },
    form: {
        background: "#1e1e2e", padding: "20px", borderRadius: "10px",
        marginBottom: "24px", display: "flex", gap: "12px", flexWrap: "wrap"
    },
    input: {
        flex: 1, minWidth: "200px", padding: "10px 14px", borderRadius: "8px",
        border: "1px solid #333", background: "#2a2a3e", color: "#fff", fontSize: "14px"
    },
    submitBtn: {
        padding: "10px 20px", background: "#7c6af7", color: "#fff",
        border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold"
    },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" },
    card: { background: "#1e1e2e", borderRadius: "12px", padding: "20px", border: "1px solid #2a2a3e" },
    cardTop: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" },
    cardTitle: { color: "#fff", margin: 0, fontSize: "16px" },
    badge: { fontSize: "11px", padding: "3px 8px", borderRadius: "20px", color: "#fff", fontWeight: "bold" },
    cardDesc: { color: "#aaa", fontSize: "13px", marginBottom: "10px" },
    cardMeta: { color: "#666", fontSize: "12px", marginBottom: "14px" },
    cardActions: { display: "flex", gap: "8px" },
    viewBtn: {
        flex: 1, padding: "8px", background: "#7c6af7", color: "#fff",
        border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold"
    },
    deleteBtn: {
        flex: 1, padding: "8px", background: "#ff4d4d22", color: "#ff6b6b",
        border: "1px solid #ff4d4d44", borderRadius: "6px", cursor: "pointer"
    },
    msg: { color: "#888", textAlign: "center", marginTop: "40px" },
    error: {
        background: "#ff4d4d22", color: "#ff6b6b", padding: "10px",
        borderRadius: "6px", marginBottom: "16px", fontSize: "14px"
    }
};

export default Dashboard;
