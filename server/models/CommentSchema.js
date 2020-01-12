const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'No empty comments please'],
    minlength: [2, 'comment must be at least two characters']
  },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId, //storing user ID
      ref: 'User', //what we're using to refer
    },
    username: {
      type: String,
    }
  }
});

module.exports = mongoose.model('Comment', commentSchema);
