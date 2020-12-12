var mongoose = require('mongoose');

var bookSchema = mongoose.Schema({
  author:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'user'
  },
  bookprice: Number,
  bookname: String
});
 module.exports = mongoose.model('book', bookSchema);
