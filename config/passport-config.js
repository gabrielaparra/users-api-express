const passport        = require('passport');
const bcrypt          = require('bcrypt');
const LocalStrategy   = require('passport-local').Strategy;

const UserModel       = require('../models/user-model.js');

//Save the user's ID in the session (called when the user logs in)
passport.serializeUser((userFromDb, next) => {
  next(null, userFromDb._id);
});

//Retrieve the user's info fromt the DB with the ID inside the session
passport.deserializeUser((id, next) => {
  UserModel.findById(
    id,
    (err, userFromDb) => {
      if (err) {
        next(err);
        return;
      }
      next(null, userFromDb);
    }
  );
});

// email & password login strategy
passport.use(new LocalStrategy(
  {
    usernameField: 'loginEmail',
    passwordField: 'loginPassword'
    //both sent through AJAX from Angular
  },
  (theEmail, thePassword, next) => {
    UserModel.findOne (
      { email: theEmail },
      (err, userFromDb) => {
        if (err) {
          next(err);
          return;
        }
        if (userFromDb === null) {
          next(null, false, {message: 'Incorrect email'});
          return;
          //login failed due to wrong email input
        }
        if (!bcrypt.compareSync(thePassword, userFromDb.encryptedPassword)) {
          next(null, false, { message: 'Incorrect password'});
          return;
          //login failed due to wrong password
        }

        next(null, userFromDb);
        //login was succesful
      }
    ); //end of UserModel.findOne()
  }
));
