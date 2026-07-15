const express = require("express");

const router = express.Router();

const {
  searchProducts,
  filterByCategory,
  filterByPrice,
  sortByPrice,
  latestProducts,
  pagination,
} = require("../controllers/productSearchController");

router.get("/search", searchProducts);

router.get("/category/:categoryId", filterByCategory);

router.get("/price", filterByPrice);

router.get("/sort", sortByPrice);

router.get("/latest", latestProducts);

router.get("/page", pagination);

module.exports = router;