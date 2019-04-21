const mongoose = require('mongoose');

const ReleaseSchema = new mongoose.Schema({
  id:{
    type: String,
    required: true,
    index: true,
    unique: true
  },
  nome: {             //questo è il nome del software dello schema Software (chiave esterna)
    type: String,
    required: true
  },
  versione: {
    type: String,
    required: true
  }
  });

  const Release = mongoose.model('Release', ReleaseSchema);

  module.exports = Release;
