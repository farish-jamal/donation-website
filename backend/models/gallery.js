const mongoose = require("mongoose");

const GallerySchema = new mongoose.Schema({
  title: {
    type: String,
  },
  image: {
    type: String,
  },
});

const Gallery = mongoose.model("Gallery", GallerySchema);
module.exports = Gallery;
