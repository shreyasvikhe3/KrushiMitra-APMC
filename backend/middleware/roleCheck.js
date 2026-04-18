const checkRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (!req.user.isApproved) {
      return res.status(403).json({ 
        message: 'Your request is sent to the officer. Contact APMC for approval.' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'You do not have permission to access this resource' 
      });
    }

    next();
  };
};

module.exports = { checkRole };
