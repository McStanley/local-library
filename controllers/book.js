const asyncHandler = require('express-async-handler');

exports.list = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Book list');
});

exports.details = asyncHandler(async (req, res, next) => {
  res.send(`NOT IMPLEMENTED: Book details: ${req.params.id}`);
});

exports.create_GET = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Book create GET');
});

exports.create_POST = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Book create POST');
});

exports.delete_GET = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Book delete GET');
});

exports.delete_POST = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Book delete POST');
});

exports.update_GET = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Book update GET');
});

exports.update_POST = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Book update POST');
});
