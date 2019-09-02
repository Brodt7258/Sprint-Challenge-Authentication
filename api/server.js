const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const session = require('express-session');

const authenticate = require('../auth/authenticate-middleware.js');
const authRouter = require('../auth/auth-router.js');
const jokesRouter = require('../jokes/jokes-router.js');

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());
server.use(session({
  name: 'webauth',
  secret: 'JetBeamsCantMeltSteelFuel',
  httpOnly: true,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 30
  }
}));

server.use('/api/auth', authRouter);
server.use('/api/jokes', authenticate, jokesRouter);

server.get('/', function(req, res) {
  res.status(200).json({ message: 'test' });
});

module.exports = server;
