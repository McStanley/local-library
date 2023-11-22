const asyncHandler = require('express-async-handler');

const Book = require('../models/Book');
const BookInstance = require('../models/BookInstance');
const Author = require('../models/Author');
const Genre = require('../models/Genre');

exports.index = asyncHandler(async (req, res, next) => {
  const [
    bookCount,
    bookInstanceCount,
    bookInstanceAvailableCount,
    authorCount,
    genreCount,
  ] = await Promise.all([
    Book.countDocuments({}).exec(),
    BookInstance.countDocuments({}).exec(),
    BookInstance.countDocuments({ status: 'Available' }).exec(),
    Author.countDocuments({}).exec(),
    Genre.countDocuments({}).exec(),
  ]);

  res.render('index', {
    title: 'Local Library',
    bookCount,
    bookInstanceCount,
    bookInstanceAvailableCount,
    authorCount,
    genreCount,
  });
});
