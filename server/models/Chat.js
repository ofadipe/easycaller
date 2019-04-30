const mongoose = require('mongoose');

let Schema = mongoose.Schema;


// Create the Chatroom Schema for the database
// Very much like creating a table in SQL

// We create a 'model' of an object that will go into
// the Database, below is the model

// So now we will be creating objects based on this
// model, so that the data inserted will go here.



const ChatSchema = new Schema ( {
  created: { type: Date, default: Date.now()},
  caller: {
    type: String,
    trim: true,
    required: "Mobile number is required",
    },
    receiver: {
      type: String,
      trim: true,
      required: "Mobile number is required",
    },
    ended: {
      type: Boolean,
      default: false
    },
    messages: {
      type: Array,
      default: []
    },
    messageSID: {
      type: String,
      required: false
    }
})

module.exports = mongoose.model('Chat', ChatSchema);
