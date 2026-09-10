const Task = require("../models/Task");
const Project = require("../models/Project");


           const createTask = async (req, res) => {
    try {
    const project = await Project.findOne({ _id: req.params.projectId, owner: req.userId });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

               const { title, description, status } = req.body;

const task = await Task.create({
    title,
    description,
    status,
project: req.params.projectId
        });

        res.status(201).json({
            message: "Task created successfully",
            task
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error while creating task",
            error: error.message
        });
    }
};



const getTasks = async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.projectId, owner: req.userId });
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

    const tasks = await Task.find({ project: req.params.projectId });

        res.status(200).json({ tasks });
} catch (error) {
        res.status(500).json({
            message: "Server error while fetching tasks",
            error: error.message
        });
    }
};

const getTask = async (req, res) => {
    try {
const project = await Project.findOne({ _id: req.params.projectId, owner: req.userId });

if (!project) {
        return res.status(404).json({ message: "Project not found" });
        }

    const task = await Task.findOne({ _id: req.params.taskId, project: req.params.projectId });
 if (!task) {
    return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ task });
    } catch (error) {
        res.status(500).json({
            message: "Server error while fetching task",
            error: error.message
        });
    }
};


const updateTask = async (req, res) => {
    try {
 const project = await Project.findOne({ _id: req.params.projectId, owner: req.userId });
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

 const task = await Task.findOne({ _id: req.params.taskId, project: req.params.projectId });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

const { title, description, status } = req.body;

if (title) task.title = title;
   if (description) task.description = description;
        if (status) task.status = status;

        await task.save();

        res.status(200).json({
            message: "Task updated successfully",
            task
        });
    } catch (error) {
     res.status(500).json({
            message: "Server error while updating task",
            error: error.message
        });
    }
};


   const deleteTask = async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.projectId, owner: req.userId });
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

    const task = await Task.findOneAndDelete({ _id: req.params.taskId, project: req.params.projectId });
        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({
            message: "Server error while deleting task",
            error: error.message
        });
    }
};

module.exports = { createTask, getTasks, getTask, updateTask, deleteTask };
