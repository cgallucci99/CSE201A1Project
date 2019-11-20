// This is middleware for restricting routes a user is not allowed to visit if not an admin
module.exports = function (req, res, next) {
    // If the user is an admin, continue with the request to the restricted route
    if (req.user.admin == 1) {
        return next();
    }
    req.flash('error','must be admin to access');
    return res.redirect("back");
};