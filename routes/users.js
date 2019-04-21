const express = require('express');
const router = express.Router(); //realizzo una istanza dell'oggetto Router
const bcrypt = require('bcryptjs');
const passport = require('passport');

//User model
const User = require('../models/User');

//Login Page
router.get('/login', (req, res) => res.render('login'));

//Register Page
router.get('/register', (req, res) => res.render('register'));

// Register Handle
router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  //Check required fields
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Please fill in all fields' });
  }

  //Check passwords match
  if (password !== password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  //Check pass length
  if (password.length < 6) {
    errors.push({ msg: 'Password should be at least 6 characters' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          //creo una nuova istanzanza di User (entry del database)
          name,
          email,
          password
        });

        /////////////////////////////////////////////////////////////

        //  const Software = require('../models/Software');
        //  const RichiestaAssistenza = require('../models/RichiestaAssistenza');
        //  const Release = require('../models/Release');

        //  const newSoft = new Software({
        //    nome: 'Office',
        //    tipo: 'ufficio'
        //  });
        //  newSoft.save();

        //  const newSoft2 = new Software({
        //    nome: 'Matlab',
        //    tipo: 'calcolo scientifico'
        //  });
        //  newSoft2.save();

        //  const newRel = new Release({
        //    id: 'Office2018',
        //    nome: 'Office',
        //    versione: '2018'
        //  });
        //  newRel.save();

        //  const newRel1 = new Release({
        //    id: 'Matlab2019a',
        //    nome: 'Matlab',
        //    versione: '2019a'
        //  });
        //  newRel1.save();


         
        //  newUser.cliente.releaseAcquistate = ['Matlab2019a', 'Office2018'];

          //newUser.ruolo = 'tecnico';
          //newUser.tecnico.softwareDiCompetenza = ['Office', 'Photoshop'];


        
        
         // newRel1
        //   .save()
        //   .then(newRel1 => console.log('tuttoappost'))
        //   .catch(err => console.log('hai inserito un doppione' + err));

        // const newReqAss = new RichiestaAssistenza({
        //   id: '0932103912',
        //   descrizione: 'ciò i problemi',
        //   report: 'il cliente ci ha avuto dei problemi',
        //   feedback: '4',
        //   cliente: newUser.email,
        //   tecnico: 'staff@staff.it',
        //   software: 'Matlab'
        // });

        // newReqAss.save();

        ////////////////////////////////////////////////////////////////////

        //Hash Password
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            //Set password to hashed
            newUser.password = hash;
            //Save user
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
});

// Login Handle
router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/users/login',
    failureFlash: true
  }),
  (req, res, next) => {
    switch (req.user.ruolo) {
      case 'cliente':
        res.redirect('/formCliente');
        break;
      case 'tecnico':
        res.redirect('/tecnicoWebRTC');
        break;
      case 'amministratore':
        res.redirect('/dashboard3');
        break;
    }
  }
);

// Logout Handle
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
