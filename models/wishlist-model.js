const pool = require("../database/");

async function addToWishlist(account_id, inv_id) {
  try {
    const check = await pool.query(
      "SELECT * FROM wishlist WHERE account_id = $1 AND inv_id = $2",
      [account_id, inv_id]
    );
    if (check.rows.length > 0) return null;

    const sql = "INSERT INTO wishlist (account_id, inv_id) VALUES ($1, $2)";
    const result = await pool.query(sql, [account_id, inv_id]);
    return result.rowCount;
  } catch (err) {
    console.error("Add to wishlist error:", err);
    return null;
  }
}

async function getWishlistByAccount(account_id) {
  try {
    const sql = `
      SELECT w.wishlist_id, i.inv_id, i.inv_make, i.inv_model, i.inv_year, i.inv_price
      FROM wishlist w
      JOIN inventory i ON w.inv_id = i.inv_id
      WHERE w.account_id = $1
    `;
    const result = await pool.query(sql, [account_id]);
    return result.rows;
  } catch (err) {
    console.error("Get wishlist error:", err);
    return [];
  }
}

module.exports = { addToWishlist, getWishlistByAccount };
