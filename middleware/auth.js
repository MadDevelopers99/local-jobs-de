const prisma = require('../lib/db');

// Attach the logged-in user (if any) to req.currentUser and res.locals.currentUser
// so every EJS view can reference `currentUser` without each route fetching it.
async function attachUser(req, res, next) {
  if (req.session && req.session.userId) {
    try {
      const user = await prisma.user.findUnique({ where: { id: req.session.userId } });
      req.currentUser = user || null;
    } catch (e) {
      req.currentUser = null;
    }
  } else {
    req.currentUser = null;
  }
  res.locals.currentUser = req.currentUser;
  next();
}

// Blocks a route unless logged in, redirecting back to login with a return path.
function requireLogin(req, res, next) {
  if (!req.currentUser) {
    return res.redirect('/login.html?next=' + encodeURIComponent(req.originalUrl));
  }
  next();
}

module.exports = { attachUser, requireLogin };
