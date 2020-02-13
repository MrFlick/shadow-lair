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
    res.send(user);
  });

  router.get('/roles', requireRole('admin'), (req, res) => {
    models.Role.findAll().then((roles) => {
      res.send(roles);
    });
  });

  router.use((req, res) => {
    res.status(404).send('Unknown endpoint');
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
