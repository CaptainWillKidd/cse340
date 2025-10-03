const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const wishlistController = require("../controllers/wishlistController");

// Adicionar item à wishlist
router.get(
  "/add/:inv_id",
  utilities.checkLogin,
  wishlistController.addToWishlist
);

// Listar wishlist do usuário
router.get(
  "/",
  utilities.checkLogin,
  wishlistController.buildWishlist
);

// Remover item da wishlist via AJAX
router.delete(
  "/remove/:inv_id",
  utilities.checkLogin,
  wishlistController.removeWishlistItem
);

module.exports = router;
