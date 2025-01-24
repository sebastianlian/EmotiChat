const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models/User'); // User model

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Local Strategy: For login
passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            const user = await User.findOne({ email });
            if (!user) return done(null, false, { message: 'User not found' });

            const isMatch = await user.isValidPassword(password);
            if (!isMatch) return done(null, false, { message: 'Invalid credentials' });

            return done(null, user);
        } catch (err) {
            return done(err);
        }
    })
);

// JWT Strategy: For protected routes
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
};

passport.use(
    new JwtStrategy(options, async (jwtPayload, done) => {
        try {
            console.log(`Verifying JWT for user ID: ${jwtPayload.id}`);
            const user = await User.findById(jwtPayload.id);
            if (!user) {
                console.error('User not found for JWT');
                return done(null, false);
            }

            console.log('User verified successfully for JWT');
            return done(null, user);
        } catch (err) {
            console.error('Error in JwtStrategy:', err);
            return done(err);
        }
    })
);

