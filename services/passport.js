const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');


const User = mongoose.model('users');

passport.serializeUser((user, done) => {
    done(null, user.id); //id from mongoose
})

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then(user => {
            done(null, user);
        });
});

passport.use(
    new GoogleStrategy(
        {
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: '/auth/google/callback'
        },
        async (accessToken, refreshToken, profile, done) => {
            const existingUser = await User.findOne({ googleId: profile.id })
                
                    if (existingUser) {
                        //if existing user exist, log the user in 
                        done(null, existingUser);

                    }                       //if new user does not exist create new
                       const user = await new User({ googleId: profile.id }).save()
                         done(null, user)
                    
                })
                );
//168285095575-h59ltlmo9ssb85ap8ngqfgbu2pkj82c6.apps.googleusercontent.com
//XyFueCAfw_Pg4sHyNBJMXswF