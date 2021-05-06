const { Schema, model } = require("mongoose");

const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: String,
    default: "General",
  },
  body: {
    type: String,
    required: true,
  },
  mainImage: {
    type: String,
  },
  thumbnail: {
    type: String,
  },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  
});

module.exports = model("blog", blogSchema);
