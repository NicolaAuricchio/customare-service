const mongoose = require('mongoose');

const SoftwareSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    index: true,
    unique: true
  },
  tipo: {
    type: String,
    required: true
  }
  });

  const Software = mongoose.model('Software', SoftwareSchema);

  module.exports = Software;
