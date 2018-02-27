const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const NoteSchema = new Schema({
 // Just a string
  body: {
    type: String
  },
});

// Create the Note model with the NoteSchema
const Note = mongoose.model("Note", NoteSchema);

// Export the Note model
module.exports = Note;