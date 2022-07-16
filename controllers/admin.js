const Product = require('../models/product');
const {
  validationResult
} = require('express-validator');
const catchError500 = require('../util/catchError500');


exports.getAddProducts = (req, res, next) => {
  try {
    res.render('admin/edit-product', {
      pageTitle: "Add Products",
      path: "/admin/add-product",
      editing: req.query.edit,
      errorMessage: null,
      validationErrors: []
    });
  } catch (err) {
    return next(catchError500(err));
  }
};
exports.postAddProducts = (req, res, next) => {
  const {
    title,
    imageUrl,
    description,
    price
  } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: req.query.edit,
      product: {
        title: title,
        imageUrl: imageUrl,
        description: description,
        price: price
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user._id
  });
  product.save()
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(err => {
      return next(catchError500(err));
    });
};

exports.getAdminProducts = (req, res, next) => {
  Product.find({
      userId: req.user._id
    })
    .then(products => {
      res.render("admin/products", {
        pageTitle: 'Admin Products',
        path: '/admin/products',
        prods: products,
        hasProducts: products.length > 0,
      });
    })
    .catch(err => {
      return next(catchError500(err));
    });
};

exports.getEditProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('admin/edit-product', {
        pageTitle: product.title,
        path: '/admin/edit-product',
        product: product,
        editing: req.query.edit,
        errorMessage: null,
        validationErrors: []
      });
    })
    .catch(err => {
      return next(catchError500(err));
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      product: {
        title: title,
        imageUrl: imageUrl,
        description: description,
        price: price,
        _id: productId
      },
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }
  return Product.findById(productId)
    .then(product => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect('/');
      }
      [product.title, product.imageUrl, product.description, product.price] = [title, imageUrl, description, price];
      return product.save()
        .then(() => {
          res.redirect('/admin/products');
        })
        .catch(err => {
          return next(catchError500(err));
        });
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const productId = req.body.productId;
  Product.deleteOne({
      _id: productId,
      userId: req.user._id
    })
    .then(() => {
      res.redirect('/admin/products');
    })
    .catch(err => {
      return next(catchError500(err));
    });
};