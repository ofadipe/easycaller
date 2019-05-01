const express = require("express");

const router = express.Router();

const Chat = require("../models/Chat.js");

// Initalise the Twilio
const accountSid = 'AC7d9a242d789f6b6818a1a42874dd7e71';
const authToken = 'ce80f3522099c0343af8392d54be64c8';
const client = require('twilio')(accountSid, authToken);


// Route to get all of the chats ever one
// GET REQUEST -> /api/chats
router.get("/", function (req, res, next) {

  // Based on the Chat model, we find {} (all with no query)
  Chat.find({}, function (err, chats) {
    // If there was an error, return the error
    if (err) return next(err);

    // Otherwise response in JSON format the chats
    res.json(chats);
  });
});

router.post('/', function (req, res, next) {
  // Create the Chat Model Object
  let newChat = new Chat();
  // Req stands for Request, body is the data that is posted through
  newChat.caller = req.body.caller;
  newChat.receiver = req.body.receiver;
  console.log(newChat);
  newChat.save(function (err, post) {
    if (err) return next(err)

    // Create the Twilio Message Envirionment
    client.messages.create({
        body: 'Someone from the number: ' + newChat.caller + ' is calling you, please visit https://easycaller.co.uk/call/' + post._id + ' to get calling!',
        from: '+447723429420', // This is the Twilio Number
        to: newChat.receiver // The Number to send to
      })
      .then(
        message => {
          // Assign the message ID from twilio to our database
          newChat.messageSID = message.sid;
          // Update the entry
          newChat.save(function (err, finalsave) {
            if (err) return next(err);
            // return the chat entry
            res.json(finalsave);
          })
        }
      );
  })
})

// Get an individual chat
// Notice how we put in :id, this is so that we can pass through a query paramater to out findOne function
router.get("/find/:id", function (req, res, next) {
  Chat.findOne({
    _id: req.params.id
  }, function (err, chat) {
    if (err) return next(err);
    res.json(chat);
  })
})

// Update an database entry
// A New message to go into the chat
router.put("/message", function (req, res, next) {
  // Find the chat by the data id that is passed through
  Chat.findOne({
    _id: req.body.chat_id
  }, function (err, chat) {
    if (err) return next(err);

    // If we have found the chat, we created a JSON Object that contains the message
    const newMessage = {
      number: req.body.number,
      message: req.body.message,
      time: Date.now()
    }
    // push the object into the messages array
    chat.messages.push(newMessage);

    // Update the entry
    chat.save(function (err, update) {
      if (err) return next(err);

      req.app.io.emit("newMessage", newMessage);
      res.json(update);
    })

  })

})



  // This route will end the call, by changing the variable from false to true
  router.put("/endcall", function (req, res, next) {
    // Find the chat by the data id that is passed through
    Chat.findOne({
      _id: req.body.chat_id
    }, function (err, chat) {
      if (err) return next(err);

      // If we have found the chat, we created a JSON Object that contains the message

      // push the object into the messages array
      chat.ended = true

      // Update the entry
      chat.save(function (err, ended) {
        if (err) return next(err);

        req.app.io.emit("callEnded", ended);
        res.json(ended);
      })

    })
  })
module.exports = router;
