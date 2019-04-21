const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Local User Model
const User = require('../models/User');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      //il campo password è automaticamente settato alla variabile password proveniente dalla richiesta:
      //http://walidhosseini.com/journal/2014/10/18/passport-local-strategy-auth.html


      //Match User
      User.findOne({ email: email })
        .then(user => {
          if(!user){
            return done(null, false, { message: 'That email is not registerd' });
          }

          //Match password
          bcrypt.compare(password, user.password, (err, isMatch) => {
            if(err) throw err;

            if(isMatch){
              return done(null, user);
            }else{
              return done(null, false, {message:'Password incorrect'});
            }
          });
        })
        .catch(err => console.log(err))
    })
  );

//dalla doc di passport: serve a prendere i cookies da/verso la sessione
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
}
