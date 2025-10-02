const invModel = require("../models/inventory-model")
const utilities = require("../utilities")

const invController = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invController.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  let nav = await utilities.getNav()

  if (!data || data.length === 0) {
    req.flash("notice", "No vehicles found for this classification.")
    return res.render("./inventory/classification", {
      title: "No Vehicles Found",
      nav,
      grid: "<p class='notice'>There are no vehicles in this classification.</p>",
      errors: [],
      messages: req.flash("notice")
    })
  }

  const grid = await utilities.buildClassificationGrid(data)
  const className = data[0].classification_name

  res.render("./inventory/classification", {
    title: className + " Vehicles",
    nav,
    grid,
    errors: null,
    messages: []
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
  const classificationSelect = await utilities.buildClassificationList()
  res.render("inventory/management", {
  title: "Inventory Management",
  classificationSelect,
  nav,
  errors: null,
  messages: req.flash("notice")
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
    const classificationSelect = await utilities.buildClassificationList()
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav: newNav,
      classificationSelect,
      messages: req.flash("notice"),
      errors: null
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
    const classificationSelect = await utilities.buildClassificationList()
    res.status(201).render("inventory/management", {
      title: "Inventory Management",
      nav: newNav,
      classificationSelect,
      messages: req.flash("notice"),
      errors: null
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invController.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invController.buildEditInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.invId) // pega da URL
  let nav = await utilities.getNav()
  
  // Busca os dados do item no model
  const itemData = await invModel.getInventoryById(inv_id)
  
  if (!itemData) {
    req.flash("notice", "Vehicle not found.")
    return res.redirect("/inv/")
  }

  // Gera o select com a classificação já marcada
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)

  // Nome do veículo para título
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`

  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect,
    errors: null,
    messages: req.flash("notice"),
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
invController.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body

  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the update failed.")
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      errors: null,
      messages: req.flash("notice"),
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    })
  }
}

/* ***************************
 *  Build delete confirmation view
 * ************************** */
invController.buildDeleteConfirm = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    messages: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price
  })
}

/* ***************************
 *  Delete inventory item
 * ************************** */
invController.deleteInventoryItem = async function (req, res, next) {
  const inv_id = parseInt(req.body.inv_id)
  const deleteResult = await invModel.deleteInventoryItem(inv_id)

  if (deleteResult.rowCount > 0) {
    req.flash("notice", "The vehicle was successfully deleted.")
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, the delete failed.")
    res.redirect("/inv/delete/" + inv_id)
  }
}


module.exports = invController