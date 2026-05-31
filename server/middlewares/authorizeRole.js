const authorizeRole = (allowedRole) => {
  return (req, res, next) => {
    if (req.user.role !== allowedRole) {
      return res.status(403).json({
        message: "Access Denied",
      });
    }
    next();
  };
};

module.exports = { authorizeRole };
