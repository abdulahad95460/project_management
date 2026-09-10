
 const mongoose = require("mongoose");


  const projectSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

  description: {
           type: String,
        required: true
    },

    owner: {
           type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

            status:  {
            type: String,
         enum: ["Active", "Completed", "On Hold"],
        default: "Active"
    }
}, {
       timestamps: true
});


 const Project = mongoose.model("Project", projectSchema);


  module.exports = Project