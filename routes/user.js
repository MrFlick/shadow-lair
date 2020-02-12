const express = require('express');

const router = express.Router();

router.get('/login', (req, res) => {
  const messages = req.session && req.session.messages;
  res.render('login', { messages });
  if (messages) {
    req.session.messages = [];
  }
});

router.use((req, res, next) => {
  const { user } = req;
  if (!user) {
    res.redirect('/login');
  } else {
    next();
  }
});

router.get('*', (req, res) => {
  res.render('index');
});

module.exports = router;