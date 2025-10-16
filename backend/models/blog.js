const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    bannerImage: {
      type: String,
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    postBy: {
      type: "string",
      required: true,
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
