const Project = require("../models/Project");
const User = require("../models/user");


       const addMember = async (req, res) => {
       try {
  const { email } = req.body;

     const project = await Project.findOne({
            _id: req.params.projectId,
            owner: req.userId
     });

           if (!project) {
            return res.status(404).json({
                message: "Project not found or you are not the owner"
            });
     }

          const user = await User.findOne({ email });

     if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

      if (user._id.toString() === req.userId) {
            return res.status(400).json({
                message: "Owner is already part of the project"
            });
  }

         const alreadyMember = project.members.some(
            (memberId) => memberId.toString() === user._id.toString()
     );

     if (alreadyMember) {
            return res.status(400).json({
                message: "User is already a project member"
            });
     }

     project.members.push(user._id);
        await project.save();

        res.status(200).json({
            message: "Member added successfully",
            member: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error while adding member",
            error: error.message
        });
    }
};

const getMembers = async (req, res) => {
    try {
        const project = await Project.findOne({
            _id: req.params.projectId,
            $or: [
                { owner: req.userId },
                { members: req.userId }
            ]
        })
            .populate("owner", "name email")
            .populate("members", "name email");

        if (!project) {
            return res.status(404).json({
                message: "Project not found or access denied"
            });
        }

        res.status(200).json({
            owner: project.owner,
            members: project.members
        });
    } catch (error) {
        res.status(500).json({
            message: "Server error while fetching members",
            error: error.message
        });
    }
};

const removeMember = async (req, res) => {
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

        const memberExists = project.members.some(
            (memberId) => memberId.toString() === req.params.userId
        );

        if (!memberExists) {
            return res.status(404).json({
                message: "Member not found in this project"
            });
        }

        project.members = project.members.filter(
            (memberId) => memberId.toString() !== req.params.userId
        );

        await project.save();

        await require("../models/Task").updateMany(
            { project: project._id, assignedTo: req.params.userId },
            { $set: { assignedTo: null } }
        );

        res.status(200).json({ message: "Member removed successfully" });
    } catch (error) {
        res.status(500).json({
            message: "Server error while removing member",
            error: error.message
        });
    }
};

module.exports = { addMember, getMembers, removeMember };
