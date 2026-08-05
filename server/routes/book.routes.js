const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");
const {
  getBooks,
  getDashboard,
  getBook,
  createBook,
  updateBook,
  deleteBook,
} = require("../controllers/book.controller");

// All book routes are protected
router.use(protect);

router.get("/dashboard", getDashboard);

router
  .route("/")
  .get(getBooks)
  .post(upload.single("image"), createBook);

router
  .route("/:id")
  .get(getBook)
  .put(upload.single("image"), updateBook)
  .delete(deleteBook);

module.exports = router;
