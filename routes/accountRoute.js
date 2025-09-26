// Needed Resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const validate = require('../utilities/account-validation')

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
  validate.registrationRules(),
  validate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
  "/login",
  (req, res) => {
    res.status(200).send('login process')
  }
)

module.exports = router