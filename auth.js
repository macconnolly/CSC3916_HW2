// Load Required Packages

let passport = require('passport');
let BasicStrategy = require('passport-http').BasicStrategy;

passport.use(new BasicStrategy(
    function(username, password, done) {
        // Hard Coded
        let user = {name: 'testuser'};
        if (username == user.name && password == "cu")
        {
            return done(null, user);
        }
        else
        {
            return (done, false);
        }
    }
));

exports.isAuthenticated = passport.authenticate('basic', { session : false });
