const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const Author = require('../models/Author');
const Book = require('../models/Book');

exports.list = asyncHandler(async (req, res, next) => {
  const allAuthors = await Author.find().sort({ family_name: 1 }).exec();

  res.render('author/list', {
    title: 'Author List',
    authorList: allAuthors,
  });
});

exports.details = asyncHandler(async (req, res, next) => {
  const [author, books] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, 'title summary').exec(),
  ]);

  if (author === null) {
    const err = new Error('Author not found');
    err.status = 404;
    next(err);
    return;
  }

  res.render('author/details', {
    title: 'Author Details',
    author,
    books,
  });
});

exports.create_GET = (req, res, next) => {
  res.render('author/form', { title: 'Create Author' });
};

exports.create_POST = [
  body('firstName')
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage('First name must be specified.')
    .isAlphanumeric()
    .withMessage('First name has non-alphanumeric characters.'),
  body('familyName')
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage('Family name must be specified.')
    .isAlphanumeric()
    .withMessage('Family name has non-alphanumeric characters.'),
  body('dateOfBirth', 'Invalid date of birth')
    .optional({ values: 'falsy' })
    .isISO8601()
    .toDate(),
  body('dateOfDeath', 'Invalid date of death')
    .optional({ values: 'falsy' })
    .isISO8601()
    .toDate(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const author = new Author({
      first_name: req.body.firstName,
      family_name: req.body.familyName,
      date_of_birth: req.body.dateOfBirth,
      date_of_death: req.body.dateOfDeath,
    });

    if (!errors.isEmpty()) {
      res.render('author/form', {
        title: 'Create Author',
        author,
        errors: errors.array(),
      });

      return;
    }

    await author.save();
    res.redirect(author.url);
  }),
];

exports.delete_GET = asyncHandler(async (req, res, next) => {
  const [author, books] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({ author: req.params.id }, 'title summary').exec(),
  ]);

  if (!author) {
    res.redirect('/catalog/authors');
    return;
  }

  res.render('author/delete', {
    title: 'Delete Author',
    author,
    books,
  });
});

exports.delete_POST = asyncHandler(async (req, res, next) => {
  const [author, books] = await Promise.all([
    Author.findById(req.body.documentId).exec(),
    Book.find({ author: req.body.documentId }, 'title summary').exec(),
  ]);

  if (books.length) {
    res.render('author/delete', {
      title: 'Delete Author',
      author,
      books,
    });

    return;
  }

  await Author.findByIdAndDelete(req.body.documentId);
  res.redirect('/catalog/authors');
});

exports.update_GET = asyncHandler(async (req, res, next) => {
  const author = await Author.findById(req.params.id);

  res.render('author/form', {
    title: 'Update Author',
    author,
  });
});

exports.update_POST = [
  body('firstName')
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage('First name must be specified.')
    .isAlphanumeric()
    .withMessage('First name has non-alphanumeric characters.'),
  body('familyName')
    .trim()
    .escape()
    .isLength({ min: 1 })
    .withMessage('Family name must be specified.')
    .isAlphanumeric()
    .withMessage('Family name has non-alphanumeric characters.'),
  body('dateOfBirth', 'Invalid date of birth')
    .optional({ values: 'falsy' })
    .isISO8601()
    .toDate(),
  body('dateOfDeath', 'Invalid date of death')
    .optional({ values: 'falsy' })
    .isISO8601()
    .toDate(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const author = new Author({
      _id: req.params.id,
      first_name: req.body.firstName,
      family_name: req.body.familyName,
      date_of_birth: req.body.dateOfBirth,
      date_of_death: req.body.dateOfDeath,
    });

    if (!errors.isEmpty()) {
      res.render('author/form', {
        title: 'Update Author',
        author,
        errors: errors.array(),
      });

      return;
    }

    await Author.findByIdAndUpdate(author._id, author);
    res.redirect(author.url);
  }),
];
