import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";

const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Task form
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [taskForm, setTaskForm] = useState({ title: "", description: "", status: "Pending" });
    const [creatingTask, setCreatingTask] = useState(false);

    // Member form
    const [showMemberForm, setShowMemberForm] = useState(false);
    const [memberEmail, setMemberEmail] = useState("");
    const [addingMember, setAddingMember] = useState(false);

    const fetchAll = async () => {
        try {
            const [projRes, taskRes, memberRes] = await Promise.all([
                API.get(`/projects/${id}`),
                API.get(`/projects/${id}/tasks`),
                API.get(`/projects/${id}/members`)
            ]);
            setProject(projRes.data.project);
            setTasks(taskRes.data.tasks);
            setMembers([memberRes.data.owner, ...memberRes.data.members]);
        } catch {
            setError("Failed to load project");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchAll(); }, [id]);

    const handleCreateTask = async (e) => {
        e.preventDefault();
        setCreatingTask(true);
        try {
            await API.post(`/projects/${id}/tasks`, taskForm);
            setTaskForm({ title: "", description: "", status: "Pending" });
            setShowTaskForm(false);
            fetchAll();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create task");
        } finally {
            setCreatingTask(false);
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (!confirm("Delete this task?")) return;
        try {
            await API.delete(`/projects/${id}/tasks/${taskId}`);
            fetchAll();
        } catch {
            setError("Failed to delete task");
        }
    };

    const handleStatusChange = async (taskId, status) => {
        try {
            await API.put(`/projects/${id}/tasks/${taskId}`, { status });
            fetchAll();
        } catch {
            setError("Failed to update task");
        }
    };

    const handleAddMember = async (e) => {
        e.preventDefault();
        setAddingMember(true);
        try {
            await API.post(`/projects/${id}/members`, { email: memberEmail });
            setMemberEmail("");
            setShowMemberForm(false);
            fetchAll();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to add member");
        } finally {
            setAddingMember(false);
        }
    };

    const handleRemoveMember = async (userId) => {
        if (!confirm("Remove this member?")) return;
        try {
            await API.delete(`/projects/${id}/members/${userId}`);
            fetchAll();
        } catch {
            setError("Failed to remove member");
        }
    };

    const statusColor = { Pending: "#ff9800", "In Progress": "#2196f3", Completed: "#4caf50" };

    if (loading) return <div style={styles.loading}>Loading...</div>;

    return (
        <div style={styles.page}>
            <Navbar />
            <div style={styles.container}>
                <button style={styles.back} onClick={() => navigate("/dashboard")}>← Back</button>

                {error && <div style={styles.error}>{error}</div>}

                {project && (
                    <div style={styles.projectHeader}>
                        <div>
                            <h2 style={styles.projectTitle}>{project.name}</h2>
                            <p style={styles.projectDesc}>{project.description}</p>
                        </div>
                        <span style={{ ...styles.badge, background: statusColor[project.status] || "#7c6af7" }}>
                            {project.status}
                        </span>
                    </div>
                )}

                {/* Tasks Section */}
                <div style={styles.section}>
                    <div style={styles.sectionHeader}>
                        <h3 style={styles.sectionTitle}>Tasks ({tasks.length})</h3>
                        <button style={styles.addBtn} onClick={() => setShowTaskForm(!showTaskForm)}>
                            {showTaskForm ? "Cancel" : "+ Add Task"}
                        </button>
                    </div>

                    {showTaskForm && (
                        <form onSubmit={handleCreateTask} style={styles.form}>
                            <input
                                style={styles.input}
                                type="text"
                                placeholder="Task Title"
                                value={taskForm.title}
                                onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                                required
                            />
                            <input
                                style={styles.input}
                                type="text"
                                placeholder="Description"
                                value={taskForm.description}
                                onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                                required
                            />
                            <select
                                style={styles.input}
                                value={taskForm.status}
                                onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
                            >
                                <option>Pending</option>
                                <option>In Progress</option>
                                <option>Completed</option>
                            </select>
                            <button style={styles.submitBtn} type="submit" disabled={creatingTask}>
                                {creatingTask ? "Adding..." : "Add Task"}
                            </button>
                        </form>
                    )}

                    {tasks.length === 0 ? (
                        <p style={styles.empty}>No tasks yet.</p>
                    ) : (
                        <div style={styles.taskList}>
                            {tasks.map((task) => (
                                <div key={task._id} style={styles.taskCard}>
                                    <div style={styles.taskTop}>
                                        <div>
                                            <p style={styles.taskTitle}>{task.title}</p>
                                            <p style={styles.taskDesc}>{task.description}</p>
                                            {task.assignedTo && (
                                                <p style={styles.taskMeta}>
                                                    👤 Assigned to: {task.assignedTo.name}
                                                </p>
                                            )}
                                        </div>
                                        <div style={styles.taskRight}>
                                            <select
                                                style={{ ...styles.statusSelect, borderColor: statusColor[task.status] }}
                                                value={task.status}
                                                onChange={(e) => handleStatusChange(task._id, e.target.value)}
                                            >
                                                <option>Pending</option>
                                                <option>In Progress</option>
                                                <option>Completed</option>
                                            </select>
                                            <button
                                                style={styles.deleteBtn}
                                                onClick={() => handleDeleteTask(task._id)}
                                            >
                                                🗑
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Members Section */}
                <div style={styles.section}>
                    <div style={styles.sectionHeader}>
                        <h3 style={styles.sectionTitle}>Members ({members.length})</h3>
                        <button style={styles.addBtn} onClick={() => setShowMemberForm(!showMemberForm)}>
                            {showMemberForm ? "Cancel" : "+ Add Member"}
                        </button>
                    </div>

                    {showMemberForm && (
                        <form onSubmit={handleAddMember} style={styles.form}>
                            <input
                                style={styles.input}
                                type="email"
                                placeholder="Member Email"
                                value={memberEmail}
                                onChange={(e) => setMemberEmail(e.target.value)}
                                required
                            />
                            <button style={styles.submitBtn} type="submit" disabled={addingMember}>
                                {addingMember ? "Adding..." : "Add Member"}
                            </button>
                        </form>
                    )}

                    <div style={styles.memberList}>
                        {members.map((m, i) => (
                            <div key={m._id || i} style={styles.memberCard}>
                                <div style={styles.avatar}>{m.name?.[0]?.toUpperCase()}</div>
                                <div>
                                    <p style={styles.memberName}>{m.name} {i === 0 && <span style={styles.ownerTag}>Owner</span>}</p>
                                    <p style={styles.memberEmail}>{m.email}</p>
                                </div>
                                {i !== 0 && (
                                    <button
                                        style={styles.removeBtn}
                                        onClick={() => handleRemoveMember(m._id)}
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    page: { minHeight: "100vh", background: "#0f0f1a" },
    container: { maxWidth: "900px", margin: "0 auto", padding: "32px 16px" },
    loading: { color: "#fff", textAlign: "center", marginTop: "40px" },
    back: {
        background: "none", border: "1px solid #333", color: "#aaa",
        padding: "8px 16px", borderRadius: "6px", cursor: "pointer", marginBottom: "20px"
    },
    error: {
        background: "#ff4d4d22", color: "#ff6b6b", padding: "10px",
        borderRadius: "6px", marginBottom: "16px", fontSize: "14px"
    },
    projectHeader: {
        background: "#1e1e2e", padding: "24px", borderRadius: "12px",
        marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start"
    },
    projectTitle: { color: "#fff", margin: "0 0 8px" },
    projectDesc: { color: "#aaa", margin: 0 },
    badge: { padding: "4px 12px", borderRadius: "20px", color: "#fff", fontSize: "12px", fontWeight: "bold" },
    section: { background: "#1e1e2e", borderRadius: "12px", padding: "24px", marginBottom: "20px" },
    sectionHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" },
    sectionTitle: { color: "#fff", margin: 0 },
    addBtn: {
        padding: "8px 16px", background: "#7c6af7", color: "#fff",
        border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold"
    },
    form: { display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "16px" },
    input: {
        flex: 1, minWidth: "160px", padding: "10px 12px", borderRadius: "8px",
        border: "1px solid #333", background: "#2a2a3e", color: "#fff", fontSize: "14px"
    },
    submitBtn: {
        padding: "10px 20px", background: "#7c6af7", color: "#fff",
        border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "bold"
    },
    empty: { color: "#666", textAlign: "center", padding: "20px 0" },
    taskList: { display: "flex", flexDirection: "column", gap: "10px" },
    taskCard: {
        background: "#2a2a3e", borderRadius: "8px", padding: "14px 16px",
        border: "1px solid #333"
    },
    taskTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start" },
    taskTitle: { color: "#fff", margin: "0 0 4px", fontWeight: "bold" },
    taskDesc: { color: "#aaa", margin: "0 0 4px", fontSize: "13px" },
    taskMeta: { color: "#7c6af7", fontSize: "12px", margin: 0 },
    taskRight: { display: "flex", alignItems: "center", gap: "8px" },
    statusSelect: {
        background: "#1e1e2e", color: "#fff", border: "1px solid",
        borderRadius: "6px", padding: "6px 8px", fontSize: "12px", cursor: "pointer"
    },
    deleteBtn: {
        background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "#ff6b6b"
    },
    memberList: { display: "flex", flexDirection: "column", gap: "10px" },
    memberCard: {
        background: "#2a2a3e", borderRadius: "8px", padding: "12px 16px",
        display: "flex", alignItems: "center", gap: "12px"
    },
    avatar: {
        width: "36px", height: "36px", background: "#7c6af7", borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontWeight: "bold", flexShrink: 0
    },
    memberName: { color: "#fff", margin: "0 0 2px", fontSize: "14px", fontWeight: "bold" },
    memberEmail: { color: "#888", margin: 0, fontSize: "12px" },
    ownerTag: {
        background: "#7c6af722", color: "#7c6af7", fontSize: "10px",
        padding: "2px 6px", borderRadius: "10px", marginLeft: "6px"
    },
    removeBtn: {
        marginLeft: "auto", background: "none", border: "1px solid #ff4d4d44",
        color: "#ff6b6b", padding: "4px 10px", borderRadius: "6px", cursor: "pointer", fontSize: "12px"
    }
};

export default ProjectDetail;
