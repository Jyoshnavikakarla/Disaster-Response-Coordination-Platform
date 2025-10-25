const mongoose =require( "mongoose");
const Report =require("./models/Report"); // Adjust the path

// Get report by ID
const getReportById = async (req, res) => {
  try {
    const { id } = req.params;

    // Step 1: Validate if it's a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid report ID" });
    }

    // Step 2: Find the report in MongoDB
    const report = await Report.findById(id);

    // Step 3: If report does not exist, return 404
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    // Step 4: Return the report
    res.status(200).json(report);
  } catch (err) {
    console.error("Error fetching report:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};
// Update report status
 const updateReportStatus = async (req, res) => {
  try {
    const { id } = req.params; // report ID
    const { status } = req.body; // new status from frontend

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid report ID" });
    }

    // Validate status
    const validStatuses = ["Pending", "In Progress", "Completed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    // Update report
    const report = await Report.findByIdAndUpdate(
      id,
      { status },
      { new: true } // return updated doc
    );

    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    res.status(200).json(report);
  } catch (err) {
    console.error("Error updating status:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports={getReportById,updateReportStatus };