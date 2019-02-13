// Load required packages
let passport = require('passport');
let JWTStrategy = require('passport-jwt').Strategy;
let ExtractJwt = require('passport-jwt').ExtractJwt;


let opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('JWT');
opts.secretOrKey = "mysecretkeythatshouldnotbestoredhere";



passport.use(new JWTStrategy(opts, function (jwt_payload, done) {
    let user = db.find(jwt_payload.id);

    if (user) {
        done(null, user);
    }
    else {
        done(null, false);
    }
}));

exports.isAuthenticated = passport.authenticate('jwt', {session : false});
exports.secret = opts.secretOrKey;


