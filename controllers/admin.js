const Product = require('../models/product');

exports.getAddProducts = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: "Add Products",
    path: "/admin/add-product",
    editing: req.query.edit
  });
};

exports.postAddProducts = (req, res, next) => {
  const {
    title,
    imageUrl,
    description,
    price
  } = req.body;
  const product = new Product(title, price, description, imageUrl, null, req.user._id);
  product.save()
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(err => {
      throw err;
    });
};

exports.getAdminProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render("admin/products", {
        pageTitle: 'Admin Products',
        path: '/admin/products',
        prods: products,
        hasProducts: products.length > 0
      });
    });
};

exports.getEditProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('admin/edit-product', {
        pageTitle: product.title,
        path: '/edit-product',
        product: product,
        editing: req.query.edit
      });
    });
};

exports.postEditProduct = (req, res, next) => {
  const {
    title,
    imageUrl,
    description,
    price,
    productId
  } = req.body;
  const product = new Product(title, price, description, imageUrl, productId, req.user._id);
  product.save()
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(err => {
      throw err;
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.deleteById(productId)
  .then(() => {
    res.redirect('/admin/products');
  })
  .catch(err => {
    throw err;
  });
};