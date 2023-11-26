require('dotenv').config();
const passport = require('passport');
const { Strategy: JwtStrategy, ExtractJwt } = require('passport-jwt');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { Strategy: FacebookStrategy } = require('passport-facebook');

// JWT Strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.ACCESS_SECRET
};

passport.use(
    new JwtStrategy(jwtOptions, async (payload, done) => {
        try {
            const { _id, role } = payload;
            if (!_id || !role) {
                return done(null, false);
            }
            return done(null, { _id, role });
        } catch (error) {
            return done(error, false);
        }
    })
);

// Google OAuth Strategy
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
            clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
            callbackURL: '/api/accounts/auth/google/callback'
        },
        (accessToken, refreshToken, profile, done) => {
            done(null, profile);
        }
    )
);

// Facebook Strategy
passport.use(
    new FacebookStrategy(
        {
            clientID: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
            callbackURL: '/api/accounts/auth/facebook/callback'
        },
        (accessToken, refreshToken, profile, done) => {
            done(null, profile);
        }
    )
);

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

module.exports = passport;
