const express = require("express");
const router = express.Router();

// Example route
router.get("/", (req, res) => {
  res.json({ message: "Auth Route Working!" });
});

module.exports = router;
