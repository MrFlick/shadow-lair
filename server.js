const express = require('express');
const session = require('express-session');
const Sequelize = require('sequelize');

const app = express();
const port = 3000;

const config = require('./.config');

app.set('views', './views');
app.set('view engine', 'pug');

app.use(express.static('public'));

const sequelize = new Sequelize('sqlite:db/data.sqlite3', {
  logging: false,
  define: {
    timestamps: false,
  },
});

app.use(session({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false,
}));

const auth = require('./routes/auth')(app, config, sequelize);
const api = require('./routes/api')(sequelize);
const user = require('./routes/user');

app.use('/auth', auth);
app.use('/api', api);
app.use('/', user);

sequelize.sync().then(() => {
  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
});
