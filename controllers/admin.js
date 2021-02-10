const Product = require('../models/product');

exports.getAddProducts = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: "Add Products",
    path: "/admin/add-product"
  });
};

exports.postAddProducts = (req, res, next) => {
  const {
    title,
    imageurl,
    description,
    price
  } = req.body;
  const product = new Product(title, imageurl, description, price);
  product.save();
  res.render('shop/index', {
    pageTitle: 'Home Page',
    path: '/'
  });
};

exports.getAdminProducts = (req, res, next) => {
  res.render('admin/products', {
    pageTitle: 'Admin Products',
    path: '/admin/products'
  });
};