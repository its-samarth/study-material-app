const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  file: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File',
    required: true,
  },
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
