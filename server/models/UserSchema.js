const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Please provide a username'],
        minlength: [2, 'username must be a least two characters'],
        index: true,
        unique: true,
      },
  password:{
    type: String,
    minlength: [5, 'Password must be at least 5 characters'],
  }
});

UserSchema.plugin(passportLocalMongoose, ); //explicit username declaration. Not really needed?
 
module.exports = mongoose.model('User', UserSchema);
// Setting up username
// https://www.npmjs.com/package/passport-local-mongoose