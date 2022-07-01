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
    imageUrl,
    description,
    price
  } = req.body;
  const product = new Product(title, price, description, imageUrl);
  product.save()
  .then(result => {
    console.log(result);
    res.redirect('admin/products');
  })
  .catch(err=>{
    throw err;
  });
  // res.render('shop/index', {
  //   pageTitle: 'Home Page',
  //   path: '/'
  // });
};

exports.getAdminProducts = (req, res, next) => {
  Product.fetchAll(products => {
    res.render("admin/products", {
      pageTitle: 'Admin Products',
      path: '/admin/products',
      products: products,
      hasProducts: products.length > 0
    });
  });
};

exports.getEditProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findByID(prodId, product => {
    res.render('admin/edit-product', {
      pageTitle: product.title,
      path: '/edit-product',
      product: product
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  const {
    productId,
    title,
    imageUrl,
    description,
    price
  } = req.body;
  Product.update(productId, title, imageUrl, description, price);
  res.render('shop/index', {
    pageTitle: 'Home Page',
    path: '/'
  });
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.delete(productId);
  res.render('shop/index', {
    pageTitle: 'Home Page',
    path: '/'
  });
};