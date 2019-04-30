const express = require("express");

const router = express.Router();

const Chat = require("../models/Chat.js");

// Initalise the Twilio
const accountSid = 'AC7d9a242d789f6b6818a1a42874dd7e71';
const authToken = 'ce80f3522099c0343af8392d54be64c8';
const client = require('twilio')(accountSid, authToken);


// Route to get all of the chats ever one
router.get("/", function(req,res,next) {

  // Based on the Chat model, we find {} (all with no query)
  Chat.find({}, function(err,chats) {
    // If there was an error, return the error
    if(err) return next(err);

    // Otherwise response in JSON format the chats
    res.json(chats);
  });
});

router.post('/', function(req,res,next) {
  // Create the Chat Model Object
  let newChat = new Chat();
  // Req stands for Request, body is the data that is posted through
  newChat.caller = req.body.caller;
  newChat.receiver = req.body.receiver;
  console.log(newChat);
  newChat.save(function(err,post) {
    if(err) return next(err)

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
     newChat.save(function(err,finalsave) {
       if(err) return next(err);
       // return the chat entry
        res.json(finalsave);
      })
    }
     );
  })
/*
client.messages

*/

})


module.exports = router;
