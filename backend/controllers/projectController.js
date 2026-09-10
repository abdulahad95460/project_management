const Project = require("../models/Project");

const createProject = async (req, res) => {
    try {
             const { name, description } = req.body;

        const project = await Project.create({
                name,
                 description,
               owner: req.userId
        });

 res.status(201).json({
            message: "Project created successfully",
            project
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error while creating project",
            error: error.message
        });
    }
};

           const getProjects = async (req, res) => {
    try {
        const projects = await Project.find({ owner: req.userId });
        res.status(200).json({ projects });
    } catch (error) {
  res.status(500).json({
            message: "Server error while fetching projects",
            error: error.message
        });
    }
};

const getProject = async (req, res) => {
    try {
          const project = await Project.findOne({ _id: req.params.id, owner: req.userId });

 if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.status(200).json({ project });
    } catch (error) {
        res.status(500).json({
            message: "Server error while fetching project",
            error: error.message
        });
    }
};

const updateProject = async (req, res) => {
    try {
        const project = await Project.findOne({ _id: req.params.id, owner: req.userId });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        const { name, description, status } = req.body;

if (name) project.name = name;
             if (description) project.description = description;
        if (status) project.status = status;

        await project.save();

        res.status(200).json({
            message: "Project updated successfully",
            project
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error while updating project",
            error: error.message
        });
    }
};

const deleteProject = async (req, res) => {
    try {
        const project = await Project.findOneAndDelete({ _id: req.params.id, owner: req.userId });

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        res.status(500).json({
            message: "Server error while deleting project",
            error: error.message
        });
    }
};

module.exports = { createProject, getProjects, getProject, updateProject, deleteProject };