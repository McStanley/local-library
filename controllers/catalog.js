const asyncHandler = require('express-async-handler');

exports.index = asyncHandler(async (req, res, next) => {
  res.send('NOT IMPLEMENTED: Catalog Home Page');
});