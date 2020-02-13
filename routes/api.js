const express = require('express');
const modelSource = require('../models/models');

const { requireRole } = require('../utils/permission');

const router = express.Router();

function getRouter(sequelize) {
  const models = modelSource(sequelize);

  router.use((req, res, next) => {
    const { user } = req;
    if (!user) {
      res.status(401).send('Not logged in');
    } else {
      next();
    }
  });
  router.use(express.json());

  router.get('/me', (req, res) => {
    const { user } = req;
    models.Person.findByPk(user.personId).then((person) => {
      res.send({ db: person, session: user });
    });
  });

  router.get('/protected', requireRole('admin'), (req, res) => {
    res.send('admin');
  });

  router.get('*', (req, res) => {
    res.send('hello');
  });

  // API Error Handler
  // eslint-disable-next-line consistent-return
  router.use((err, req, res, next) => {
    console.log('ERROR HANDLER');
    if (res.headersSent) {
      return next(err);
    }
    res.status(err.status || 500).json({ message: err.message });
  });

  return router;
}

module.exports = getRouter;
