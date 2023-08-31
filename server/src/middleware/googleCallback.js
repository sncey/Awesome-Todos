const jwt = require('jsonwebtoken');

const app_secret = process.env.APP_SECRET;

const googleCallbackMiddleware = async (req, res) => {
  try {
    if (!req.user) {
      throw new Error('Failed to authenticate user');
    }
    const user = req.user;

    const currentTime = Math.floor(Date.now() / 1000);
    const expirationTime = currentTime + 14 * 24 * 60 * 60; // 14 days expiration

    const payload = {
      name: user.name,
      email: user.email,
      avatar: user.profilePicture,
      providerId: `google-${user.providerId}`,
      exp: expirationTime,
      iat: currentTime,
    };

    const jwtToken = jwt.sign(
      payload,
      'a6ThbaAD8YALAj31AOuASk21y16t7eTy8lkUmdi6LqABmImy'
    );

    res.cookie('jwt', jwtToken, {
      maxAge: 14 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.redirect('/');
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = googleCallbackMiddleware;
