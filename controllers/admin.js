const Product = require('../models/product');
const {
  validationResult
} = require('express-validator');
const catchError500 = require('../util/catchError500');
const fileHelper = require('../util/file');

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
    imageUrl: req.file.path,
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
      [product.title, product.description, product.price] = [title, description, price];
      if (req.file) {
        fileHelper.deleteFile(product.imageUrl);
        product.imageUrl = req.file.path;
      }
      return product.save()
        .then(() => {
          res.redirect('/admin/products');
        })
        .catch(err => {
          return next(catchError500(err));
        });
    });
};

exports.postDeleteProduct = async (req, res, next) => {
  try {
    const productId = req.body.productId;
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error('Product Not Found!');
    }
    fileHelper.deleteFile(product.imageUrl);
    await Product.deleteOne({
      _id: productId,
      userId: req.user._id
    });
    res.redirect('/admin/products');
  } catch (err) {
    return next(catchError500(err));
  };
};