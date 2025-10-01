const { body, validationResult } = require("express-validator")
const utilities = require(".")
const invModel = require("../models/inventory-model") // ajuste se o nome/path mudar

const validate = {}

validate.classificationRules = () => {
  return [
    body("classification_name")
      .trim()
      .notEmpty()
      .isAlphanumeric()
      .withMessage("Classification name is required and must contain only letters and numbers (no spaces).")
  ]
}

validate.checkClassification = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    return res.render("inventory/add-classification", {
      errors: errors.array(),
      title: "Add Classification",
      nav,
      classification_name: req.body.classification_name,
      messages: []
    })
  }
  next()
}

/* Inventory rules */
validate.inventoryRules = () => {
  return [
    body("classification_id").trim().notEmpty().withMessage("Please choose a classification."),
    body("inv_make").trim().notEmpty().withMessage("Make is required."),
    body("inv_model").trim().notEmpty().withMessage("Model is required."),
    body("inv_year").trim().notEmpty().isInt({ min: 1886 }).withMessage("Please provide a valid year."),
    body("inv_description").trim().notEmpty().withMessage("Description is required."),
    body("inv_price").trim().notEmpty().matches(/^\d+(\.\d{2})?$/).withMessage("Price must be a number with up to two decimals."),
    body("inv_miles").trim().notEmpty().isInt({ min: 0 }).withMessage("Miles must be a positive integer."),
    body("inv_color").trim().notEmpty().withMessage("Color is required."),
    body("inv_image").trim().notEmpty().withMessage("Image path is required."),
    body("inv_thumbnail").trim().notEmpty().withMessage("Thumbnail path is required.")
  ]
}

validate.checkInventory = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    // rebuild classification select keeping chosen value
    let classificationList = await utilities.buildClassificationList(req.body.classification_id)
    return res.render("inventory/add-inventory", {
      errors: errors.array(),
      title: "Add Inventory",
      nav,
      classificationList,
      // sticky fields
      inv_make: req.body.inv_make,
      inv_model: req.body.inv_model,
      inv_year: req.body.inv_year,
      inv_description: req.body.inv_description,
      inv_price: req.body.inv_price,
      inv_miles: req.body.inv_miles,
      inv_color: req.body.inv_color,
      inv_image: req.body.inv_image,
      inv_thumbnail: req.body.inv_thumbnail,
      messages: []
    })
  }
  next()
}

/* ***************************
 * Check update data and return errors to Edit view
 * ************************** */
validate.checkUpdateData = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classificationSelect = await utilities.buildClassificationList(req.body.classification_id)

    const itemName = `${req.body.inv_make} ${req.body.inv_model}`

    return res.render("inventory/edit-inventory", {
      errors: errors.array(),
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      messages: [],
      inv_id: req.body.inv_id,
      inv_make: req.body.inv_make,
      inv_model: req.body.inv_model,
      inv_year: req.body.inv_year,
      inv_description: req.body.inv_description,
      inv_price: req.body.inv_price,
      inv_miles: req.body.inv_miles,
      inv_color: req.body.inv_color,
      inv_image: req.body.inv_image,
      inv_thumbnail: req.body.inv_thumbnail,
      classification_id: req.body.classification_id
    })
  }
  next()
}


module.exports = validate
