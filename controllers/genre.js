const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');

const Genre = require('../models/Genre');
const Book = require('../models/Book');

exports.list = asyncHandler(async (req, res, next) => {
  const allGenres = await Genre.find().sort({ name: 1 }).exec();

  res.render('genre/list', {
    title: 'Genre List',
    genreList: allGenres,
  });
});

exports.details = asyncHandler(async (req, res, next) => {
  const [genre, books] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }, 'title summary').exec(),
  ]);

  if (genre === null) {
    const err = new Error('Genre not found');
    err.status = 404;
    next(err);
    return;
  }

  res.render('genre/details', {
    title: 'Genre Details',
    genre,
    books,
  });
});

exports.create_GET = (req, res, next) => {
  res.render('genre/form', { title: 'Create Genre' });
};

exports.create_POST = [
  body('name', 'Genre name must contain at least 3 characters')
    .trim()
    .isLength({ min: 3 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const genre = new Genre({ name: req.body.name });

    if (!errors.isEmpty()) {
      res.render('genre/form', {
        title: 'Create Genre',
        genre,
        errors: errors.array(),
      });

      return;
    }

    const existingGenre = await Genre.findOne({ name: req.body.name })
      .collation({ locale: 'en', strength: 2 })
      .exec();

    if (existingGenre) {
      res.redirect(existingGenre.url);
    } else {
      await genre.save();
      res.redirect(genre.url);
    }
  }),
];

exports.delete_GET = asyncHandler(async (req, res, next) => {
  const [genre, books] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Book.find({ genre: req.params.id }, 'title summary').exec(),
  ]);

  if (!genre) {
    res.redirect('/catalog/genres');
    return;
  }

  res.render('genre/delete', {
    title: 'Delete Genre',
    genre,
    books,
  });
});

exports.delete_POST = asyncHandler(async (req, res, next) => {
  const [genre, books] = await Promise.all([
    Genre.findById(req.body.documentId).exec(),
    Book.find({ genre: req.body.documentId }, 'title summary').exec(),
  ]);

  if (books.length) {
    res.render('genre/delete', {
      title: 'Delete Genre',
      genre,
      books,
    });

    return;
  }

  await Genre.findByIdAndDelete(req.body.documentId);
  res.redirect('/catalog/genres');
});

exports.update_GET = asyncHandler(async (req, res, next) => {
  const genre = await Genre.findById(req.params.id);

  res.render('genre/form', {
    title: 'Update Genre',
    genre,
  });
});

exports.update_POST = [
  body('name', 'Genre name must contain at least 3 characters')
    .trim()
    .isLength({ min: 3 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const genre = new Genre({ _id: req.params.id, name: req.body.name });

    if (!errors.isEmpty()) {
      res.render('genre/form', {
        title: 'Update Genre',
        genre,
        errors: errors.array(),
      });

      return;
    }

    const existingGenre = await Genre.findOne({ name: genre.name })
      .collation({ locale: 'en', strength: 2 })
      .exec();

    if (
      existingGenre &&
      existingGenre._id.toString() !== genre._id.toString()
    ) {
      res.redirect(existingGenre.url);
    } else {
      await Genre.findByIdAndUpdate(genre._id, genre);
      res.redirect(genre.url);
    }
  }),
];
