const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  ruolo: {
    type: String,
    default: 'cliente'
  },
  cliente: {
    releaseAcquistate: [{
      type: String
    }],
    stato: {
      type: String,
      default: 'NULL'
    }
  },
  tecnico: {
    softwareDiCompetenza: [{
      type: String
    }],
    stato: {
      type: String,
      default: 'NULL'
    }
  }

});





const User = mongoose.model('User', UserSchema);

module.exports = User;
