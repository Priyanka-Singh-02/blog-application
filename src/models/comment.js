const { Schema, model } = require("mongoose");

const commentschema = new Schema({
  // author:{type:String,default:"",required:true,ref:'blog'},
  blogId: { type: Schema.Types.ObjectId, ref: "blog" },
  createdAt: { type: Date, default: Date.now },
  commentBody: { type: String, default: "" },
  commentAuthor: { type: Schema.Types.ObjectId, default: "" },
  blogAuthor: { type: Schema.Types.ObjectId, default: "" },
  blogTitle: { type: String, default: "" },
});
module.exports = model("comment", commentschema);
