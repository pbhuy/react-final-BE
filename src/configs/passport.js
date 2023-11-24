require('dotenv').config();
const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
// const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
// const { Strategy: FacebookStrategy } = require('passport-facebook');

const googleConfig = {
    clientID: 'your_google_client_id',
    clientSecret: 'your_google_client_secret',
    callbackURL: '/auth/google/callback'
};
const facebookConfig = {
    clientID: 'your_facebook_client_id',
    clientSecret: 'your_facebook_client_secret',
    callbackURL: '/auth/facebook/callback'
};

// JWT Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.ACCESS_SECRET
};

passport.use(
    new JwtStrategy(jwtOptions, async (payload, done) => {
        try {
            const { id, role } = payload;
            if (!id || !role) {
                return done(null, false);
            }
            return done(null, { id, role });
        } catch (error) {
            return done(error, false);
        }
    })
);

// Google OAuth Strategy
// passport.use(
//     new GoogleStrategy(
//         googleConfig,
//         (accessToken, refreshToken, profile, done) => {
//             return done(null, user);
//         }
//     )
// );

// Facebook Strategy
// passport.use(
//     new FacebookStrategy(
//         facebookConfig,
//         (accessToken, refreshToken, profile, done) => {
//             return done(null, user);
//         }
//     )
// );

module.exports = passport;
