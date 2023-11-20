const express = require('express');

const router = express.Router();

const catalogController = require('../controllers/catalog');
const bookController = require('../controllers/book');
const authorController = require('../controllers/author');
const genreController = require('../controllers/genre');
const bookInstanceController = require('../controllers/bookInstance');

router.get('/', catalogController.index);

router.get('/book/create', bookController.create_GET);
router.post('/book/create', bookController.create_POST);
router.get('/book/:id/delete', bookController.delete_GET);
router.post('/book/:id/delete', bookController.delete_POST);
router.get('/book/:id/update', bookController.update_GET);
router.post('/book/:id/update', bookController.update_POST);
router.get('/book/:id', bookController.details);
router.get('/books', bookController.list);

router.get('/author/create', authorController.create_GET);
router.post('/author/create', authorController.create_POST);
router.get('/author/:id/delete', authorController.delete_GET);
router.post('/author/:id/delete', authorController.delete_POST);
router.get('/author/:id/update', authorController.update_GET);
router.post('/author/:id/update', authorController.update_POST);
router.get('/author/:id', authorController.details);
router.get('/authors', authorController.list);

router.get('/genre/create', genreController.create_GET);
router.post('/genre/create', genreController.create_POST);
router.get('/genre/:id/delete', genreController.delete_GET);
router.post('/genre/:id/delete', genreController.delete_POST);
router.get('/genre/:id/update', genreController.update_GET);
router.post('/genre/:id/update', genreController.update_POST);
router.get('/genre/:id', genreController.details);
router.get('/genres', genreController.list);

router.get('/book-instance/create', bookInstanceController.create_GET);
router.post('/book-instance/create', bookInstanceController.create_POST);
router.get('/book-instance/:id/delete', bookInstanceController.delete_GET);
router.post('/book-instance/:id/delete', bookInstanceController.delete_POST);
router.get('/book-instance/:id/update', bookInstanceController.update_GET);
router.post('/book-instance/:id/update', bookInstanceController.update_POST);
router.get('/book-instance/:id', bookInstanceController.details);
router.get('/book-instances', bookInstanceController.list);

module.exports = router;
