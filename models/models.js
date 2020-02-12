const Sequelize = require('sequelize');

function getVerifiedEmail(profile) {
  if (profile.emails) {
    const record = profile.emails.find((x) => x.verified);
    if (record) {
      return record.value;
    }
    return null;
  }
  return null;
}

module.exports = (sequelize) => {
  const Person = sequelize.define('people', {
    personId: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    fullName: Sequelize.TEXT,
    email: Sequelize.TEXT,
  });

  const LoginId = sequelize.define('login_ids', {
    source: { type: Sequelize.TEXT, primaryKey: true },
    identifier: { type: Sequelize.TEXT, primaryKey: true },
    personId: Sequelize.INTEGER,
  });

  const LoginFailures = sequelize.define('login_failures', {
    rowid: { type: Sequelize.INTEGER, primaryKey: true },
    source: Sequelize.TEXT,
    identifier: Sequelize.TEXT,
    name: Sequelize.TEXT,
    email: Sequelize.TEXT,
    loginDateTime: { type: Sequelize.DATE, defaultValue: Sequelize.NOW },
  });

  Person.getFromLogin = function getFromLogin(profile, log = true) {
    const source = profile.provider;
    const identifier = profile.id;
    return LoginId.findOne({
      where: { source, identifier },
    }).then((record) => {
      if (record) {
        return Person.findByPk(record.personId);
      }
      if (log) {
        const attempt = { source, identifier, name: profile.displayName };
        const email = getVerifiedEmail(profile);
        if (email) {
          attempt.email = email;
        }
        return LoginFailures.create(attempt).then(() => Promise.resolve(null));
      }
      return Promise.resolve(null);
    });
  };


  return {
    Person,
  };
};
