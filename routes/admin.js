const express = require('express'),
    router = express.Router(),
    adminController = require('../controllers/admin'),
    isAuth = require('../middleware/is-auth'),
    {
        postProductValidation
    } = require('../middleware/is-valid');



// renders the admin/add-product.ejs file which comprises the add-product form
router.get('/add-product', isAuth, adminController.getAddProducts);

// handles the post requests coming from the add-products form
router.post('/add-product', isAuth, postProductValidation, adminController.postAddProducts);

//renders the admin/products.ejs file
router.get('/products', isAuth, adminController.getAdminProducts);

//renders the admin/edit-product.ejs file
router.get('/edit-product/:productId', isAuth, adminController.getEditProduct);

//updates a specific product with the form input data
router.post('/edit-product', isAuth, postProductValidation, adminController.postEditProduct);

//deletes a specific product from the db
router.post('/delete-product', isAuth, adminController.postDeleteProduct);

module.exports = router;