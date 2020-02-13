function userHasRole(user, roles) {
  if (!roles) return true;
  if (!user.roles) return false;
  if (typeof roles === 'string') {
    return !!user.roles.find((x) => x.roleCode === roles);
  }
  if (Array.isArray(roles)) {
    return !!user.roles.find((x) => roles.indexOf(x.roleCode) !== -1);
  }
  return false;
}

function requireRole(roles) {
  return (req, res, next) => {
    if (userHasRole(req.user, roles)) {
      next();
    } else {
      res.status(403).send('Unauthorized');
    }
  };
}

module.exports = { requireRole };
