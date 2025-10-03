const wishlistModel = require("../models/wishlist-model");
const utilities = require("../utilities");
const db = require("../database/");

const wishlistController = {};

/* Add item to wishlist */
wishlistController.addToWishlist = async function (req, res) {
  const inv_id = parseInt(req.params.inv_id);
  const account_id = res.locals.accountData.account_id;

  const result = await wishlistModel.addToWishlist(account_id, inv_id);

  if (result) {
    req.flash("notice", "Item added to your wishlist!");
  } else {
    req.flash("notice", "Item is already in your wishlist.");
  }
  res.redirect(`/inv/detail/${inv_id}`);
};

/* Show user's wishlist */
wishlistController.buildWishlist = async function (req, res) {
  const account_id = res.locals.accountData.account_id;
  let nav = await utilities.getNav();
  const wishlist = await wishlistModel.getWishlistByAccount(account_id);

  res.render("account/wishlist", {
    title: "My Wishlist",
    nav,
    errors: null,
    messages: req.flash("notice"),
    wishlist
  });
};

/* Remove item from wishlist */
wishlistController.removeWishlistItem = async (req, res) => {
  try {
    const accountId = res.locals.accountData.account_id;
    const invId = parseInt(req.params.inv_id);

    if (!accountId) return res.status(401).json({ success: false, message: "Not logged in" });

    const sql = 'DELETE FROM wishlist WHERE account_id = $1 AND inv_id = $2 RETURNING *';
    const result = await db.query(sql, [accountId, invId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = wishlistController;
