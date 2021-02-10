const express = require('express'),
  router = express.Router(),
  adminController = require('../controllers/admin');



// renders the admin/add-product.ejs file which comprises the add-product form
router.get('/add-product', adminController.getAddProducts);

// handles the post requests coming from the add-products form
router.post('/add-product', adminController.postAddProducts);

//renders the admin/products.ejs file
router.get('/products', adminController.getAdminProducts);


module.exports = router;