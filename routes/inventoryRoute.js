// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// Route to build inventory detail view
router.get("/detail/:invId", invController.buildDetailView);
// Route to trigger intentional server error
router.get("/error-test", (req, res, next) => {
  require("../controllers/invController").triggerError(req, res, next)
})

module.exports = router;
