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

module.exports = invController