const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invController = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invController.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory detail view
 * ************************** */
invController.buildDetailView = async function(req, res, next) {
  const invId = req.params.invId
  const nav = await utilities.getNav()
  const data = await invModel.getInventoryById(invId)
  if (!data) {
    return next({status: 404, message: "Vehicle not found"})
  }
  const detail = utilities.buildDetailView(data)
  const title = `${data.inv_make} ${data.inv_model}`
  res.render("inventory/detail", { title, nav, detail })
}

/* ***************************
 *  Trigger intentional server error
 * ************************** */
invController.triggerError = function(req, res, next) {
  next(new Error("Intentional Server Error for testing purposes"))
}

/* ***************************
 *  Management view
 * ************************** */
invController.buildManagement = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    messages: req.flash ? [].concat(req.flash("notice")) : []
  })
}

/* ***************************
 *  Deliver add-classification view
 * ************************** */
invController.buildAddClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
    messages: []
  })
}

/* ***************************
 *  Process add-classification
 * ************************** */
invController.addClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body
  const regResult = await invModel.addClassification(classification_name)
  if (regResult.rowCount) {
    req.flash("notice", `Classification '${classification_name}' added successfully.`)
    let newNav = await utilities.getNav()
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav: newNav,
      messages: req.flash("notice")
    })
  } else {
    req.flash("notice", "Sorry, the classification could not be added.")
    res.status(500).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: [],
      messages: req.flash("notice")
    })
  }
}

/* ***************************
 *  Deliver add-inventory view
 * ************************** */
invController.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationList,
    errors: null,
    messages: []
  })
}

/* ***************************
 *  Process add-inventory
 * ************************** */
invController.addInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_price,
    inv_miles,
    inv_color,
    inv_image,
    inv_thumbnail
  } = req.body

  const regResult = await invModel.addInventory(
    classification_id, inv_make, inv_model, inv_description,
    inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, inv_year
  )

  if (regResult.rowCount) {
    req.flash("notice", `${inv_make} ${inv_model} added successfully.`)
    let newNav = await utilities.getNav()
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav: newNav,
      messages: req.flash("notice")
    })
  } else {
    req.flash("notice", "Sorry, adding the inventory item failed.")
    let classificationList = await utilities.buildClassificationList(classification_id)
    res.status(500).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationList,
      errors: [],
      messages: req.flash("notice"),
      inv_make, inv_model, inv_year, inv_description, inv_price, inv_miles, inv_color, inv_image, inv_thumbnail
    })
  }
}

module.exports = invController