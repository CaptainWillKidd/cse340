  const utilities = require("../utilities/")
  const accountModel = require("../models/account-model")

  /* ****************************************
  *  Deliver login view
  * *************************************** */
  async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      messages: req.flash ? [].concat(req.flash("notice")) : []
    })
  }

  /* ****************************************
  *  Deliver registration view
  * *************************************** */
  async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      messages: req.flash ? [].concat(req.flash("notice")) : [],
      errors: null
    })
  }

  /* ****************************************
  *  Process Registration
  * *************************************** */
  async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  const errors = []

  if (!account_firstname || account_firstname.trim() === '') {
    errors.push('First name is required.')
  }

  if (!account_lastname || account_lastname.trim() === '') {
    errors.push('Last name is required.')
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!account_email || !emailRegex.test(account_email)) {
    errors.push('A valid email is required.')
  }

  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{12,}$/
  if (!account_password || !passwordRegex.test(account_password)) {
    errors.push('Password must be at least 12 characters, include 1 uppercase letter, 1 number, and 1 special character.')
  }

  if (errors.length > 0) {
    return res.status(400).render("account/register", {
      title: "Register",
      nav,
      messages: errors
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )

  if (regResult) {
    req.flash("notice", `Congratulations, you're registered ${account_firstname}. Please log in.`)
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      messages: req.flash ? [].concat(req.flash("notice")) : []
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      messages: req.flash ? [].concat(req.flash("notice")) : []
    })
  }
}


  module.exports = { buildLogin, buildRegister, registerAccount }
