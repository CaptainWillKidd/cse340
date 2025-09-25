// Needed Resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")

// Route for "My Account" page
router.get(
  "/", 
  utilities.handleErrors(accountController.buildAccount)
)

// Login GET route
router.get(
  "/login",
  utilities.handleErrors(accountController.buildLogin)
)

// Registration GET route
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
)

// Registration POST route
router.post(
  "/register",
  utilities.handleErrors(accountController.registerAccount)
)

module.exports = router