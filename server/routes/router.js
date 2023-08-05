const router = require('express').Router();
const Product = require('../controller/productController');
const Category = require('../controller/categoryController');
const Register = require('../controller/registerController');
const Login = require('../controller/loginController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); // Set the destination folder for uploaded files
const { Auth_ACCESS } = require('../middleware/auth');

// # Products Routes
router.post('/products/create', Auth_ACCESS, upload.array('files'), Product.createProduct);
router.get('/products', Auth_ACCESS, Product.getProducts);
router.patch('/products/:id', Auth_ACCESS, Product.updateProduct);
router.delete('/products/:id', Auth_ACCESS, Product.softDeleteProduct);

// # Category Routes
router.post('/categories/create', Auth_ACCESS, Category.createCategory);
router.get('/categories', Auth_ACCESS, Category.getCategories);
router.put('/categories/:id', Auth_ACCESS, Category.updateCategory);
router.delete('/categories/:id', Auth_ACCESS, Category.softDeleteCategory);

// #User & Admin Register
router.post('/register', Register.signUp);

// #User & Admin Login
router.post('/login', Login.signIn);
router.get('/users', Login.getUsers);

module.exports = router;
