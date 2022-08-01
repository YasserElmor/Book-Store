module.exports = (req, res, next) => {
    if (!req.session.isAuthenticated || !req.user.isActive) {
        return res.redirect('/login');
    }
    next();
};