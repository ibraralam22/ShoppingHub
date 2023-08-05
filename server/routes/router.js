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
// router.get('/', Auth_ACCESS, Task.getTasks);
// router.get('/tasks/', Auth_ACCESS, Task.getUserTasks);
// router.get('/tasks/all', Auth_ACCESS, Task.getTasks);
// // router.get("/tasks/:taskCategory", Task.getTasksByCategory);
// router.patch('/tasks/:id', Auth_ACCESS, Task.updateTask);
// router.delete('/tasks/:id', Auth_ACCESS, Task.deleteTask);
// router.delete('/task/:id', Auth_ACCESS, Task.softDeleteTask);

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
