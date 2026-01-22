const Complaint = require("../models/Complaint");

exports.createComplaint = async (req, res) => {
  try {
    const { title, issueType, priority, description, address, landmark, lat, lng } = req.body;

    const complaint = new Complaint({
      user_id: req.user.id,
      title,
      issueType,
      priority,
      description,
      address,
      landmark,
      photo: req.file ? req.file.path : null,
      location_coords: { lat, lng }
    });

    await complaint.save();
    res.status(201).json({ message: "Complaint submitted successfully", complaint });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};