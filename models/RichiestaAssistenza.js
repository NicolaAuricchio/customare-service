const mongoose = require('mongoose');

const RichiestaAssistenzaSchema = new mongoose.Schema({

  descrizione: {
    type: String,
    required: true
  },
  report: {
    type: String,
    default: 'NULL'
  },
  feedback: {
    type: String,
    pattern: '^(\\([1-5]{1}\\))'
  },
  cliente: {
    type: String,
    required: true
  },
  tecnico: {
    type: String,
    default: 'NULL'
  },
  software: {
    type: String,
    required: true
  },
  stato: {
    type: String,
    default: 'NULL'
  }

});

const RichiestaAssistenza = mongoose.model('RichiestaAssistenza', RichiestaAssistenzaSchema);

module.exports = RichiestaAssistenza;
