const Task = require("../models/Task");
const Project = require("../models/Project");
const User = require("../models/user");


         const createTask = async (req, res) => {
 try {
     const { title, description, status, assignedTo } = req.body;

     const project = await Project.findOne({
            _id: req.params.projectId,
            owner: req.userId
  });

     if (!project) {
         return res.status(404).json({
                message: "Project not found or you are not the owner"
      });
     }

            if (assignedTo) {
     const isMember = project.members.some(
      (memberId) => memberId.toString() === assignedTo
            );

                if (!isMember) {
             return res.status(400).json({
                    message: "User is not a member of this project"
                });
         }
        }

    const task = await Task.create({
            title,
            description,
            status,
            project: req.params.projectId,
            assignedTo: assignedTo || null
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
     const project = await Project.findOne({
        _id: req.params.projectId,
 $or: [
                { owner: req.userId },
                { members: req.userId }
         ]
        });

    if (!project) {
            return res.status(404).json({
                message: "Project not found or access denied"
            });
        }

    const tasks = await Task.find({
            project: req.params.projectId
        })
            .populate("assignedTo", "name email")
            .sort({ createdAt: -1 });

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
     const project = await Project.findOne({
  _id: req.params.projectId,
     $or: [
          { owner: req.userId },
      { members: req.userId }
            ]
        });

 if (!project) {
            return res.status(404).json({
      message: "Project not found or access denied"
            });
        }

     const task = await Task.findOne({
            _id: req.params.taskId,
            project: req.params.projectId
             }).populate("assignedTo", "name email");

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
        const project = await Project.findOne({
            _id: req.params.projectId,
            owner: req.userId
        });

            if (!project) {
            return res.status(404).json({
                message: "Project not found or you are not the owner"
            });
     }

        const task = await Task.findOne({
            _id: req.params.taskId,
            project: req.params.projectId
        });

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        const { title, description, status, assignedTo } = req.body;

        if (title !== undefined) task.title = title;
        if (description !== undefined) task.description = description;
        if (status !== undefined) task.status = status;

        if (assignedTo !== undefined) {
            if (assignedTo === null || assignedTo === "") {
                task.assignedTo = null;
            } else {
                const isMember = project.members.some(
                    (memberId) => memberId.toString() === assignedTo
                );

                if (!isMember) {
                    return res.status(400).json({
                        message: "User is not a member of this project"
                    });
                }

                task.assignedTo = assignedTo;
            }
        }

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
        const project = await Project.findOne({
            _id: req.params.projectId,
            owner: req.userId
        });

        if (!project) {
            return res.status(404).json({
                message: "Project not found or you are not the owner"
            });
        }

        const task = await Task.findOneAndDelete({
            _id: req.params.taskId,
            project: req.params.projectId
        });

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
