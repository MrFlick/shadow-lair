const express = require('express');

const router = express.Router();

function checkLogin(req, res, next) {
  const { user } = req;
  if (!user) {
    res.redirect('/login');
  } else {
    next();
  }
}

router.get('/login', (req, res) => {
  const messages = req.session && req.session.messages;
  res.render('login', { messages });
  if (messages) {
    req.session.messages = [];
  }
});

router.all('*', checkLogin);

router.get('*', (req, res) => {
  res.render('index');
});

module.exports = router;
