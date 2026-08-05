const Book = require("../models/Book");

// @route   GET /api/books
exports.getBooks = async (req, res) => {
  try {
    const { status, tag, search } = req.query;
    const query = { user: req.user._id };

    if (status) {
      query.status = status;
    }

    if (tag) {
      query.tags = tag;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { author: { $regex: search, $options: "i" } },
      ];
    }

    const books = await Book.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: books.length,
      books,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

// @route   GET /api/books/dashboard
exports.getDashboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalBooks = await Book.countDocuments({ user: userId });
    const reading = await Book.countDocuments({ user: userId, status: "Reading" });
    const completed = await Book.countDocuments({ user: userId, status: "Completed" });
    const wantToRead = await Book.countDocuments({ user: userId, status: "Want to Read" });

    res.status(200).json({
      success: true,
      data: {
        totalBooks,
        reading,
        completed,
        wantToRead,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

// @route   GET /api/books/:id
exports.getBook = async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, user: req.user._id });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

// @route   POST /api/books
exports.createBook = async (req, res) => {
  try {
    const { title, author, status, tags } = req.body;

    let imagePath = "";
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    }

    const parsedTags = typeof tags === "string"
      ? tags.split(",").map((t) => t.trim()).filter(Boolean)
      : Array.isArray(tags)
      ? tags
      : [];

    const book = await Book.create({
      user: req.user._id,
      title,
      author,
      status: status || "Want to Read",
      tags: parsedTags,
      image: imagePath,
    });

    res.status(201).json({
      success: true,
      book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

// @route   PUT /api/books/:id
exports.updateBook = async (req, res) => {
  try {
    let book = await Book.findOne({ _id: req.params.id, user: req.user._id });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    const { title, author, status, tags } = req.body;

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (author !== undefined) updateData.author = author;
    if (status !== undefined) updateData.status = status;

    if (tags !== undefined) {
      updateData.tags = typeof tags === "string"
        ? tags.split(",").map((t) => t.trim()).filter(Boolean)
        : Array.isArray(tags)
        ? tags
        : [];
    }

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    book = await Book.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

// @route   DELETE /api/books/:id
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Book removed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};
