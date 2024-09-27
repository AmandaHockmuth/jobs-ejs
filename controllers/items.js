const Item = require("../models/Item");
const parseVErr = require("../util/parseValidationErr");

const getAllItems = async (req, res) => {
  // console.log("getAllItems - WORKING");
  const items = await Item.find({ createdBy: req.user._id }).sort("createdAt");
  return res.render("items", { items, errors: req.flash("error") });
};

const newItemForm = (req, res) => {
  // console.log("newItemForm - WORKING");
  res.render("item", { item: null });
};

const createItem = async (req, res, next) => {
  // console.log("createItem - WORKING");
  req.body.createdBy = req.user._id;
  try {
    await Item.create(req.body);
    req.flash("info", "Item Added.");
    res.redirect("/api/v1/items");
  } catch (e) {
    if (e.constructor.name === "ValidationError") {
      parseVErr(e, req);
    } else if (e) {
      req.flash("error", e._message);
    } else {
      return next(e);
    }
    return res.render("item", { item: null, errors: req.flash("error") });
  }
};

const editSingleItem = async (req, res, next) => {
  // console.log("editSingleItem - WORKING");
  const {
    user: { _id: userId },
    params: { id: itemId },
  } = req;
  try {
    const item = await Item.findOne({
      _id: itemId,
      createdBy: userId,
    });
    if (!item) {
      req.flash("error", "Item not found or not authorized to edit.");
    }
    res.render("item", { item, errors: req.flash("error") });
  } catch (e) {
    if (e.constructor.name === "ValidationError") {
      parseVErr(e, req);
    } else if (e) {
      req.flash("error", e._message);
    } else {
      return next(e);
    }
    return res.render("item", { item: null, errors: req.flash("error") });
  }
};

const updateItem = async (req, res) => {
  // console.log("updateItem - WORKING");
  const {
    body: { title, value },
    user: { _id: userId },
    params: { id: itemId },
  } = req;
  const item = await Item.findOne({
    _id: itemId,
    createdBy: userId,
  });
  if (!title || !value) {
    req.flash("error", `Please provide valid title and value.`);
  }
  try {
    await Item.findByIdAndUpdate(
      {
        _id: itemId,
        createdBy: userId,
      },
      req.body,
      { new: true, runValidators: true }
    );
    req.flash("info", "Item Updated.");
    getAllItems(req, res);
  } catch (e) {
    if (e.constructor.name === "ValidationError") {
      parseVErr(e, req);
    } else if (e) {
      req.flash("error", e._message);
    } else {
      return next(e);
    }
    return res.render("item", { item: item, errors: req.flash("error") });
  }
};

const deleteItem = async (req, res) => {
  // console.log("deleteItem - WORKING");
  try {
    const {
      user: { _id: userId },
      params: { id: itemId },
    } = req;
    const item = await Item.findByIdAndDelete({
      _id: itemId,
      createdBy: userId,
    });
    if (!item) {
      req.flash("error", "Item not found or not authorized to delete.");
    }
    req.flash("info", "Item Deleted.");
    res.redirect("/api/v1/items");
  } catch (e) {
    if (e.constructor.name === "ValidationError") {
      parseVErr(e, req);
    } else if (e) {
      req.flash("error", e._message);
    } else {
      return next(e);
    }
    getAllItems(req, res);
  }
};

module.exports = {
  getAllItems,
  newItemForm,
  editSingleItem,
  createItem,
  updateItem,
  deleteItem,
};
