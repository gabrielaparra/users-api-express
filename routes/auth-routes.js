const express = require('express');
const router = express.Router();
const passport = require('passport');
const UserModel = require('../models/user-model.js');
const bcrypt = require('bcrypt');

//------------------------POST SIGNUP---------------------------
router.post('/api/signup', (req, res, next) => {
  if(!req.body.signupEmail || !req.body.signupPassword) {
    res.status(400).json({message: 'Please ensure both email and password are provided'});
    //status 400 is for when the user makes a mistake
    return;
  }

  UserModel.findOne(
    {email: req.body.signupEmail},
    (err, userFromDb) => {
      if (err) {
        next(err);
        return;
      }
      if (userFromDb) {
        res.status(400).json({message: 'The email is already registered'});
        return;
      }
      const salt = bcrypt.genSaltSync(10);
      const scrambledPassword = bcrypt.hashSync(req.body.signupPassword, salt);

      const theUser = new UserModel({
        fullName: req.body.signupFullname,
        email: req.body.signupEmail,
        encryptedPassword: scrambledPassword
      });

      theUser.save((err) => {
        if (err) {
          res.status(500).json({message: 'Failed to save new user'});
          return;
        }

        theUser.encryptedPassword = undefined;
        //removes the encryptedPassword before sending, not from the db
        //but from the object -- it's a security risk to send the encryptedPassword
        //to the front end
        res.status(200).json(theUser);
        //send the user's information to the front end
      });
    }
  );
});

//------------------------POST LOGIN------------------------
// This is different because passport.authenticate() redirects
// APIs normally shouldn't redirect
router.post('/api/login', (req, res, next) => {
  const authenticateFunction =
    passport.authenticate('local', (err, theUser, extraInfo) => {
      // Errors prevented us from deciding if login was succesful or not
      if (err) {
        res.status(500).json({message: 'Unknown Login Error'});
      }
      // Login failed (for sure)
      if (!theUser) {
        res.status(400).json(extraInfo);
      }

      //Login succesful
      req.login(theUser, (err) => {
        if (err) {
          res.status(500).json({message: 'Error during saving session'});
          return;
        }
        theUser.encryptedPassword = undefined;

        //Send the information to the front end
        res.status(200).json(theUser);
      });
  });

  authenticateFunction(req, res, next);
});

// POST logout

// GET checklogin

module.exports = router;
