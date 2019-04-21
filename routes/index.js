const express = require('express');
const router = express.Router(); //realizzo una istanza dell'oggetto Router
const { ensureAuthenticated } = require('../config/auth');

const RichiestaAssistenza = require('../models/RichiestaAssistenza');
const Release = require('../models/Release');
//const User = require('../models/User');

//Welcome page
router.get('/', (req, res) => res.render('welcome'));

//Dashboard
var hash = 'clienteWebRTC';

// var hash = require('crypto')
//   .createHash('md5')
//   .update('clienteWebRTC')
//   .digest('hex');
// console.log("OUTPUT: hash", hash);

router.get('/formCliente', ensureAuthenticated, (req, res) => {

  if (req.user.ruolo == 'cliente') {
    res.render('formCliente', {
      name: req.user.name,
      relAcquistate: req.user.cliente.releaseAcquistate,
      hash: hash
    })
  }
  else res.end('Permission denied');
});

router.post('/' + hash, ensureAuthenticated, (req, res) => {

  if (req.user.ruolo == 'cliente') {
    const { swSelezionato, descrizione } = req.body;

    Release.findOne({ id: swSelezionato })
      .then(rel => {
        // generiamo una nuova richiesta d'RichiestaAssistenza
        var newReqAss = new RichiestaAssistenza({
          descrizione: descrizione,
          cliente: req.user.email,
          software: rel.nome
        });
        newReqAss.save()
          .then(newReqAss => {
            // console.log('C->PRIMA: ');
            // console.log(require('util').inspect(req.session, false, null, true /* enable colors */))
            req.session.idRichiesta = newReqAss._id;
            // req.session.ruoloUser = req.user.role;
            req.session.save();
            // console.log('C->DOPO: ');
            // console.log(require('util').inspect(req.session, false, null, true /* enable colors */))
            console.log("OUTPUT CLIENTE: req.session.idRichiesta", req.session.idRichiesta);
            console.log('richiesta di assistenza salvata: ' + newReqAss);

          })
          .catch(err => console.log(err));
      })
      .catch(err => { console.log(err) });

    res.render('clienteWebRTC', {//mettimi nel .then che sta sopra
      // name: req.user.name

    })
  }
  else res.end('Permission denied');
});

router.get('/tecnicoWebRTC', ensureAuthenticated, (req, res) => {
  if (req.user.ruolo == 'tecnico') {
    //console.log("OUTPUT TECNICO: req.session.idRichiesta", req.session.idRichiesta);
    //req.session.idRichiesta = null;
    res.render('tecnicoWebRTC', {
      name: req.user.name
    })
  }
  else res.end('Permission denied');
});

router.get('/dashboard3', ensureAuthenticated, (req, res) => {
  if (req.user.ruolo == 'amministratore') {
    res.render('dashboard3', {
      name: req.user.name
    })
  }
  else res.end('Permission denied');
});

module.exports = router;
