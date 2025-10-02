// Needed Resources 
const utilities = require("../utilities")
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
router.get("/", 
  utilities.checkLogin, 
  utilities.checkEmployeeOrAdmin, 
  invController.buildManagement)

// Add Classification
router.get("/add-classification", 
  utilities.checkLogin, 
  utilities.checkEmployeeOrAdmin, 
  invController.buildAddClassification)
router.post(
  "/add-classification",
  utilities.checkLogin,
  utilities.checkEmployeeOrAdmin,
  validate.classificationRules(),
  validate.checkClassification,
  invController.addClassification
)

// Add Inventory
router.get("/add-inventory", 
  utilities.checkLogin, 
  utilities.checkEmployeeOrAdmin, 
  invController.buildAddInventory)
router.post(
  "/add-inventory",
  utilities.checkLogin,
  utilities.checkEmployeeOrAdmin,
  validate.inventoryRules(),
  validate.checkInventory,
  invController.addInventory
)

// Edit
router.get("/edit/:invId", 
  utilities.checkLogin,
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildEditInventory))

// Update
router.post("/update",
  utilities.checkLogin,
  utilities.checkEmployeeOrAdmin,
  validate.inventoryRules(),
  validate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory))

// Delete
router.get("/delete/:inv_id", 
  utilities.checkLogin,
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.buildDeleteConfirm))

router.post("/delete", 
  utilities.checkLogin,
  utilities.checkEmployeeOrAdmin,
  utilities.handleErrors(invController.deleteInventoryItem))

module.exports = router;
