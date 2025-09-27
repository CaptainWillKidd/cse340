// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const validate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);
// Route to build inventory detail view
router.get("/detail/:invId", invController.buildDetailView);
// Route to trigger intentional server error
router.get("/error-test", (req, res, next) => {
  require("../controllers/invController").triggerError(req, res, next)
})

// Management
router.get("/", invController.buildManagement)

// Add Classification
router.get("/add-classification", invController.buildAddClassification)
router.post(
  "/add-classification",
  validate.classificationRules(),
  validate.checkClassification,
  invController.addClassification
)

// Add Inventory
router.get("/add-inventory", invController.buildAddInventory)
router.post(
  "/add-inventory",
  validate.inventoryRules(),
  validate.checkInventory,
  invController.addInventory
)

module.exports = router;
