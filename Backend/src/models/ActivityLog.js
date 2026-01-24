const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    // existing fields (UNCHANGED)
    actionType: String,
    description: String,

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    performedByRole: {
      type: String, // "admin", "user", "volunteer"
    },

    relatedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    /* ================= ADDITIONS (OPTIONAL & SAFE) ================= */

    // If activity is related to a report
    report: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
    },

    // Owner of the report (used for user dashboard visibility)
    reportOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);
