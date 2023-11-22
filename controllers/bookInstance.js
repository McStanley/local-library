const asyncHandler = require('express-async-handler');

const BookInstance = require('../models/BookInstance');

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
  res.send('NOT IMPLEMENTED: BookInstance create GET');
});

exports.create_POST = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: BookInstance create POST');
});

exports.delete_GET = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: BookInstance delete GET');
});

exports.delete_POST = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: BookInstance delete POST');
});

exports.update_GET = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: BookInstance update GET');
});

exports.update_POST = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: BookInstance update POST');
});
