let express = require('express');
let http = require('http');
let bodyParser = require('body-parser');
let passport = require('passport');
let authController = require('./auth');
let authJwtController = require('./auth_jwt');
db = require('./db')(); //global hack
let jwt = require('jsonwebtoken');
let url = require('url');

require('dotenv').config();

let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(passport.initialize());

let router = express.Router();

function getJSONObject(req) {
    let json = {
        headers: "No Headers",
        key: process.env.UNIQUE_KEY,
        body: "No Body"
    };

    if (req.body != null) {
        json.body = req.body;
    }
    if (req.headers != null) {
        json.headers = req.headers;
    }

    return json;
}


router.route('/')
    .all((req, res) => {
            res.status(401);
            res.json({
                Error: 'Forbidden',
                Message: 'No resources exist at this endpoint.'
            }).send();
        }
    );

router.route('/signup')
    .post((req, res) => {

        if (!req.body.username || !req.body.password) {
            res.status(422);
            res.json(
                {
                    success: false,
                    msg: 'Please pass username and password.'

                }).send();
        } else {
            let newUser = {
                username: req.body.username,
                password: req.body.password
            };
            // save the user
            db.save(newUser); //no duplicate checking
            res.status(201);
            res.json(
                {
                    success: true,
                    msg: 'Successfully created new user.'

                }).send();
        }
    })

    .all((req, res) => {
        res.status(405)
            .send(
                {
                    Error: 'Method Not Allowed ',
                    Message: 'Unsupported HTTP Method'
                });
    });


router.route('/signin')
    .post((req, res) => {
        console.log(process.env.UNIQUE_KEY);
        let user = db.findOne(req.body.username);

        if (!user) {
            res.status(403).send(
                {
                    success: false,
                    msg: 'Authentication failed. User not found.'
                });
        } else {
            // check if password matches
            if (req.body.password == user.password) {
                let userToken = {id: user.id, username: user.username};
                let token = jwt.sign(userToken, process.env.UNIQUE_KEY);
                res.json({success: true, token: 'JWT ' + token});
            } else {
                res.status(403).send(
                    {
                        success: false,
                        msg: 'Authentication failed. Wrong password.'
                    });
            }
        }
    })
    .all((req, res) => {
        res = res.status(405);
        res.json(
            {
                Error: 'Method Not Allowed ',
                Message: 'Unsupported HTTP Method'
            }).send();
    });


router.route('/movies')
    .get((req, res) => {
        res.set(req.headers);
        res.status(200);
        res.query = req.query;
        res = res.json(
            {
                env: process.env.UNIQUE_KEY,
                message: 'get movies',
                query: req.query,
                headers: req.headers
            }).send();

    })
    .post((req, res) => {

        res.set(req.headers);
        res.status(200);
        res.query = req.query;
        res = res.json(
            {
                env: process.env.UNIQUE_KEY,
                message: 'movie Saved',
                query: req.query,
                headers: req.headers
            }).send();

    })

    .put(authJwtController.isAuthenticated, (req, res) => {


        res.set(req.headers);
        res.status(200);
        res.query = req.query;
        res = res.json(
            {
                env: process.env.UNIQUE_KEY,
                message: 'movie updated',
                query: req.query,
                headers: req.headers
            }).send();

    })

    .delete(authController.isAuthenticated, (req, res) => {

        res.set(req.headers);
        res.query = req.query;
        res = res.json(
            {
                status: 200,
                env: process.env.UNIQUE_KEY,
                message: 'Movie Deleted',
                query: req.query,
                headers: req.headers
            }).send();
    })

    .all((req, res) => {
        res.status(405);
        res.json(
            {
                Error: 'Method Not Allowed ',
                Message: 'Unsupported HTTP Method'
            }).send();
    });

// router.route('/post')
//      .post(authJwtController.isAuthenticated, (req, res) => {
//             console.log(req.body);
//             res = res.status(200);
//             if (req.get('Content-Type')) {
//                 console.log("Content-Type: " + req.get('Content-Type'));
//                 res = res.type(req.get('Content-Type'));
//             }
//             let o = getJSONObject(req);
//             res.json(o);
//         }
//
//     );

// router.route('/postjwt')
//     .post(authJwtController.isAuthenticated, (req, res) => {
//             // console.log(req.body);
//             res = res.status(200);
//             if (req.get('Content-Type')) {
//                 console.log("Content-Type: " + req.get('Content-Type'));
//                 res = res.type(req.get('Content-Type'));
//             }
//             res.send(req.body);
//         }
//
//     )


app.use('/', router);
app.listen(process.env.PORT || 8080);

module.exports = app; // for testing