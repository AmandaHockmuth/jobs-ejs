const express = require("express");
const router = express.Router();
const {
  getAllItems,
  newItemForm,
  editSingleItem,
  createItem,
  updateItem,
  deleteItem,
} = require("../controllers/items.js");

router.route("/").post(createItem).get(getAllItems);
router.route("/new").get(newItemForm);
router.route("/edit/:id").get(editSingleItem);
router.route("/update/:id").post(updateItem);
router.route("/delete/:id").post(deleteItem);

module.exports = router;
