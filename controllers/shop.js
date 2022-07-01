const Product = require('../models/product');
// const Cart = require('../models/cart');


exports.getHomePage = (req, res, next) => {
  res.render('shop/index', {
    pageTitle: 'Home Page',
    path: '/'
  });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render("shop/product-list", {
        pageTitle: "Products",
        products: products,
        path: '/products',
        hasProducts: products.length > 0
      });
    })
    .catch(err => {
      throw err;
    })
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      res.render('shop/product-details', {
        pageTitle: product.title,
        path: '/products',
        product: product
      });
    })
    .catch(err => {
      throw err;
    });
};

exports.getCart = (req, res, next) => {
  Cart.getCart(cart => {
    Product.fetchAll(products => {
      const cartProducts = [];
      products.forEach(product => {
        const cartProductData = cart.products.find(prod => prod.id === product.id);
        if (cartProductData) {
          cartProducts.push({
            productData: product,
            quantity: cartProductData.quantity
          });
        }
      });
      res.render('shop/cart', {
        pageTitle: 'Cart',
        path: '/cart',
        cart: cartProducts
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByID(prodId, product => {
    Cart.addProduct(prodId, product.price);
    res.redirect('/cart');
  });
};

exports.deleteCartProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByID(prodId, product => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect('/cart');
  });
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    pageTitle: 'Orders',
    path: '/orders'
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    pageTitle: 'Checkout',
    path: '/checkout'
  });
};