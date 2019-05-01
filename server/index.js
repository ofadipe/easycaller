
// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()


const server = require("http").createServer(app);
const io = require("socket.io")(server);
app.io = io;

const nuxt = new Nuxt(config)

const { host, port } = nuxt.options.server
app.set("port", port)
// Data processing library for Express
const multer = require("multer")().single();

//Mongoose is Mongo Model Library
const mongoose = require("mongoose");


// Connect to the mongodb (if it doesnt exist it creates)
mongoose.connect("mongodb://localhost:27017/fmpchat", {
  useNewUrlParser: true
})

mongoose.Promise = global.Promise

let db = mongoose.connection

// If an error happens on connection
db.on("error", console.error.bind(console, "MongoDB Connection Error"))




// Creates the API Route  what is ha
const chats = require("./routes/messages");
app.use("/api/chats", multer, chats);

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  server.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()


io.on("connection", socket => {
  console.log("A new user has entered");
});
