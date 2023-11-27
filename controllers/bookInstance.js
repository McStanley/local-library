const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const BookInstance = require('../models/BookInstance');
const Book = require('../models/Book');

exports.list = asyncHandler(async (req, res, next) => {
  const allBookInstances = await BookInstance.find().populate('book').exec();

  res.render('book-instance/list', {
    title: 'Book Instance List',
    bookInstanceList: allBookInstances,
  });
});

exports.details = asyncHandler(async (req, res, next) => {
  const bookInstance = await BookInstance.findById(req.params.id)
    .populate('book')
    .exec();

  if (bookInstance === null) {
    const err = new Error('Book copy not found');
    err.status = 404;
    next(err);
    return;
  }

  res.render('book-instance/details', {
    title: `${bookInstance.book.title}: ${bookInstance._id}`,
    bookInstance,
  });
});

exports.create_GET = asyncHandler(async (req, res, next) => {
  const books = await Book.find({}, 'title').exec();

  res.render('book-instance/form', {
    title: 'Create Book Instance',
    books,
  });
});

exports.create_POST = [
  body('book', 'Book must be specified').trim().isLength({ min: 1 }).escape(),
  body('imprint', 'Imprint must be specified')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('status').escape(),
  body('dueBack', 'Invalid date')
    .optional({ values: 'falsy' })
    .isISO8601()
    .toDate(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const bookInstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.dueBack,
    });

    if (!errors.isEmpty()) {
      const books = await Book.find({}, 'title').exec();

      res.render('book-instance/form', {
        title: 'Create BookInstance',
        books,
        bookInstance,
        selectedBook: bookInstance.book._id,
        errors: errors.array(),
      });

      return;
    }

    await bookInstance.save();
    res.redirect(bookInstance.url);
  }),
];

exports.delete_GET = asyncHandler(async (req, res, next) => {
  const bookInstance = await BookInstance.findById(req.params.id)
    .populate('book')
    .exec();

  if (!bookInstance) {
    res.redirect('/catalog/book-instances');
    return;
  }

  res.render('book-instance/delete', {
    title: 'Delete Book Instance',
    bookInstance,
  });
});

exports.delete_POST = asyncHandler(async (req, res, next) => {
  await BookInstance.findByIdAndDelete(req.body.documentId);
  res.redirect(`/catalog/book-instances`);
});

exports.update_GET = asyncHandler(async (req, res, next) => {
  const [bookInstance, books] = await Promise.all([
    BookInstance.findById(req.params.id).exec(),
    Book.find({}, 'title').exec(),
  ]);

  if (!bookInstance) {
    res.redirect('/catalog/book-instances');
  }

  res.render('book-instance/form', {
    title: 'Update Book Instance',
    bookInstance,
    books,
    selectedBook: bookInstance.book.toString(),
  });
});

exports.update_POST = [
  body('book', 'Book must be specified').trim().isLength({ min: 1 }).escape(),
  body('imprint', 'Imprint must be specified')
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body('status').escape(),
  body('dueBack', 'Invalid date')
    .optional({ values: 'falsy' })
    .isISO8601()
    .toDate(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const bookInstance = new BookInstance({
      _id: req.params.id,
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.dueBack,
    });

    if (!errors.isEmpty()) {
      const books = await Book.find({}, 'title').exec();

      res.render('book-instance/form', {
        title: 'Update Book instance',
        books,
        bookInstance,
        selectedBook: bookInstance.book._id,
        errors: errors.array(),
      });

      return;
    }

    await BookInstance.findByIdAndUpdate(bookInstance._id, bookInstance);
    res.redirect(bookInstance.url);
  }),
];
