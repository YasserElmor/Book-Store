const express = require('express'),
    router = express.Router(),
    adminController = require('../controllers/admin');



// renders the admin/add-product.ejs file which comprises the add-product form
router.get('/add-product', adminController.getAddProducts);

// handles the post requests coming from the add-products form
router.post('/add-product', adminController.postAddProducts);

//renders the admin/products.ejs file
router.get('/products', adminController.getAdminProducts);

//renders the admin/edit-product.ejs file
router.get('/edit-product/:productId', adminController.getEditProduct);

//updates a specific product with the form input data
router.post('/edit-product', adminController.postEditProduct);

//deletes a specific product from the db
router.post('/delete-product', adminController.postDeleteProduct);

module.exports = router;