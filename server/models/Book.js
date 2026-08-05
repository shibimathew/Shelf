const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Book title is required"],
      trim: true,
    },
    author: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["Want to Read", "Reading", "Completed"],
      default: "Want to Read",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    image: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Book", bookSchema);
