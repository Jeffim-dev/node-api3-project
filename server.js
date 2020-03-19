const express = require('express')
const userRouter = require('./users/userRouter')

const server = express()

server.use(express.json())
server.use(logger)

server.use("/users", userRouter);


server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  const { ip, method, url } = req
   
  console.log(`IP${ip} Mehod:${method} URL:${url} Time:${Date.now()}` )
  
  next()
}

userRouter.use(errorHandler);

function errorHandler(error, req, res, next) {
  res.status(500).json(error.message);
}

module.exports = server;
