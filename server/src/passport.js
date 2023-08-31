const User = require('./models/User');
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
// const dotenv = require('dotenv');
// require(dotenv).config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GAPP_CLIENT_ID,
      clientSecret: process.env.GAPP_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/api/auth/google/callback',
    },
    async function (accessToken, refreshToken, profile, done) {
      // console.log(profile)
      const promptId = profile._json.sub;
      //   console.log(`This is profile object: ${profile}`);
      try {
        let currentUser = await User.findOne({ providerId: promptId });
        if (!currentUser) {
          const newUser = await User.create({
            email: profile._json.email,
            name: profile._json.name,
            firstname: profile._json['given_name'],
            lastname: profile._json['family_name'],
            provider: profile.provider,
            providerId: profile._json.sub,
            profilePicture: profile._json.picture,
          });
          currentUser = newUser;
        }
        done(null, currentUser);
      } catch (error) {
        console.log(error);
      }
    }
  )
);

module.exports = passport;
