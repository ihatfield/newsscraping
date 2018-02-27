const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ArticleSchema = new Schema({

  title: {
    type: String,
    required: true
  },
  // link is a required string
  link: {
    type: String,
    required: true
  },
  about: {
    type: String,
    required: true
  },
  // shows whether articles are saved
  saved: {type: Boolean, default: 0},
  // This only saves one note's ObjectId, ref refers to the Note model
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

// Create the Article model with the ArticleSchema
const Articles = mongoose.model("Article", ArticleSchema);

// Export the model
module.exports = Articles;