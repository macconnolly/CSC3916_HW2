let express = require('express');
let http = require ('http');
let bodyParser = require('body-parser');
let passport = require('passport');
let authController = require('./auth');
let authJwtController = require('./auth_jwt');
db = require('./db')();
let jwt = require('jsonwebtoken');

var app = express();
app.use(bodyParser.json());
// Permit the app to parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

let router = express.Router();

router.route('/post')
    .post(authController.isAuthenticated, function(req, res){
        // console.log(req.body);
        res = res.status(200);
        if (req.get('Content-Type')) {
            console.log("Content-Type: " + req.get('Content-Type'));
            res = res.type(req.get('Content-Type'));
        }
        res.send(req.body)
    });


app.post('/signup', function(req, res) {

    if(!req.body.username || !req.body.password) {
        res.json({success: false, msg: 'Please pass username and password'})
    } else {
        let newUser = {
            username: req.body.username,
            password: req.body.password
        };
        // Save the user
        db.save(newUser); // no doup checking
        res.json({success: true, msg: 'Successfully created new user'});
    }
});

router.post('/signin', function (req, res) {
    let user = db.findOne(req.body.username);
    // console.log('Finding: ' + req.body.username);
    // console.log('Perform the actual find ' + db.findOne(req.body.username));
    // console.log(user);

    if (!user) {
        res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
    }
    else {
        if(req.body.password == user.password) {
            let userToken = {id: user.id, username: user.username };
            let token = jwt.sign(userToken, authJwtController.secret);
            res.json({success: true, token: 'JWT ' + token})
        }
        else {
            res.status(401).send({success: false, msg: 'Authentication failed. Wrong password'});
        }
    }
});

// router.route('/post')
//     .post(authController.isAuthenticated, function (req, res) {
//         if(!req.body.username || !req.body.password){
//             res.json({success: false, msg: 'Please pass both username and password.'});
//         }
//         else {
//             let newUser = {
//                 username: req.body.username,
//                 password: req.body.password
//             };
//
//             // Save User
//             db.save(newUser);
//             res.json({success: true, msg: 'Sucussfully created new user.'});
//         }
//     });




router.route('/postjwt')
    .post(authJwtController.isAuthenticated, function(req, res){
       // console.log(req.body);
        res = res.status(200);
        if (req.get('Content-Type')) {
            // console.log("Content-Type: " + req.get('Content-Type'));
            res= res.type(req.get('Content-Type'));
        }
        res.send(req.body)
    });

app.use('/', router);
app.listen(process.env.PORT || 8080);


