const router = require('express').Router();
const bcrypt = require('bcrypt');

const users = require('../database/usersQueries');

router.post('/register', async (req, res) => {
  // implement registration
  try {
    const { username, password } = req.body;
    
    const hash = bcrypt.hashSync(password, 8);
    const newUser = await users.addUser({ username, password: hash });

    res.status(201).json(newUser);
  } catch(err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.post('/login', async (req, res) => {
  // implement login
  try {
    const { username, password } = req.body;
    const user = await users.getUserByName(username);

    if (user && bcrypt.compareSync(password, user.password)) {
      req.session.user = user;
      res.status(200).json({ message: 'welcome' });
    } else {
      res.status(403).json({ message: 'You shall not pass!' });
    }
  } catch(err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
