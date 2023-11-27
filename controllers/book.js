const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const Book = require('../models/Book');
const BookInstance = require('../models/BookInstance');
const Author = require('../models/Author');
const Genre = require('../models/Genre');

exports.list = asyncHandler(async (req, res, next) => {
  const allBooks = await Book.find({}, 'title author')
    .sort({ title: 1 })
    .populate('author')
    .exec();

  res.render('book/list', { title: 'Book List', bookList: allBooks });
});

exports.details = asyncHandler(async (req, res, next) => {
  const [book, bookInstances] = await Promise.all([
    Book.findById(req.params.id).populate('author').populate('genre').exec(),
    BookInstance.find({ book: req.params.id }).exec(),
  ]);

  if (book === null) {
    const err = new Error('Book not found');
    err.status = 404;
    next(err);
    return;
  }

  res.render('book/details', {
    title: book.title,
    book,
    bookInstances,
  });
});

exports.create_GET = asyncHandler(async (req, res, next) => {
  const [authors, genres] = await Promise.all([
    Author.find().exec(),
    Genre.find().exec(),
  ]);

  res.render('book/form', {
    title: 'Create Book',
    authors,
    genres,
  });
});

exports.create_POST = [
  (req, res, next) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre = req.body.genre ? [req.body.genre] : [];
    }

    next();
  },

  body('title', 'Title must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('author', 'Author must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('summary', 'Summary must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('isbn', 'ISBN must not be empty').trim().isLength({ min: 1 }).escape(),
  body('genre.*').escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre,
    });

    if (!errors.isEmpty()) {
      const [authors, genres] = await Promise.all([
        Author.find().exec(),
        Genre.find().exec(),
      ]);

      for (const genre of genres) {
        if (book.genre.includes(genre._id)) {
          genre.checked = true;
        }
      }

      res.render('book/form', {
        title: 'Create Book',
        authors,
        genres,
        book,
        errors: errors.array(),
      });

      return;
    }

    await book.save();
    res.redirect(book.url);
  }),
];

exports.delete_GET = asyncHandler(async (req, res, next) => {
  const [book, bookInstances] = await Promise.all([
    Book.findById(req.params.id),
    BookInstance.find({ book: req.params.id }, 'imprint'),
  ]);

  if (!book) {
    res.redirect('/catalog/books');
    return;
  }

  res.render('book/delete', {
    title: 'Delete Book',
    book,
    bookInstances,
  });
});

exports.delete_POST = asyncHandler(async (req, res, next) => {
  const [book, bookInstances] = await Promise.all([
    Book.findById(req.body.documentId).exec(),
    BookInstance.find({ book: req.body.documentId }, 'imprint').exec(),
  ]);

  if (bookInstances.length) {
    res.render('book/delete', {
      title: 'Delete Book',
      book,
      bookInstances,
    });

    return;
  }

  await Book.findByIdAndDelete(req.body.documentId);
  res.redirect('/catalog/books');
});

exports.update_GET = asyncHandler(async (req, res, next) => {
  const [book, authors, genres] = await Promise.all([
    Book.findById(req.params.id).populate('author').populate('genre').exec(),
    Author.find().exec(),
    Genre.find().exec(),
  ]);

  if (!book) {
    const err = new Error('Book not found');
    err.status = 404;
    next(err);
    return;
  }

  for (const genre of genres) {
    if (book.genre.includes(genre._id)) {
      genre.checked = true;
    }
  }

  res.render('book/form', {
    title: 'Update Book',
    book,
    authors,
    genres,
  });
});

exports.update_POST = [
  (req, res, next) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre = req.body.genre ? [req.body.genre] : [];
    }

    next();
  },

  body('title', 'Title must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('author', 'Author must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('summary', 'Summary must not be empty.')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('isbn', 'ISBN must not be empty').trim().isLength({ min: 1 }).escape(),
  body('genre.*').escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const book = new Book({
      _id: req.params.id,
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre,
    });

    if (!errors.isEmpty()) {
      const [authors, genres] = await Promise.all([
        Author.find().exec(),
        Genre.find().exec(),
      ]);

      for (const genre of genres) {
        if (book.genre.includes(genre._id)) {
          genre.checked = true;
        }
      }

      res.render('book/form', {
        title: 'Update Book',
        book,
        authors,
        genres,
        errors: errors.array(),
      });

      return;
    }

    await Book.findByIdAndUpdate(book._id, book);
    res.redirect(book.url);
  }),
];
