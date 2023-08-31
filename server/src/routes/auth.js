const express = require('express');
const routes = express.Router();
const passport = require('../passport');
const googleCallbackMiddleware = require('../middleware/googleCallback');
const authMiddleware = require('../middleware/authentication');

routes.get(
  '/google',
  passport.authenticate('google', { scope: ['openid', 'email', 'profile'] })
);

routes.get('/me', authMiddleware, (req, res) => {
  const user = req.user;
  console.log(user);

  try {
    const payload = {
      avatar: user.avatar,
      name: user.name,
      email: user.email,
    };

    res.status(200).json(payload);
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
  //res.json(user);
});

routes.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  googleCallbackMiddleware
);

routes.get('/logout', (req, res) => {
  res.clearCookie('jwt');
  res.status(200).end();
});

module.exports = routes;
