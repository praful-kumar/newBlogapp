var mongoose = require('mongoose');
var plm = require('passport-local-mongoose');


mongoose.connect('mongodb://localhost/newBlogAapp');
var userSchema = mongoose.Schema({
  name : String,
  username: String,
  email: String,
  password: String,
  book:[{
    type: mongoose.Schema.Types.ObjectId,
    ref:'book'
  }]
});
 userSchema.plugin(plm);
 module.exports = mongoose.model('user', userSchema);
