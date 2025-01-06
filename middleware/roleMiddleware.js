const roleMiddleware = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden Access' });
        }
        next();
    };
};

module.exports = roleMiddleware;
