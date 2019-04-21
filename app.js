const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session')({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
});
const passport = require('passport');
const sharedsession = require("express-socket.io-session");

const app = express(); //sto usando la top-lev function esportata dal modulo express

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

//Passport Config
require('./config/passport')(passport);

//DB Config
const db = require('./config/keys').MongoURI;
mongoose.set('useCreateIndex', true); //elimina il deprecation warning : collection.ensureIndex() is deprecated. use createIndex instead

//Connect to Mongo
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log('MongoDB connesso'))
  .catch(err => console.log(err));

//ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');

//Bodyparser
app.use(express.urlencoded({ extended: false }));

//Express Session Middleware
// app.use(
//   session({
//     secret: 'secret',
//     resave: true,
//     saveUninitialized: true
//   })
// );
app.use(session);

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());
//Connect flash
app.use(flash());

//Global Vars
app.use((req, res, next) => {
  //app.use(fuction(req,res,next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//Routes
app.use('/', require('./routes/index'));
app.use('/users', require('./routes/users'));
// Static public folder
app.use(express.static('public'));

//------------------------------ESPERIMENTI SOCKETIO----------------------------------//
//Condivido la sessione 'express' con socket.io
io.use(
  sharedsession(session, {
  })
);

io.on('connection', socket => {

  console.log('Si è connesso ' + socket.id);
  var idReq = socket.handshake.session.idRichiesta;
  var ruolo;
  if (idReq) {
    ruolo = 'cliente';
    setTimeout(() => {
      console.log('roba della connection ' + socket.handshake.session.idRichiesta);
    }, 10000);
  }
  else {
    ruolo = 'tecnico';
    console.log('probabilmente un tecnico ' + socket.handshake.session.idRichiesta);
  }

  // if (ruolo == 'cliente')
  //   socket.join('prova');
  // else
  //   socket.join('prova');
  
  // socket.broadcast.to('prova').emit('join', 'qualcuno si è unito alla stanza');

  const RichiestaAssistenza = require('./models/RichiestaAssistenza');

  socket.on('cliente passa a got user media', msg => {
    console.log('cliente ' + socket.id + ' ha cambiato stato in got user media');
    socket.join(idReq);
    console.log('COSE ' + socket.handshake.session.idRichiesta)

    // RichiestaAssistenza.findById( idReq )
    // .then(reqAss => {
    //   console.log('RICERCA RICHIESTA DI ASSISTENZA CON ID: ' + idReq);
    //   console.log('RICHIESTA DI ASSISTENZA TROVATA ' + reqAss);
    //   // reqAss.stato = 'pending';
    //   // reqAss.save()
    //   //   .then (reqAss => {
    //   //     console.log('stato della reqAss cambiato');
    //   //   })
    //   //   .catch(err => console.log(err));
    //   })
    // .catch(err => { console.log(err) });
  });
  
  
  
  
  /*
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
      console.log(data);
    });
    */
});

//-----------------------------------------------------------------------------------//
const PORT = process.env.PORT || 9000; //o uso la variabile d'ambiente PORT o 9000

//app.listen(PORT, console.log(`Server started on port ${PORT}`));
server.listen(PORT, console.log(`Server started on port ${PORT}`));
