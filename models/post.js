const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  title: String,
  content: String,
  createdAt: Date,
  updatedAt: Date,
});

PostSchema.virtual("postId").get(function() {
  return this._id.toHexString();
});
PostSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Todo", TodoSchema);