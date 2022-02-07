const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
  id: Number,
  title: String,
  content: String,
  writer: String,
  password: String,
  views: {
    type: Number,
    default: 0,
  },
  createdAt: String,
});

PostSchema.virtual("postId").get(function() {
  return this._id.toHexString();
});
PostSchema.set("toJSON", {
  virtuals: true,
});

module.exports = mongoose.model("Posts", PostSchema);