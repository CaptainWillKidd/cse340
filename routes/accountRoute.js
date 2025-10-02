// Needed Resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const accountController = require("../controllers/accountController")
const validate = require('../utilities/account-validation')

// Route for "My Account" page
router.get(
  "/", 
  utilities.checkLogin, 
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

// Process the login request
router.post(
  "/login",
  validate.loginRules(),
  validate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Update account info view
router.get(
  "/update/:account_id",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildUpdateAccount)
)

// Process account update
router.post(
  "/update",
  validate.updateAccountRules(),
  validate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount)
)

// Process password update
router.post(
  "/update-password",
  validate.updatePasswordRules(),
  validate.checkUpdatePassword,
  utilities.handleErrors(accountController.updatePassword)
)

router.get("/logout", accountController.logout)

module.exports = router